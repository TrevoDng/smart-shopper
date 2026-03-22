import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';
import { WishlistContextType, WishlistItem, WishlistState } from '../types/WishlistItem';
import { ProductModel } from '../../types/Product';
import { countFunction } from '../countFunction';

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

/*
const initialState: WishlistState = {
    items: []
};
*/

export const WishlistProvider: React.FC<{ children: 
    React.ReactNode}> = ({ children })=> {
        const [wishlist, setWishlist] = useState<WishlistState | undefined>(undefined);
        const isInitialLoadComplete = useRef(false);
        

         // Load from localStorage
         useEffect(() => {
            //only run on mount
            if(isInitialLoadComplete.current) return;

            console.log("Loading wishlist from localStorage...");
            //if(wishlist === undefined) return;


            const saved = localStorage.getItem('wishlist');
            if (saved) {
                try {
                    const parsed = saved ? JSON.parse(saved) : null;
                    console.log("Wishlist data was loaded from localStorage:", parsed);

                    //Handle both old format (array) and (object)
                    let items: WishlistItem[] = [];

                    if(Array.isArray(parsed)) {
                        //old format just an array
                        items = parsed.map((item: any)=> ({
                            ...item,
                            addedAt: new Date(item.addedAt || Date.now())
                        }))
                        
                    } else if(parsed && parsed.items && Array.isArray(parsed.items)) {
                        // New format: { items: [...] }
                        items = parsed.items.map((item: any)=> ({
                            ...item,
                            addedAt: new Date(item.addedAt || Date.now())
                        }))

                        if(items.length < 0) return;

                        setWishlist({ items});
                        console.log('set wishlist state with', items.length, 'items');
                    }
                    

                } catch (error) {
                    //no saved data start afresh
                    console.error('Failed to parse wishlist, start fresh', error);
                    localStorage.removeItem('wishlist'); //clear corrupted adata
                    setWishlist({items: []});
                }
            } else {
                console.log("No saved wishlist found, starting fresh");
                setWishlist({ items: [] });
            }
        
            isInitialLoadComplete.current = true;
          
         }, []);
         

         // Save to localStorage
         useEffect(()=> {
            // Dont save if:
            //1. Data from local storage haven't loaded yet
            //2. wishlist is undefined
            if(!isInitialLoadComplete.current || wishlist === undefined) {
                return;
            }
            
            console.log('Saving wishlist to localStorage...', JSON.stringify(wishlist.items));
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            console.log('wishlist was saved successfully!', JSON.stringify(wishlist.items));
         }, [wishlist]);

         const addToWishlist = (product: ProductModel) => {
            setWishlist(prev => {
                if(!prev) return { items: [] };

      // Check if already in wishlist
                if (prev.items.some(item => item.product.id === product.id)) {
                    return prev;
                }

                const newItem: WishlistItem = {
                    id: `wish_${Date.now()}`,
                    product,
                    //count: prev.items.length,
                    addedAt: new Date()
                };

                //countFunction(newItem.count/*prev.items.length*/);
                //setCount({[newItem.count]});
                return {items: [...prev.items, newItem]};

            });
         };

         const removeFromWishlist = (productId: string) => {
            if(!productId || typeof productId !== 'string') {
                console.error("Invalid productId", productId);
            }
            setWishlist(prev => {
                if (!prev) return { items: []}

                return {
                items: prev.items.filter(item => item.product.id !== productId)
                }
            });
         };

         const isInWishlist = (productId: string) => {
            if (!wishlist) return false;
            return wishlist.items.some(item => item.product.id === productId); 
         };

         const clearWishlist =()=> {
            setWishlist({ items: [] });
         }

         if(wishlist === undefined) {
            return null; // or loading spinner
         }

         return (
            <WishlistContext.Provider value={{
                wishlist,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                clearWishlist
            }}>
                 {children} 
            </WishlistContext.Provider>
         );
    };

    export const useWishlist =()=> {
        const context = useContext(WishlistContext);
        if (context === undefined) {
            throw new Error('useWishlist must be used within a WishlistProvider');
        }
        return context;
    };

    /*

         // Load from localStorage
         useEffect(() => {
            //only run on mount
            if(isInitialLoadComplete.current) return;

            console.log("Loading wishlist from localStorage...");

            const saved = localStorage.getItem('wishlist');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    console.log("Loaded from localStorage:", parsed);
                    if(Array.isArray(parsed) && parsed.every(item => item.product && item.product.id)) {
                        setWishlist({ items: parsed });
                    console.log("If items were saved: ", JSON.stringify(parsed));
                    } else {
                        console.error('Invalid wishlist data structure');
                        localStorage.removeItem('wishlist');
                    }

                } catch (error) {
                    console.error('Failed to load wishlist', error);
                    localStorage.removeItem('wishlist');
                }
            }
         }, []);

         // Save to localStorage
         useEffect(()=> {
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            console.log('wishlist was saved successfully!', JSON.stringify(wishlist.items));
         }, [wishlist.items]);
    */