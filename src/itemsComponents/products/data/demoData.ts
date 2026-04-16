// src/itemsComponents/products/data/demoData.ts
import { ProductCategory } from '../types/Product';
// Using placeholder images - replace with your actual image paths

const placeholderImages = [
  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1511385348-a52b4a160dc2?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop'
];

    
    //database data holder
               const imgsrc = 
  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop';
    
               //"https://firebasestorage.googleapis.com/v0/b/tenglobal-2a34b.appspot.com/o/laptops-images%2FIMG-20250210-WA0048-removebg-preview.png?alt=media&token=1225dade-873c-4f88-8e9c-18266432fe35";
               //'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop';
   
               //'https://images.unsplash.com/photo-1511385348-a52b4a160dc2?w=400&h=300&fit=crop';
   
               //'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop';

               //"https://firebasestorage.googleapis.com/v0/b/tenglobal-2a34b.appspot.com/o/laptops-images%2FIMG-20250210-WA0048-removebg-preview.png?alt=media&token=1225dade-873c-4f88-8e9c-18266432fe35";
            
            const imgsrc2 =   'https://images.unsplash.com/photo-1511385348-a52b4a160dc2?w=400&h=300&fit=crop';
 
            //"https://firebasestorage.googleapis.com/v0/b/sa-telecoms-world-wide-d43a4.appspot.com/o/dog1.jpg?alt=media&token=0d48befa-9b6b-4315-bacb-ae3282dbe46f";

            
     const laptopProducts = [
  {
    type: "laptops",
    icon: "fa-laptop",
    title: "Laptops",
    typeId: 1,
    models: [
      {
        id: "1",
        type: "laptops",
        brand: "HP",
        title: "HP halion",
        description: "A high-end smartphone with advanced features.",
        price: "999.00",
        size: "size-2",
        imgSrc: [imgsrc, imgsrc2, imgsrc, imgsrc2, imgsrc, imgsrc2],
        longDescription: `This is all itme details for each product. Is our pleasure to give our clients full item details for their satisfaction.`,
      },
      {
        id: "2",
        type: "laptops",
        brand: "Meccer",
        title: "Meccer G22",
        description: "A cutting-edge Android smartphone.",
        price: "799.00",
        imgSrc: [imgsrc],
        longDescription: `This is all itme details for each product. Is our pleasure to give our clients full item details for their satisfaction.`,
      },
      {
        id: "3",
        type: "laptops",
        brand: "Dell",
        title: "Dell spion",
        description: "A cutting-edge Android smartphone.",
        price: "199.00",
        imgSrc: [imgsrc],
        longDescription: `This is all itme details for each product. Is our pleasure to give our clients full item details for their satisfaction.`,
      },
      {
        id: "4",
        type: "laptops",
        brand: "Mac",
        title: "MacBook Air",
        description: "A sleek and powerful laptop for professionals.",
        price: "1,299.00",
        imgSrc: [imgsrc],
        longDescription: `This is all itme details for each product. Is our pleasure to give our clients full item details for their satisfaction.`,
      },
      {
        id: "5",
        type: "laptops",
        brand: "Dell",
        title: "Dell XPS 13",
        description: "A compact and feature-rich laptop.",
        price: "999.00",
        imgSrc: [imgsrc],
        longDescription: `This is all itme details for each product. Is our pleasure to give our clients full item details for their satisfaction.`,
      },
      {
        id: "6",
        type: "laptops",
        brand: "HP",
        title: "HP XPS 13",
        description: "A compact and feature-rich laptop.",
        price: "999.00",
        imgSrc: [imgsrc],
        longDescription: `This is all itme details for each product. Is our pleasure to give our clients full item details for their satisfaction.`,
      },{
        id: "7",
        type: "laptops",
        brand: "HP",
        title: "HP XPS 13",
        description: "A compact and feature-rich laptop.",
        price: "999",
        imgSrc: [imgsrc],
        longDescription: `This is all itme details for each product. Is our pleasure to give our clients full item details for their satisfaction.`,
      },
    ]
  },
];
       
       const desktopProducts = [
  {
    type: "desktop",
    title: "Desktop",
    icon: "fa-computer",
    typeId:2,
    models: [
      {
        id: "8",
        type: "desktop",
        brand: "Lenovo",
        title: "Lenovo 13",
        description: "Desktop. A high-end smartphone with advanced features.",
        price: "999.00",
        imgSrc: [imgsrc, imgsrc, imgsrc],
        longDescription: `This is all itme details for each product. Is our pleasure to give our clients full item details for their satisfaction.`,
      },
      {
        id: "9",
        type: "desktop",
        brand: "Dell",
        title: "Dell G22",
        description: "Desktop A cutting-edge Android smartphone.",
        price: "799.00",
        imgSrc: [imgsrc],
        longDescription: `This is all itme details for each product. Is our pleasure to give our clients full item details for their satisfaction.`,
      },
      {
        id: "10",
        type: "desktop",
        brand: "Lenovo",
        title: "Lenovo A01",
        description: "Desktop A cutting-edge Android smartphone.",
        price: "199.00",
        imgSrc: [imgsrc],
        longDescription: `This is all itme details for each product. Is our pleasure to give our clients full item details for their satisfaction.`,
      },
      {
        id: "11",
        type: "desktop",
        brand: "Mac",
        title: "MacBook Air",
        description: "DesktopA sleek and powerful laptop for professionals.",
        price: "1,299.00",
        imgSrc: [imgsrc],
        longDescription: `T: ProductCategory[]his is all itme details for each product. Is our pleasure to give our clients full item details for their satisfaction.`,
      },
      {
        id: "12",
        type: "desktop",
        brand: "Dell",
        title: "Dell XPS 13",
        description: "DesktopA compact and feature-rich laptop.",
        price: "999.00",
        imgSrc: [imgsrc],
        longDescription: `This is all itme details for each product. Is our pleasure to give our clients full item details for their satisfaction.`,
      },
      {
        id: "13",
        type: "desktop",
        brand: "HP",
        title: "HP XPS 13",
        description: "DesktopA compact and feature-rich laptop.",
        price: "999.00",
        imgSrc: [imgsrc],
        longDescription: `This is all itme details for each product. Is our pleasure to give our clients full item details for their satisfaction.`,
      }
    ]
  },
];

