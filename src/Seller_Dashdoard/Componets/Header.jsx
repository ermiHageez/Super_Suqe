import React from 'react';
import "./ComponetCSS/Header.css";
import Seller_Catagories from './Seller_Catagories';
import Featured_Product from './Featured_Product';
import Seller from './Seller';

function Header() {
  return (
    <>
    <header className='header'>
      <div className="header__title">
        <h2>Seller Dashboard</h2>
      </div>

      <nav className='header__nav'>
        <div className='header__option'>
          <img 
            src="https://cdn4.iconfinder.com/data/icons/multimedia-75/512/multimedia-06-1024.png" 
            alt="Settings" 
            className="header__profile-img"
          />
        </div>
        {/* <div className='header__option'>
          <img 
            src="https://cdn0.iconfinder.com/data/icons/mobile-basic-vol-1/32/Notification-128.png" 
            alt="Notifications" 
            className="header__profile-img"
          />
        </div> */}
        <div className='header__option header__user'>
          <img 
            src="https://th.bing.com/th/id/OIP.vCCk-D4SnOzQmAfyFo1SHgHaHa?rs=1&pid=ImgDetMain" 
            alt="User Profile" 
            className="header__profile-img"
          />
          <span className="header__username">Ermiyas</span>
        </div>
      </nav>
    </header>
    <Seller_Catagories/>
      <Featured_Product/>
      <Seller/>
</>

  );
}

export default Header;
