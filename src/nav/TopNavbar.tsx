// components/Navbar.tsx
import React, { useEffect, useRef, useState } from 'react';
import './TopNavbar.css';
import { useWishlist } from '../itemsComponents/products/wish-list/context/WishlistContext';
import { useCartlist } from '../itemsComponents/products/cart/context/CartlistContext';
//import { countFunction } from '../itemsComponents/products/wish-list/countFunction';

interface TopNavbarProps {
	setSearchQuery: (query: string)=> void;
	searchQuery: string;
	onItemId: (id: string)=> void;
	onLoading: (id: string | null)=> void;
	loading?: string | null;
}

const TopNavbar: React.FC<TopNavbarProps> = ({
	setSearchQuery,
	searchQuery,
	onItemId,
	onLoading,
	loading,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  let wishlistCount = 0;
  let cartlistCount = 0;
  
    const { wishlist } = useWishlist();
    const { cartlist } = useCartlist();

    // Problems of below code
    // it can only show number of added items after user refress the page
    // thats bacuase wishlist and cart context(WhihlistContext.tsx)
    // is getting data from storage before is page is refreshed
    // not after user save data to local storage

    // Solution
    // After user save data to local storage
    // Context must have a temporary variable to count addem items
     wishlistCount = wishlist?.items.length || 0;
    cartlistCount = cartlist?.items.length || 0;

  const handleInputChange=(e: React.ChangeEvent<HTMLInputElement>)=> {
    e.preventDefault();
    setSearchQuery(e.target.value);
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-left">
          {/*<a href="/" className="logo">
            <i className="fas fa-shopping-bag"></i>
            <span>ShopEase</span>
          </a>
          */}
          <div
        id="nav-container"
        style={{ color: '#fff', padding: '5px', width: '100%' }}
      >
        <h2 className="website-name">
          <a href="/" className="website-name-link">
            <span className='smart'>SMART</span> <i className="fa-solid fa-bag-shopping"></i> <span className='shopper'>SHOPPER</span>
          </a>
        </h2>
      </div>
          <div className="nav-links">
            <a href="/">Home</a>
            <a href="/categories">Categories</a>
            <a href="/deals">Deals</a>
            <a href="/about">About</a>
          </div>
        </div>
        
        <div className="nav-right">
          <div className="search-box">
            <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={handleInputChange}/>
            <button><i className="fas fa-search"></i></button>
              </div>
          <div className="nav-icons">
            <a href="/account"><i className="far fa-user"></i></a>
            <a href="/wishlist"><i className="far fa-heart"></i>
            {wishlistCount > 0 && <span className="cart-count">{wishlistCount}</span>}
            </a>
            <a href="/cart" className="cart-icon">
              <i className="fas fa-shopping-cart"></i>
              {cartlistCount > 0 && <span className="cart-count">{cartlistCount}</span>}
            </a>
          </div>
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        <a href="/">Home</a>
        <a href="/categories">Categories</a>
        <a href="/deals">Deals</a>
        <a href="/about">About</a>
        <div className="mobile-search">
          <input type="text" placeholder="Search..." />
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;