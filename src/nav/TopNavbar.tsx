// components/Navbar.tsx
import React, { useEffect, useRef, useState } from 'react';
import './TopNavbar.css';
import { useWishlist } from '../itemsComponents/products/wish-list/context/WishlistContext';
import { useCartlist } from '../itemsComponents/products/cart/context/CartlistContext';

interface TopNavbarProps {
  setSearchQuery: (query: string) => void;
  searchQuery: string;
  onItemId: (id: string) => void;
  onLoading: (id: string | null) => void;
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
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  
  const { wishlist } = useWishlist();
  const { cartlist } = useCartlist();

  const wishlistCount = wishlist?.items.length || 0;
  const cartlistCount = cartlist?.items.length || 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
  };

  const handleMobileSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMobileSearchQuery(e.target.value);
    setSearchQuery(e.target.value);
  };

  const handleMobileSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-left">
          {/* Website Logo/Name */}
          <div className="website-brand">
            <a href="/" className="brand-link">
              <span className="brand-text brand-smart">Eisle</span>
              <i className="fa-solid fa-bag-shopping brand-icon"></i>
              <span className="brand-text brand-shopper">NET</span>
            </a>
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
              onChange={handleInputChange}
            />
            <button><i className="fas fa-search"></i></button>
          </div>
          
          <div className="nav-icons">
            <a href="/account"><i className="far fa-user"></i></a>
            <a href="/wishlist" className="icon-wrapper">
              <i className="far fa-heart"></i>
              {wishlistCount > 0 && <span className="cart-count">{wishlistCount}</span>}
            </a>
            <a href="/cart" className="icon-wrapper cart-icon">
              <i className="fas fa-shopping-cart"></i>
              {cartlistCount > 0 && <span className="cart-count">{cartlistCount}</span>}
            </a>
          </div>
          
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        <a href="/" onClick={() => setIsMenuOpen(false)}>Home</a>
        <a href="/categories" onClick={() => setIsMenuOpen(false)}>Categories</a>
        <a href="/deals" onClick={() => setIsMenuOpen(false)}>Deals</a>
        <a href="/about" onClick={() => setIsMenuOpen(false)}>About</a>
        <a href="/account" onClick={() => setIsMenuOpen(false)}>Account</a>
        <a href="/wishlist" onClick={() => setIsMenuOpen(false)}>Wishlist</a>
        <a href="/cart" onClick={() => setIsMenuOpen(false)}>Cart</a>
        <form onSubmit={handleMobileSearchSubmit} className="mobile-search">
          <input 
            type="text" 
            placeholder="Search products..." 
            value={mobileSearchQuery}
            onChange={handleMobileSearch}
          />
        </form>
      </div>
    </nav>
  );
};

export default TopNavbar;