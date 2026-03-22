// FILE: ~/smart-shopper/client/functions/index.ts

import * as functions from 'firebase-functions/v2';
import { onRequest } from 'firebase-functions/v2/https';
import { defineString, defineInt } from 'firebase-functions/params';
import { onInit } from 'firebase-functions/v2/core';
import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import * as admin from 'firebase-admin';

// Add this after your imports (around line 15)
declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email?: string; 
        role: string;
        employeeId: string | null;
        dbId: string | null;
      } | null;
    }
  }
}

// Initialize Firebase Admin
admin.initializeApp();

// ============= ID GENERATION =============
type EntityType = 'product' | 'user' | 'order' | 'employee' | 'proof';

const generateId = (type: EntityType): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  const prefix = {
    product: 'PRO',
    user: 'USR',
    order: 'ORD',
    employee: 'EMP',
    proof: 'PRF'
  }[type];
  
  return `${prefix}_${timestamp}_${random}`;
};

const generateProductId = (): string => generateId('product');
const generateEmployeeId = (): string => generateId('employee');

// Define parameters
const pgHost = defineString('POSTGRES_HOST', { default: 'localhost' });
const pgPort = defineInt('POSTGRES_PORT', { default: 5432 });
const pgDatabase = defineString('POSTGRES_DATABASE');
const pgUser = defineString('POSTGRES_USER');
const pgPassword = defineString('POSTGRES_PASSWORD');

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

let pool: Pool;

// ============= DATABASE FUNCTIONS =============

async function tableExists(client: any, tableName: string): Promise<boolean> {
  const result = await client.query(`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = $1
    );
  `, [tableName]);
  return result.rows[0].exists;
}

