import { Product } from "../../types/Product";

export interface CartlistItem {
    id: string;
    product: Product;
    addedAt: Date;
    quantity: number;
}

export interface CartlistState {
    items: CartlistItem[];
}

export type CartlistContextType = {
    cartlist: CartlistState;
    addToCartlist: (product: Product)=> void;
    removeFromCartlist: (productId: string)=> void;
    updateQuantity: (productId: string, newQuantity: number)=> void;
    isInCartlist: (ProdcutId: string)=> boolean;
    clearCartlist: ()=> void;
}