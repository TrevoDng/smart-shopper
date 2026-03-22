export type EntityType = 'product' | 'user' | 'order' | 'employee' | 'proof';

/**
 * Generate a unique ID with prefix, timestamp, and random string
 * Examples:
 * - product: PRO_1700000000000_abc123
 * - user: USR_1700000000000_xyz789
 * - order: ORD_1700000000000_def456
 */
export const generateId = (type: EntityType): string => {
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

export const generateProductId = (): string => generateId('product');
export const generateUserId = (): string => generateId('user');
export const generateOrderId = (): string => generateId('order');
export const generateEmployeeId = (): string => generateId('employee');
export const generateProofId = (): string => generateId('proof');