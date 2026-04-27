import { Product } from "../../types/Product";

export interface WishlistItem {
    id: string;
    product: Product;
    
    addedAt: Date;
}

export interface WishlistState {
    items: WishlistItem[];
}

export type WishlistContextType = {
    wishlist: WishlistState;
    addToWishlist: (product: Product)=> void;
    removeFromWishlist: (productId: string)=> void;
    isInWishlist: (productId: string)=> boolean;
    clearWishlist: ()=> void;
}