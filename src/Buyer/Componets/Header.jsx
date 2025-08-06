import React from 'react';
import { useLocation } from 'react-router-dom';
import "./ComponetCSS/Header.css";
import logo from "../../assets/mini_logo.png"

function BuyerHeader() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const username = queryParams.get("username") || "Buyer";

  return (
    <header className='header' style={{maxWidth:"80%"}}>
      
      {/* Left: Greeting */}
      <div className="header__greeting">
        <h3>   <img
        src={logo}
        alt="Logo"
        className="logo"
      />Welcome back,{username}!</h3>

      </div>
     
      {/* Right: Icons */}
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
        <div>

        </div>
      </div>
     
    </header>
  );
}

export default BuyerHeader;
