import React from 'react';
import { useLocation } from 'react-router-dom';
import "./ComponetCSS/Header.css";
import Seller_Catagories from './Seller_Catagories';
import Featured_Product from './Featured_Product';
// import SellerByChannel from '../../Buyer/Componets/SellerByChannel';
import Seller from './Seller';
import logo from "../../assets/mini_logo.png";

function Header() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const username = queryParams.get("username") || "Seller";

  return (
    <>
      <header className='header'>
        {/* Greeting Section */}
        <div className="header__greeting">
          <h3>
            <img src={logo} alt="Logo" className="logo" />
            Seller Dashboard <span className="header__username">{username}</span>
          </h3>
        </div>

        {/* Icons Section */}
        <nav className='header__icons'>
          {/* Optional user icon */}
          {/* <div className='header__icon'>
            <img 
              src="https://th.bing.com/th/id/OIP.vCCk-D4SnOzQmAfyFo1SHgHaHa?rs=1&pid=ImgDetMain" 
              alt="User Profile" 
              className="header__icon"
            />
          </div> */}
           <div>
            
           </div>

          <div>
            <img 
              src="https://cdn4.iconfinder.com/data/icons/multimedia-75/512/multimedia-06-1024.png" 
              alt="Settings" 
              className="header__icon"
            />
          </div>
        </nav>
      </header>

      <Seller_Catagories />
      <Featured_Product />
      {/* <SellerByChannel /> */}
      <Seller />
    </>
  );
}

export default Header;
