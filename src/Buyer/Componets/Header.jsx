import React from 'react';
import { useLocation } from 'react-router-dom';
import "./ComponetCSS/Header.css";

function BuyerHeader() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const username = queryParams.get("username") || "Buyer";
  const role = queryParams.get("role") || "Buyer";

  return (
    <>
    <header className='header'>
      <div className="header__top">
        <div className="header__greeting">
          <h2>Welcome back, <br/>{username}!</h2>
        </div>
      </div>
        {/* <div className="header__role">
          <h3>Role: {role}</h3>    
        </div> */}
     
        <div className="header__icons">
          <img 
            src="https://cdn4.iconfinder.com/data/icons/multimedia-75/512/multimedia-06-1024.png" 
            alt="Search" 
            className="header__icon"
          />
          <img 
            src="https://cdn0.iconfinder.com/data/icons/mobile-basic-vol-1/32/Notification-128.png" 
            alt="Notifications" 
            className="header__icon"
          />
        </div>
      

     
    </header>
    </>
  );
}

export default BuyerHeader;