async function ensureTablesExist(client: any): Promise<void> {
  // Employees table with custom ID field
  if (!await tableExists(client, 'employees')) {
    console.log('Creating employees table...');
    await client.query(`
      CREATE TABLE employees (
        id VARCHAR(50) PRIMARY KEY,                    -- Custom ID: EMP_1700000000_abc123
        firebase_uid VARCHAR(128) NOT NULL UNIQUE,     -- Firebase Auth UID
        email VARCHAR(255) NOT NULL UNIQUE,
        full_name VARCHAR(255),
        department VARCHAR(100),
        hire_date DATE,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  // Product types table (still uses SERIAL - it's just a lookup table)
  if (!await tableExists(client, 'product_types')) {
    console.log('Creating product_types table...');
    await client.query(`
      CREATE TABLE product_types (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50) NOT NULL UNIQUE,
        title VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  // Product models table with CUSTOM ID as primary key
  if (!await tableExists(client, 'product_models')) {
    console.log('Creating product_models table...');
    await client.query(`
      CREATE TABLE product_models (
        id VARCHAR(50) PRIMARY KEY,                    -- Custom ID: PRO_1700000000_abc123
        type_id INTEGER REFERENCES product_types(id) ON DELETE CASCADE,
        brand VARCHAR(100) NOT NULL,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        size VARCHAR(50),
        long_description TEXT,
        status VARCHAR(20) DEFAULT 'pending',
        created_by VARCHAR(50) REFERENCES employees(id),  -- References custom employee ID
        approved_by VARCHAR(50) REFERENCES employees(id),
        approved_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_by VARCHAR(50) REFERENCES employees(id)
      );
    `);
  }

  // Product images table
  if (!await tableExists(client, 'product_images')) {
    console.log('Creating product_images table...');
    await client.query(`
      CREATE TABLE product_images (
        id SERIAL PRIMARY KEY,
        product_model_id VARCHAR(50) REFERENCES product_models(id) ON DELETE CASCADE,
        image_url TEXT NOT NULL,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  // Activity log with custom IDs
  if (!await tableExists(client, 'activity_log')) {
    console.log('Creating activity_log table...');
    await client.query(`
      CREATE TABLE activity_log (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(50) REFERENCES employees(id),
        action VARCHAR(50) NOT NULL,
        entity_type VARCHAR(50) NOT NULL,
        entity_id VARCHAR(50),
        details JSONB,
        ip_address INET,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }
}

async function seedInitialDataIfNeeded(client: any): Promise<void> {
  const countResult = await client.query('SELECT COUNT(*) FROM product_types');
  const count = parseInt(countResult.rows[0].count);
  
  if (count === 0) {
    console.log('Inserting initial product types...');
    await client.query(`
      INSERT INTO product_types (type, title) 
      VALUES 
        ('laptops', 'Laptops'),
        ('phones', 'Smartphones'),
        ('tablets', 'Tablets'),
        ('accessories', 'Accessories')
      ON CONFLICT (type) DO NOTHING;
    `);
  }
}

// ============= AUTHENTICATION MIDDLEWARE =============

interface AuthUser {
  uid: string;
  email: string;
  role: string;
  employeeId: string | null;
  dbId?: string;  // The custom ID from employees table
}

async function authenticate(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
  
  
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    const user = await admin.auth().getUser(decodedToken.uid);
    
    // Get employee record to get custom ID if exists
    let employeeDbId = null;
    if (pool) {
      const client = await pool.connect();
      const result = await client.query(
        'SELECT id FROM employees WHERE firebase_uid = $1',
        [decodedToken.uid]
      );
      if (result.rows.length > 0) {
        employeeDbId = result.rows[0].id;
      }
      client.release();
    }
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: user.customClaims?.role || 'customer',
      employeeId: user.customClaims?.employeeId || null,
      dbId: employeeDbId
    };
    
    next();
  } catch (error) {
    console.error('Auth error:', error);
    req.user = null;
    next();
  }
}

function requireRole(roles: string[]) {
  return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    const user = req.user as AuthUser | null;
    if (!user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    
    if (!roles.includes(user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }
    
    next();
  };
}

// ============= INITIALIZATION =============

onInit(async () => {
    // Add validation
  if (!pgDatabase.value() || !pgUser.value() || !pgPassword.value()) {
    console.error('Required database parameters missing');
    throw new Error('Missing required database configuration');
  }

  pool = new Pool({
    host: pgHost.value(),
    port: pgPort.value(),
    database: pgDatabase.value(),
    user: pgUser.value(),
    password: pgPassword.value(),
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
  
  try {
    const client = await pool.connect();
    console.log('Connected to database:', pgDatabase.value());
    
    await ensureTablesExist(client);
    await seedInitialDataIfNeeded(client);
    
    client.release();
    console.log('Database setup completed');
  } catch (error) {
    console.error('Database setup failed:', error);
  }
});

// Apply authentication middleware
app.use(authenticate);

// ============= PUBLIC ROUTES =============

app.get('/products', async (req, res) => {
  if (!pool) return res.status(503).json({ error: 'Database not initialized' });

  try {
    const client = await pool.connect();
    const result = await client.query(`
      SELECT 
        pm.id,  -- Now returns custom ID like PRO_1700000000_abc123
        pt.type,
        pt.title as category,
        pm.brand,
        pm.title,
        pm.description,
        pm.price::text,
        pm.size,
        (
          SELECT json_agg(pi.image_url ORDER BY pi.display_order)
          FROM product_images pi
          WHERE pi.product_model_id = pm.id
        ) as "imgSrc"
      FROM product_models pm
      JOIN product_types pt ON pm.type_id = pt.id
      WHERE pm.status = 'active'
      ORDER BY pm.created_at DESC;
    `);
    
    client.release();
    res.json(result.rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// ============= EMPLOYEE ROUTES =============

interface ProductCreateRequest {
  type: string;
  brand: string;
  title: string;
  description: string;
  price: number;
  size?: string;
  longDescription: string;
  imgSrc: string[];
}

app.post('/employee/products', requireRole(['employee', 'admin']), async (req, res) => {
  if (!pool) return res.status(503).json({ error: 'Database not initialized' });

  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { type, brand, title, description, price, size, longDescription, imgSrc } = req.body as ProductCreateRequest;
    const user = req.user as AuthUser;
    
    // Get or create employee record if needed
    let employeeId = user.dbId;
    if (!employeeId) {
      // Create employee record with custom ID
      employeeId = generateEmployeeId();
      await client.query(
        `INSERT INTO employees (id, firebase_uid, email, full_name, hire_date) 
         VALUES ($1, $2, $3, $4, CURRENT_DATE)`,
        [employeeId, user.uid, user.email, user.email?.split('@')[0] || 'Employee']
      );
      
      // Update Firebase custom claims
      await admin.auth().setCustomUserClaims(user.uid, { 
        role: 'employee',
        employeeId: employeeId 
      });
    }
    
    // Get type_id
    const typeResult = await client.query(
      'SELECT id FROM product_types WHERE type = $1',
      [type]
    );
    
    if (typeResult.rows.length === 0) {
      throw new Error('Invalid product type');
    }
    
    const typeId = typeResult.rows[0].id;
    
    // Generate custom product ID
    const productId = generateProductId();
    
    // Insert product with custom ID
    await client.query(
      `INSERT INTO product_models 
       (id, type_id, brand, title, description, price, size, long_description, status, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [productId, typeId, brand, title, description, price, size, longDescription, 'pending', employeeId]
    );
    
    // Insert images
    if (imgSrc && imgSrc.length > 0) {
      for (let i = 0; i < imgSrc.length; i++) {
        await client.query(
          'INSERT INTO product_images (product_model_id, image_url, display_order) VALUES ($1, $2, $3)',
          [productId, imgSrc[i], i + 1]
        );
      }
    }
    
    // Log activity
    await client.query(
      `INSERT INTO activity_log (user_id, action, entity_type, entity_id, details) 
       VALUES ($1, $2, $3, $4, $5)`,
      [employeeId, 'CREATE', 'product', productId, JSON.stringify({ title, brand, price })]
    );
    
    await client.query('COMMIT');
    res.status(201).json({ 
      id: productId, 
      message: 'Product submitted for approval',
      status: 'pending'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  } finally {
    client.release();
  }
});

app.get('/employee/my-products', requireRole(['employee', 'admin']), async (req, res) => {
  if (!pool) return res.status(503).json({ error: 'Database not initialized' });

  try {
    const user = req.user as AuthUser;
    const employeeId = user.dbId;
    
    if (!employeeId) {
      return res.json([]); // No products yet
    }
    
    const client = await pool.connect();
    const result = await client.query(`
      SELECT 
        pm.*,
        pt.type,
        pt.title as category,
        (
          SELECT json_agg(pi.image_url ORDER BY pi.display_order)
          FROM product_images pi
          WHERE pi.product_model_id = pm.id
        ) as images
      FROM product_models pm
      JOIN product_types pt ON pm.type_id = pt.id
      WHERE pm.created_by = $1
      ORDER BY pm.created_at DESC;
    `, [employeeId]);
    
    client.release();
    res.json(result.rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.put('/employee/products/:id', requireRole(['employee', 'admin']), async (req, res) => {
  if (!pool) return res.status(503).json({ error: 'Database not initialized' });

  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    const { brand, title, description, price, size, longDescription, imgSrc } = req.body;
    const user = req.user as AuthUser;
    const employeeId = user.dbId;
    
    if (!employeeId) {
      throw new Error('Employee record not found');
    }
    
    // Check if product exists and belongs to this employee and is pending
    const checkResult = await client.query(
      'SELECT status FROM product_models WHERE id = $1 AND created_by = $2',
      [id, employeeId]
    );
    
    if (checkResult.rows.length === 0) {
      throw new Error('Product not found or you dont have permission');
    }
    
    if (checkResult.rows[0].status !== 'pending') {
      throw new Error('Can only update pending products');
    }
    
    // Update product
    await client.query(
      `UPDATE product_models 
       SET brand = $1, title = $2, description = $3, price = $4, 
           size = $5, long_description = $6, updated_at = NOW(), updated_by = $7
       WHERE id = $8`,
      [brand, title, description, price, size, longDescription, employeeId, id]
    );
    
    // Update images
    await client.query('DELETE FROM product_images WHERE product_model_id = $1', [id]);
    
    if (imgSrc && imgSrc.length > 0) {
      for (let i = 0; i < imgSrc.length; i++) {
        await client.query(
          'INSERT INTO product_images (product_model_id, image_url, display_order) VALUES ($1, $2, $3)',
          [id, imgSrc[i], i + 1]
        );
      }
    }
    
    await client.query('COMMIT');
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error:', error);
    res.status(500).json({ error: (error as Error).message });
  } finally {
    client.release();
  }
});

// ============= ADMIN ROUTES =============

app.get('/admin/pending-products', requireRole(['admin']), async (req, res) => {
  if (!pool) return res.status(503).json({ error: 'Database not initialized' });

  try {
    const client = await pool.connect();
    const result = await client.query(`
      SELECT 
        pm.*,
        pt.type,
        pt.title as category,
        e.full_name as employee_name,
        e.email as employee_email,
        (
          SELECT json_agg(pi.image_url ORDER BY pi.display_order)
          FROM product_images pi
          WHERE pi.product_model_id = pm.id
        ) as images
      FROM product_models pm
      JOIN product_types pt ON pm.type_id = pt.id
      JOIN employees e ON pm.created_by = e.id
      WHERE pm.status = 'pending'
      ORDER BY pm.created_at ASC;
    `);
    
    client.release();
    res.json(result.rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch pending products' });
  }
});

app.post('/admin/products/:id/approve', requireRole(['admin']), async (req, res) => {
  if (!pool) return res.status(503).json({ error: 'Database not initialized' });

  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    const { action } = req.body;
    const user = req.user as AuthUser;
    const adminId = user.dbId;
    
    const newStatus = action === 'approve' ? 'active' : 'rejected';
    
    await client.query(
      `UPDATE product_models 
       SET status = $1, approved_by = $2, approved_at = NOW(), updated_at = NOW()
       WHERE id = $3`,
      [newStatus, adminId, id]
    );
    
    await client.query(
      `INSERT INTO activity_log (user_id, action, entity_type, entity_id, details) 
       VALUES ($1, $2, $3, $4, $5)`,
      [adminId, action.toUpperCase(), 'product', id, JSON.stringify({ newStatus })]
    );
    
    await client.query('COMMIT');
    res.json({ message: `Product ${action}d successfully` });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to update product status' });
  } finally {
    client.release();
  }
});

app.post('/admin/employees', requireRole(['admin']), async (req, res) => {
  if (!pool) return res.status(503).json({ error: 'Database not initialized' });

  const client = await pool.connect();
  
  try {
    const { firebase_uid, email, full_name, department } = req.body;
    const employeeId = generateEmployeeId();
    
    await client.query(
      `INSERT INTO employees (id, firebase_uid, email, full_name, department, hire_date) 
       VALUES ($1, $2, $3, $4, $5, CURRENT_DATE)`,
      [employeeId, firebase_uid, email, full_name, department]
    );
    
    await admin.auth().setCustomUserClaims(firebase_uid, { 
      role: 'employee',
      employeeId: employeeId 
    });
    
    client.release();
    res.status(201).json({ id: employeeId, message: 'Employee added successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to add employee' });
  } finally {
    client.release();
  }
});

app.get('/admin/audit-log', requireRole(['admin']), async (req, res) => {
  if (!pool) return res.status(503).json({ error: 'Database not initialized' });

  try {
    const client = await pool.connect();
    const result = await client.query(`
      SELECT 
        al.*,
        e.full_name as user_name,
        e.email as user_email
      FROM activity_log al
      JOIN employees e ON al.user_id = e.id
      ORDER BY al.created_at DESC
      LIMIT 100;
    `);
    
    client.release();
    res.json(result.rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch audit log' });
  }
});

// ============= EXPORT =============

export const api = onRequest({ cors: true }, app);