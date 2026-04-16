// src/utils/productTypes.ts

export interface ProductSubType {
  id: string;
  name: string;
  value: string;
}

export interface ProductMainType {
  id: string;
  name: string;
  value: string;
  icon: string;
  subTypes: ProductSubType[];
}

export const productTypes: ProductMainType[] = [
  {
    id: '1',
    name: 'Electronics',
    value: 'electronics',
    icon: 'fa-microchip',
    subTypes: [
      { id: '1-1', name: 'Computers', value: 'computers' },
      { id: '1-2', name: 'Laptops', value: 'laptops' },
      { id: '1-3', name: 'Computer Components', value: 'computer-components' },
      { id: '1-4', name: 'Monitors', value: 'monitors' },
      { id: '1-5', name: 'Smartphones', value: 'smartphones' },
      { id: '1-6', name: 'Tablets', value: 'tablets' },
      { id: '1-7', name: 'Audio & Headphones', value: 'audio' },
      { id: '1-8', name: 'Cameras', value: 'cameras' },
    ]
  },
  {
    id: '2',
    name: 'Home Appliances',
    value: 'home-appliances',
    icon: 'fa-home',
    subTypes: [
      { id: '2-1', name: 'Refrigerators', value: 'refrigerators' },
      { id: '2-2', name: 'Washing Machines', value: 'washing-machines' },
      { id: '2-3', name: 'Air Fryers', value: 'air-fryers' },
      { id: '2-4', name: 'Microwaves', value: 'microwaves' },
      { id: '2-5', name: 'Coffee Makers', value: 'coffee-makers' },
      { id: '2-6', name: 'Vacuum Cleaners', value: 'vacuums' },
    ]
  },
  {
    id: '3',
    name: 'Clothes',
    value: 'clothes',
    icon: 'fa-tshirt',
    subTypes: [
      { id: '3-1', name: 'Jeans', value: 'jeans' },
      { id: '3-2', name: 'Shirts', value: 'shirts' },
      { id: '3-3', name: 'T-Shirts', value: 't-shirts' },
      { id: '3-4', name: 'Dresses', value: 'dresses' },
      { id: '3-5', name: 'Jackets', value: 'jackets' },
      { id: '3-6', name: 'Shoes', value: 'shoes' },
    ]
  },
  {
    id: '4',
    name: 'Furniture',
    value: 'furniture',
    icon: 'fa-couch',
    subTypes: [
      { id: '4-1', name: 'Chairs', value: 'chairs' },
      { id: '4-2', name: 'Tables', value: 'tables' },
      { id: '4-3', name: 'Sofas', value: 'sofas' },
      { id: '4-4', name: 'Beds', value: 'beds' },
      { id: '4-5', name: 'Desks', value: 'desks' },
    ]
  },
  {
    id: '5',
    name: 'Other',
    value: 'other',
    icon: 'fa-box',
    subTypes: [
      { id: '5-1', name: 'Miscellaneous', value: 'miscellaneous' },
    ]
  }
];

export const getMainTypeByValue = (value: string): ProductMainType | undefined => {
  return productTypes.find(type => type.value === value);
};

export const getSubTypeByValue = (mainTypeValue: string, subTypeValue: string): ProductSubType | undefined => {
  const mainType = getMainTypeByValue(mainTypeValue);
  return mainType?.subTypes.find(sub => sub.value === subTypeValue);
};