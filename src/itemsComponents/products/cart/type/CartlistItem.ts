import { Product, Size } from "../../types/Product";

export interface CartlistItem {
    id: string;
    product: Product;
    addedAt: Date;
    quantity: number;
    selectedSize: Size | null;
}

export interface CartlistState {
    items: CartlistItem[];
}

export type CartlistContextType = {
    cartlist: CartlistState;
    addToCartlist: (product: Product, selectedSize: Size | null)=> void;
    removeFromCartlist: (productId: string, clothing: string, selectedSize: Size | null)=> void;
    updateQuantity: (productId: string, newQuantity: number)=> void;
    isInCartlist: (ProdcutId: string)=> boolean;
    clearCartlist: ()=> void;
}