// components/Footer.tsx
import React from 'react';

const Footers: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>ShopEase</h3>
            <p>Your one-stop destination for all your shopping needs. We offer quality products at competitive prices with excellent customer service.</p>
            <div className="social-links">
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/products">Products</a></li>
              <li><a href="/categories">Categories</a></li>
              <li><a href="/deals">Special Deals</a></li>
              <li><a href="/about">About Us</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Customer Service</h4>
            <ul>
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/shipping">Shipping Info</a></li>
              <li><a href="/returns">Returns & Exchanges</a></li>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Newsletter</h4>
            <p>Subscribe to get special offers and updates</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Your email address" />
              <button>Subscribe</button>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="payment-methods">
            <i className="fab fa-cc-visa"></i>
            <i className="fab fa-cc-mastercard"></i>
            <i className="fab fa-cc-paypal"></i>
            <i className="fab fa-cc-apple-pay"></i>
          </div>
          <p>&copy; 2023 ShopEase. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footers;