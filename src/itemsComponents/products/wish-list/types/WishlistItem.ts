import { ProductModel } from "../../types/Product";

export interface WishlistItem {
    id: string;
    product: ProductModel;
    
    addedAt: Date;
}

export interface WishlistState {
    items: WishlistItem[];
}

export type WishlistContextType = {
    wishlist: WishlistState;
    addToWishlist: (product: ProductModel)=> void;
    removeFromWishlist: (productId: string)=> void;
    isInWishlist: (productId: string)=> boolean;
    clearWishlist: ()=> void;
}