const screenProducts = [
  {
    type: "screens",
    icon: "fa-display",
    title: "Computer Screens",
    typeId: 3,
    models: [
      {
        id: "14",
        type: "screens",
        brand: "Lenovo",
        title: "Lenovo 13",
        description: "ScreensA high-end smartphone with advanced features.",
        price: "999.00",
        imgSrc: [imgsrc],
        longDescription: `This is all itme details for each product. Is our pleasure to give our clients full item details for their satisfaction.`,
      },
      {
        id: "15",
        type: "screens",
        brand: "Dell",
        title: "Dell G22",
        description: "Screens A cutting-edge Android smartphone.",
        price: "799.00",
        imgSrc: [imgsrc],
        longDescription: `This is all itme details for each product. Is our pleasure to give our clients full item details for their satisfaction.`,
      },
      {
        id: "16",
        type: "screens",
        brand: "Lenovo",
        title: "Lenovo A01",
        description: "ScreensA cutting-edge Android smartphone.",
        price: "199.00",
        imgSrc: [imgsrc],
        longDescription: `This is all itme details for each product. Is our pleasure to give our clients full item details for their satisfaction.`,
      },
      {
        id: "17",
        type: "screens",
        brand: "Mac",
        title: "MacBook Air",
        description: "ScreensA sleek and powerful laptop for professionals.",
        price: "1,299.00",
        imgSrc: [imgsrc],
        longDescription: `This is all itme details for each product. Is our pleasure to give our clients full item details for their satisfaction.`,
      },
      {
        id: "18",
        type: "screens",
        brand: "Dell",
        title: "Dell XPS 13",
        description: "ScreensA compact and feature-rich laptop.",
        price: "999.00",
        imgSrc: [imgsrc],
        longDescription: `This is all itme details for each product. Is our pleasure to give our clients full item details for their satisfaction.`,
      },
      {
        id: "19",
        type: "screens",
        brand: "HP",
        title: "HP XPS 13",
        description: "ScreensA compact and feature-rich laptop.",
        price: "999.00",
        imgSrc: [imgsrc],
        longDescription: `This is all itme details for each product. Is our pleasure to give our clients full item details for their satisfaction.`,
      }
    ]
  },
];

//combine products to update clicked item page

const productsObject = {
    laptops: laptopProducts,
    desktop: desktopProducts,
    screens: screenProducts,
}

export const combinedProducts: ProductCategory[] = [...laptopProducts, ...desktopProducts, ...screenProducts];
export const mostBoughtItems: ProductCategory[] = [ ...screenProducts];

/*
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
        //size: "15.6 inch",
        imgSrc: [placeholderImages[0], placeholderImages[1]],
        longDescription: `<p>This HP Pavilion laptop offers excellent performance for both work and entertainment with its powerful processor and stunning display.</p>`
      },
      {
        id: "2",
        type: "laptops",
        model: "Dell XPS 13",
        description: "Ultra-slim laptop with infinity-edge display.",
        price: "R1,299",
        //size: "13.4 inch",
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
        //size: "6.2 inch",
        imgSrc: [placeholderImages[2], placeholderImages[0]],
        longDescription: `<p>The Samsung Galaxy S21 features a professional-grade camera system and powerful performance.</p>`
      }
    ]
  }
];
*/