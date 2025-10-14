// data/demoData.ts
import { ProductCategory } from '../types/Product';
// Using placeholder images - replace with your actual image paths

const placeholderImages = [
  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1511385348-a52b4a160dc2?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop'
];

    
    //database data holder
               const imgsrc =   "https://firebasestorage.googleapis.com/v0/b/tenglobal-2a34b.appspot.com/o/laptops-images%2FIMG-20250210-WA0048-removebg-preview.png?alt=media&token=1225dade-873c-4f88-8e9c-18266432fe35";
               //'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop';
   
               //'https://images.unsplash.com/photo-1511385348-a52b4a160dc2?w=400&h=300&fit=crop';
   
               //'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop';

               //"https://firebasestorage.googleapis.com/v0/b/tenglobal-2a34b.appspot.com/o/laptops-images%2FIMG-20250210-WA0048-removebg-preview.png?alt=media&token=1225dade-873c-4f88-8e9c-18266432fe35";
            
            const imgsrc2 =   'https://images.unsplash.com/photo-1511385348-a52b4a160dc2?w=400&h=300&fit=crop';
 
            //"https://firebasestorage.googleapis.com/v0/b/sa-telecoms-world-wide-d43a4.appspot.com/o/dog1.jpg?alt=media&token=0d48befa-9b6b-4315-bacb-ae3282dbe46f";

            
     const laptopProducts: ProductCategory[] = [
  {
    type: "laptops",
    icon: "fa-laptop",
    title: "Laptops",
    typeId: 1,
    models: [
      {
        id: "1",
        type: "laptops",
        model: "HP halion",
        description: "A high-end smartphone with advanced features.",
        price: "R999",
        //size: "size-2",
        imgSrc: [imgsrc, imgsrc2, imgsrc],
        longDescription: `<p>This is all itme details for each product. Is our pleasure to give our clients full item details for their satisfaction.</p>`,
      },
      {
        id: "2",
        type: "laptops",
        model: "Meccer G22",
        description: "A cutting-edge Android smartphone.",
        price: "R799",
        imgSrc: [imgsrc],
        longDescription: `<p>This is all itme details for each product. Is our pleasure to give our clients full item details for their satisfaction.</p>`,
      },
      {
        id: "3",
        type: "laptops",
        model: "Dell spion",
        description: "A cutting-edge Android smartphone.",
        price: "R199",
        imgSrc: [imgsrc],
        longDescription: `<p>This is all itme details for each product. Is our pleasure to give our clients full item details for their satisfaction.</p>`,
      },
      {
        id: "4",
        type: "laptops",
        model: "MacBook Air",
        description: "A sleek and powerful laptop for professionals.",
        price: "R1,299",
        imgSrc: [imgsrc],
        longDescription: `<p>This is all itme details for each product. Is our pleasure to give our clients full item details for their satisfaction.</p>`,
      },
      {
        id: "5",
        type: "laptops",
        model: "Dell XPS 13",
        description: "A compact and feature-rich laptop.",
        price: "R999",
        imgSrc: [imgsrc],
        longDescription: `<p>This is all itme details for each product. Is our pleasure to give our clients full item details for their satisfaction.</p>`,
      },
      {
        id: "6",
        type: "laptops",
        model: "HP XPS 13",
        description: "A compact and feature-rich laptop.",
        price: "R999",
        imgSrc: [imgsrc],
        longDescription: `<p>This is all itme details for each product. Is our pleasure to give our clients full item details for their satisfaction.</p>`,
      },
    ]
  },
];
       
       const desktopProducts: ProductCategory[] = [
  {
    type: "desktop",
    title: "Desktop",
    icon: "fa-computer",
    typeId:2,
    models: [
      {
        id: "7",
        type: "desktop",
        model: "Lenovo 13",
        description: "Desktop. A high-end smartphone with advanced features.",
        price: "R999",
        imgSrc: [imgsrc, imgsrc, imgsrc],
        longDescription: `<p>This is all itme details for each product. Is our pleasure to give our clients full item details for their satisfaction.</p>`,
      },
      {
        id: "8",
        type: "desktop",
        model: "Dell G22",
        description: "Desktop A cutting-edge Android smartphone.",
        price: "R799",
        imgSrc: [imgsrc],
        longDescription: `<p>This is all itme details for each product. Is our pleasure to give our clients full item details for their satisfaction.</p>`,
      },
      {
        id: "9",
        type: "desktop",
        model: "Lenovo A01",
        description: "Desktop A cutting-edge Android smartphone.",
        price: "R199",
        imgSrc: [imgsrc],
        longDescription: `<p>This is all itme details for each product. Is our pleasure to give our clients full item details for their satisfaction.</p>`,
      },
      {
        id: "10",
        type: "desktop",
        model: "MacBook Air",
        description: "DesktopA sleek and powerful laptop for professionals.",
        price: "R1,299",
        imgSrc: [imgsrc],
        longDescription: `<p>This is all itme details for each product. Is our pleasure to give our clients full item details for their satisfaction.</p>`,
      },
      {
        id: "11",
        type: "desktop",
        model: "Dell XPS 13",
        description: "DesktopA compact and feature-rich laptop.",
        price: "R999",
        imgSrc: [imgsrc],
        longDescription: `<p>This is all itme details for each product. Is our pleasure to give our clients full item details for their satisfaction.</p>`,
      },
      {
        id: "12",
        type: "desktop",
        model: "HP XPS 13",
        description: "DesktopA compact and feature-rich laptop.",
        price: "R999",
        imgSrc: [imgsrc],
        longDescription: `<p>This is all itme details for each product. Is our pleasure to give our clients full item details for their satisfaction.</p>`,
      }
    ]
  },
];

