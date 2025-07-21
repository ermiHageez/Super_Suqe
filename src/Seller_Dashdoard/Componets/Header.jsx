import React from 'react';
import { useParams } from 'react-router-dom';
import "./ComponetCSS/Header.css";
import Seller_Catagories from './Seller_Catagories';
import Featured_Product from './Featured_Product';
import SellerByChannel from '../../Buyer/Componets/SellerByChannel';
import Seller from './Seller';
import { useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const username = queryParams.get("username") || "Buyer";

  return (
    <>
      <header className='header'>
        <div className="header__title">
          <h2>Seller Dashboard</h2>
        </div>


        <nav className='header__nav'>
            <div className='header__option header__user'>
            {/* <img 
              src="https://th.bing.com/th/id/OIP.vCCk-D4SnOzQmAfyFo1SHgHaHa?rs=1&pid=ImgDetMain" 
              alt="User Profile" 
              className="header__profile-img"
            /> */}
            <span className="header__username">{username || 'USER_NAME'}</span>
          </div>
          <div className='header__option'>
            <img 
              src="https://cdn4.iconfinder.com/data/icons/multimedia-75/512/multimedia-06-1024.png" 
              alt="Settings" 
              className="header__profile-img"
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
