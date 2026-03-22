import { createContext, useContext, useEffect, useRef, useState } from "react";
import { CartlistContextType, CartlistItem, CartlistState } from "../type/CartlistItem"

import { ProductModel } from "../../types/Product";

const CartlistContext = createContext<CartlistContextType | undefined>(undefined);

const initialSate: CartlistState = {
    items: []
}
export const CartlistProvider: React.FC<{ children: 
    React.ReactNode}> = ({ children })=> {

        const [cartlist, setCartlist] = useState<CartlistState | undefined>(undefined);
        const isInitialLoadComplete = useRef(false);

        useEffect(()=> {
            if(isInitialLoadComplete.current) return;

            console.log("Loading data from local storage");
            const saved = localStorage.getItem('cartlist');

            //load data from localStorage
            if(saved) {
                try {
                    const parsed = JSON.parse(saved);
                    console.log("Loaded from localStorage", parsed);

                    let items: CartlistItem[] = [];

                    if (Array.isArray(parsed)) {
                        items = parsed.map((item: any)=> ({
                            ...item,
                            addedAt: new Date(item.addedAt | Date.now()),
                            quantity: item.quantity || 1
                        }))
                    } else if (parsed && parsed.items && Array.isArray(parsed.items)) {
                        items = parsed.items.map((item: any)=> ({
                            ...item,
                            addedAt: new Date(item.addedAt | Date.now()),
                            quantity: item.quantity || 1
                        }))
                        setCartlist({ items });
                        console.log("Loading cartlist state with", parsed.length, "items");
                    }
                } catch (error) {
                    console.log("Failed to parse cartlist data from local storage, start fresh", error);
                    localStorage.removeItem('cartlist');
                    setCartlist({items: []});
                }
            } else {
                console.log("No saved data found from locaStorage, start fresh");
                setCartlist({items: []});
            }

            isInitialLoadComplete.current = true;
        }, []);

        // save data to local storage
        useEffect(()=> {
            //do not save data to localStorage if:
            //1. data is not loaded from localStorage yet
            //2. wislist is undefined
            if (!isInitialLoadComplete.current || cartlist === undefined) {
                return;
            }

            console.log("saving cartlist data to localStorage...", cartlist.items);
            localStorage.setItem('cartlist', JSON.stringify(cartlist));
            console.log("cartlist data was successfully saved to localStorage", cartlist.items);

        }, [cartlist]);

        const addToCartlist = (product: ProductModel) => {
            setCartlist(prev => {
                if (!prev) return {items: []};

                const existingItem = prev.items.find(item => item.product.id === product.id);

                //Increment quantity
                if (existingItem) {
                    return {
                        items: prev.items.map(item => 
                            item.product.id === product.id ? 
                            { ...item, quantity: item.quantity + 1 } : 
                            item
                    )
                };
                } else {
                    //add new item quantity 1
                    const newItem: CartlistItem = {
                        id: `wish_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
                        product,
                        quantity: 1,
                        addedAt: new Date()
                    };
                    return {items: [...prev.items, newItem]};
                }
            });        
        };
        
        const removeFromCartlist = (productId: string) => {
            if(!productId || typeof productId !== 'string') {
                    console.error("Invalid productId", productId);
            }
            setCartlist(prev => {
                if(!prev) return {items: []};

                    return {items: prev.items.filter(item => item.product.id !== productId)}
                    });
        };

        // Update quantity directly using (+/- buttons)
        const updateQuantity=(productId: string, newQuantity: number)=> {
            if (newQuantity <=0) {
                removeFromCartlist(productId);
            } else {
                setCartlist(prev => {
                    if (!prev) return {items: []};
                    return {
                        items: prev?.items.map(item => 
                            item.product.id === productId 
                            ? {...item, quantity: newQuantity} 
                            : item
                        )
                    };
                });
            }
        }
        
        const isInCartlist = (productId: string) => {
            if(!cartlist) return false;
                return cartlist.items.some(item => item.product.id === productId); 
            };
        
        const clearCartlist =()=> {
            setCartlist({ items: [] });
        }

        if (cartlist === undefined) {
            return null; // or load spinner
        }

    return (
        <CartlistContext.Provider value={{
            cartlist,
            addToCartlist,
            removeFromCartlist,
            updateQuantity,
            isInCartlist,
            clearCartlist
        }}>{children}</CartlistContext.Provider>
    )
}

export const useCartlist=()=> {
    const context = useContext(CartlistContext);
    if(context === undefined) {
        throw new Error("useCartlist should be used within CartlistProvider")
    }
    return context;
}