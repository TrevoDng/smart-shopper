// data/demoData.ts
import { ProductCategory } from '../types/Product';
// Using placeholder images - replace with your actual image paths

const placeholderImages = [
  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1511385348-a52b4a160dc2?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop'
];

export const productsList: ProductCategory[] = [
  {
    type: "laptops",
    icon: "fa-laptop",
    title: "Laptops",
    typeId: 1,
    models: [
      {
        id: "1",
        type: "laptops",
        model: "HP Pavilion",
        description: "A high-performance laptop for work and entertainment.",
        price: "R999",
        size: "15.6 inch",
        imgSrc: [placeholderImages[0], placeholderImages[1]],
        longDescription: `<p>This HP Pavilion laptop offers excellent performance for both work and entertainment with its powerful processor and stunning display.</p>`
      },
      {
        id: "2",
        type: "laptops",
        model: "Dell XPS 13",
        description: "Ultra-slim laptop with infinity-edge display.",
        price: "R1,299",
        size: "13.4 inch",
        imgSrc: [placeholderImages[1], placeholderImages[2]],
        longDescription: `<p>The Dell XPS 13 features an infinity-edge display and powerful performance in a compact design.</p>`
      }
    ]
  },
  {
    type: "smartphones",
    icon: "fa-mobile-alt",
    title: "Smartphones",
    typeId: 2,
    models: [
      {
        id: "3",
        type: "smartphones",
        model: "Samsung Galaxy S21",
        description: "Flagship smartphone with advanced camera system.",
        price: "R899",
        size: "6.2 inch",
        imgSrc: [placeholderImages[2], placeholderImages[0]],
        longDescription: `<p>The Samsung Galaxy S21 features a professional-grade camera system and powerful performance.</p>`
      }
    ]
  }
];