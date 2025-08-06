import React from 'react';
import './ComponetCSS/Footer.css';
import logo from '../../assets/mini_logo.png'; // Make sure this path is correct

function Footer() {
  return (
    <footer className="mobile-footer">
     <div className="footer-item">
        <img src="https://img.icons8.com/ios-filled/24/ffffff/home.png" alt="Home" />
        <span>Home</span>
      </div>
      <div className="footer-item">
        <img src="https://img.icons8.com/ios-filled/24/ffffff/shop.png" alt="Shop" />
        <span>Shop</span>
      </div>

      <div className="footer-logo">
        <img src={logo} alt="Logo" />
      </div>

      <div className="footer-item">
        <img src="https://img.icons8.com/ios-filled/24/ffffff/user.png" alt="Profile" />
        <span>Profile</span>
      </div>
      <div className="footer-item">
        <img src="https://img.icons8.com/ios-filled/24/ffffff/phone.png" alt="Contact" />
        <span>Contact</span>
      </div>
    </footer>
  );
}

export default Footer;
