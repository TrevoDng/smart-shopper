import './Footer.css';

export const FooterComponent =()=> {
    
    return (
 <footer className="site-footer">
  <div className="container">
    <div className="footer-content">
      <div className="footer-section about">
        <h3>About Us</h3>
        <p>Company description goes here.</p>
      </div>
      
      <div className="footer-section links">
        <h3>Quick Links</h3>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">Services</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>
      
      <div className="footer-section contact">
        <h3>Contact Info</h3>
        <p>Email: info@example.com</p>
        <p>Phone: (123) 456-7890</p>
      </div>
    </div>
    
    <div className="footer-bottom">
      <p>&copy; 2023 SMART SHOPPERS. All rights reserved.</p>
    </div>
  </div>
</footer>
)
}