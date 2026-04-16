// src/utils/mergeProductData.ts
import { ProductCategory } from "../types/Product";
import { combinedProducts } from "../data/demoData";
// import { ProductCategory } from '../itemsComponents/products/types/Product';
// import { combinedProducts } from '../itemsComponents/products/data/demoData';

export const mergeProductData = (
  realData: ProductCategory[],
  useRealData: boolean = true
): ProductCategory[] => {
  if (!useRealData || realData.length === 0) {
    return combinedProducts; // Fallback to demo data
  }
  
  // Merge real data with demo data (real takes precedence)
  const mergedMap = new Map<string, ProductCategory>();
  
  // Add demo data first
  combinedProducts.forEach(category => {
    mergedMap.set(category.type, { ...category, models: [...category.models] });
  });
  
  // Override with real data
  realData.forEach(category => {
    const existing = mergedMap.get(category.type);
    if (existing) {
      // Merge models (real models override demo models with same ID)
      const modelsMap = new Map<string, any>();
      existing.models.forEach(model => modelsMap.set(model.id, model));
      category.models.forEach(model => modelsMap.set(model.id, model));
      mergedMap.set(category.type, {
        ...existing,
        models: Array.from(modelsMap.values())
      });
    } else {
      mergedMap.set(category.type, category);
    }
  });
  
  return Array.from(mergedMap.values());
};