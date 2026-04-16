// src/services/productAdapter.ts
import { ProductCategory, ProductModel } from '../itemsComponents/products/types/Product';
import { productsApi, Product as DBProduct } from './productsApi';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

// Map database mainType to icon
const getIconForType = (mainType: string): string => {
  const iconMap: { [key: string]: string } = {
    'electronics': 'fa-microchip',
    'home-appliances': 'fa-home',
    'clothes': 'fa-tshirt',
    'furniture': 'fa-couch',
    'other': 'fa-box'
  };
  return iconMap[mainType] || 'fa-cube';
};

// Get title for type (capitalized)
const getTitleForType = (mainType: string): string => {
  const titleMap: { [key: string]: string } = {
    'electronics': 'Electronics',
    'home-appliances': 'Home Appliances',
    'clothes': 'Clothes',
    'furniture': 'Furniture',
    'other': 'Other'
  };
  return titleMap[mainType] || mainType.charAt(0).toUpperCase() + mainType.slice(1);
};

// Convert database product to old ProductModel format
const convertToProductModel = (dbProduct: DBProduct): ProductModel => {
  // Get the full image URL
  const getFullImageUrl = (imgPath: string): string => {
    if (imgPath.startsWith('http')) return imgPath;
    return `${API_BASE.replace('/api', '')}${imgPath}`;
  };

  return {
    id: dbProduct.id,
    type: dbProduct.mainType,  // Map mainType to type
    brand: dbProduct.brand,
    title: dbProduct.title,
    description: dbProduct.description,
    price: dbProduct.price.toString(),
    size: dbProduct.subType,  // Use subType as size field
    imgSrc: dbProduct.imgSrc.map(img => getFullImageUrl(img)),
    longDescription: dbProduct.longDescription,
    // Additional fields that might be useful (optional)
    stockQuantity: dbProduct.stockQuantity,
    status: dbProduct.status
  } as ProductModel & { stockQuantity?: number; status?: string };
};

// Group products by type/category
const groupProductsByCategory = (products: ProductModel[]): ProductCategory[] => {
  const categoryMap = new Map<string, ProductCategory>();
  
  products.forEach(product => {
    if (!categoryMap.has(product.type)) {
      categoryMap.set(product.type, {
        type: product.type,
        icon: getIconForType(product.type),
        title: getTitleForType(product.type),
        typeId: categoryMap.size + 1,
        models: []
      });
    }
    categoryMap.get(product.type)!.models.push(product);
  });
  
  return Array.from(categoryMap.values());
};

// Main adapter class
class ProductAdapter {
  private cachedProducts: ProductModel[] | null = null;
  private lastFetchTime: number = 0;
  private cacheDuration: number = 5 * 60 * 1000; // 5 minutes

  // Fetch all approved products from database
  async fetchApprovedProducts(): Promise<ProductModel[]> {
    const now = Date.now();
    
    // Return cached data if still valid
    if (this.cachedProducts && (now - this.lastFetchTime) < this.cacheDuration) {
      return this.cachedProducts;
    }
    
    try {
      // Fetch only approved products for public display
      const response = await productsApi.getAllProducts('approved');
      const products = response.products || [];
      
      // Convert to old format
      this.cachedProducts = products.map(convertToProductModel);
      this.lastFetchTime = now;
      
      return this.cachedProducts;
    } catch (error) {
      console.error('Failed to fetch products from database:', error);
      return [];
    }
  }

  // Get products as categories (grouped by type)
  async getProductCategories(): Promise<ProductCategory[]> {
    const products = await this.fetchApprovedProducts();
    return groupProductsByCategory(products);
  }

  // Get products by specific type
  async getProductsByType(type: string): Promise<ProductModel[]> {
    const products = await this.fetchApprovedProducts();
    return products.filter(product => product.type === type);
  }

  // Get single product by ID
  async getProductById(id: string): Promise<ProductModel | null> {
    try {
      const dbProduct = await productsApi.getProductById(id);
      return convertToProductModel(dbProduct);
    } catch (error) {
      console.error('Failed to fetch product by ID:', error);
      return null;
    }
  }

  // Search products by query (title, brand, description)
  async searchProducts(query: string): Promise<ProductModel[]> {
    const products = await this.fetchApprovedProducts();
    const searchTerm = query.toLowerCase();
    
    return products.filter(product => 
      product.title.toLowerCase().includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.type.toLowerCase().includes(searchTerm)
    );
  }

  // Clear cache (useful after admin approval)
  clearCache(): void {
    this.cachedProducts = null;
    this.lastFetchTime = 0;
  }

  // Get products with filters (for the filtered products page)
  async getFilteredProducts(options: {
    types?: string[];
    brands?: string[];
    minPrice?: number;
    maxPrice?: number;
  }): Promise<ProductModel[]> {
    let products = await this.fetchApprovedProducts();
    
    // Filter by types
    if (options.types && options.types.length > 0) {
      products = products.filter(p => options.types!.includes(p.type));
    }
    
    // Filter by brands
    if (options.brands && options.brands.length > 0) {
      products = products.filter(p => options.brands!.includes(p.brand));
    }
    
    // Filter by price range
    if (options.minPrice !== undefined) {
      products = products.filter(p => parseFloat(p.price) >= options.minPrice!);
    }
    if (options.maxPrice !== undefined) {
      products = products.filter(p => parseFloat(p.price) <= options.maxPrice!);
    }
    
    return products;
  }

  // Get all unique brands from products
  async getAllBrands(): Promise<string[]> {
    const products = await this.fetchApprovedProducts();
    const brands = new Set(products.map(p => p.brand));
    return Array.from(brands).sort();
  }

  // Get price range (min/max) from all products
  async getPriceRange(): Promise<{ min: number; max: number }> {
    const products = await this.fetchApprovedProducts();
    const prices = products.map(p => parseFloat(p.price));
    
    return {
      min: prices.length > 0 ? Math.min(...prices) : 0,
      max: prices.length > 0 ? Math.max(...prices) : 0
    };
  }
}

export const productAdapter = new ProductAdapter();