const screenProducts: ProductCategory[] = [
  {
    type: "screens",
    icon: "fa-display",
    title: "Computer Screens",
    typeId: 3,
    models: [
      {
        id: "13",
        type: "screens",
        model: "Lenovo 13",
        description: "ScreensA high-end smartphone with advanced features.",
        price: "R999",
        imgSrc: [imgsrc],
        longDescription: `<p>This is all itme details for each product. Is our pleasure to give our clients full item details for their satisfaction.</p>`,
      },
      {
        id: "14",
        type: "screens",
        model: "Dell G22",
        description: "Screens A cutting-edge Android smartphone.",
        price: "R799",
        imgSrc: [imgsrc],
        longDescription: `<p>This is all itme details for each product. Is our pleasure to give our clients full item details for their satisfaction.</p>`,
      },
      {
        id: "15",
        type: "screens",
        model: "Lenovo A01",
        description: "ScreensA cutting-edge Android smartphone.",
        price: "R199",
        imgSrc: [imgsrc],
        longDescription: `<p>This is all itme details for each product. Is our pleasure to give our clients full item details for their satisfaction.</p>`,
      },
      {
        id: "16",
        type: "screens",
        model: "MacBook Air",
        description: "ScreensA sleek and powerful laptop for professionals.",
        price: "R1,299",
        imgSrc: [imgsrc],
        longDescription: `<p>This is all itme details for each product. Is our pleasure to give our clients full item details for their satisfaction.</p>`,
      },
      {
        id: "17",
        type: "screens",
        model: "Dell XPS 13",
        description: "ScreensA compact and feature-rich laptop.",
        price: "R999",
        imgSrc: [imgsrc],
        longDescription: `<p>This is all itme details for each product. Is our pleasure to give our clients full item details for their satisfaction.</p>`,
      },
      {
        id: "18",
        type: "screens",
        model: "HP XPS 13",
        description: "ScreensA compact and feature-rich laptop.",
        price: "R999",
        imgSrc: [imgsrc],
        longDescription: `<p>This is all itme details for each product. Is our pleasure to give our clients full item details for their satisfaction.</p>`,
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

export const combinedProducts = [...laptopProducts, ...desktopProducts, ...screenProducts];

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