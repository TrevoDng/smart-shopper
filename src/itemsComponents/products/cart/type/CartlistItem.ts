import { ProductModel } from "../../types/Product";

export interface CartlistItem {
    id: string;
    product: ProductModel;
    addedAt: Date;
    quantity: number;
}

export interface CartlistState {
    items: CartlistItem[];
}

export type CartlistContextType = {
    cartlist: CartlistState;
    addToCartlist: (product: ProductModel)=> void;
    removeFromCartlist: (productId: string)=> void;
    updateQuantity: (productId: string, newQuantity: number)=> void;
    isInCartlist: (ProdcutId: string)=> boolean;
    clearCartlist: ()=> void;
}