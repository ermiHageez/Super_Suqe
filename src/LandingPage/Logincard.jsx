import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import telegram_image from "../assets/Telegram_Image.png";
import "./ComponetCSS/Logincard.css";
import Featured_Product from "../Home/Componets/Featured_Product";
import PopularProduct from "../Home/Componets/PopularProduct";

const Logincard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [roleSelected, setRoleSelected] = useState(null); // "buyer" or "seller"
  const [location, setLocation] = useState(null);
  const [showTopUpAlert, setShowTopUpAlert] = useState(false);

  const navigate = useNavigate();

  // ✅ Show TopUp Alert
  const handleTopUp = () => {
    setShowTopUpAlert(true);
    setTimeout(() => setShowTopUpAlert(false), 3000);
  };

  // ✅ Ask for location
  const askForLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setLocation(coords);
        console.log("📍 Seller location set:", coords);
        alert("📍 Location captured!");
        // Here you'd send this to the backend using fetch or axios
      },
      (err) => {
        alert("⚠️ Please allow location access");
        console.error(err);
      }
    );
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      fetch("http://localhost:8080/api/v1/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setIsLoggedIn(true);
          setUserId(data.id);
        })
        .catch(() => setIsLoggedIn(false));
    }

    // 🔌 Load Telegram Login
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?7";
    script.setAttribute("data-telegram-login", "he_geezdeliverbot"); // No @
    script.setAttribute("data-size", "large");
    script.setAttribute("data-userpic", "true");
    script.setAttribute("data-request-access", "write");
    script.setAttribute("data-onauth", "onTelegramAuth");
    script.async = true;

    const container = document.getElementById("telegram-login-container");
    if (container) {
      container.innerHTML = "";
      container.appendChild(script);
    }

    // 💬 Telegram Login Callback
    window.onTelegramAuth = async (user) => {
      try {
        const res = await fetch("http://localhost:8080/api/v1/user/telegram-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            telegramId: user.id,
            username: user.username,
            fullName: user.first_name + (user.last_name ? ` ${user.last_name}` : ""),
            photoUrl: user.photo_url,
          }),
        });

        const data = await res.json();

        if (res.ok && data.token) {
          localStorage.setItem("user", JSON.stringify(data));
          localStorage.setItem("authToken", data.token);
          setIsLoggedIn(true);
          setUserId(data.id);
        } else {
          alert("❌ Login failed.");
        }
      } catch (err) {
        console.error("Telegram login error:", err);
      }
    };
  }, [navigate]);

  return (
    <div className="home-container">
      <div className="header">
        <div className="home-header">
          <img src={telegram_image} alt="Telegram" className="logo" />
        </div>

        <div className="order">
          <div className="order-text">
            <h1>Order</h1>
            <p>🛍️ Connect your Telegram to shop or sell instantly.</p>

            {!isLoggedIn ? (
              <div id="telegram-login-container" style={{ marginTop: "20px" }} />
            ) : roleSelected === null ? (
              <div style={{ marginTop: "15px" }}>
                <p>Choose your role:</p>
                <button className="btn" onClick={() => setRoleSelected("buyer")}>
                  🛒 Buyer
                </button>
                <button className="btn" onClick={() => setRoleSelected("seller")}>
                  🏪 Seller
                </button>
              </div>
            ) : roleSelected === "buyer" ? (
              <button className="login-button" onClick={() => navigate("/buyer")}>
                Go to Buyer Page
              </button>
            ) : (
              <>
                <button className="btn" onClick={askForLocation}>
                  📍 Set My Location
                </button>
                {location && (
                  <button className="login-button" onClick={() => navigate("/seller")}>
                    Proceed as Seller
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <p className="featured">Featured Products</p>
      <div className="card-section">
        <PopularProduct />
      </div>

      <div className="footer">
        <p>All rights reserved ©2025 By HaGeez</p>
        <div className="btnchack">
          <button className="btn" onClick={handleTopUp}>
            💳 Top Up
          </button>
        </div>
      </div>

      {/* ✅ TopUp Alert */}
      {showTopUpAlert && (
        <div style={styles.alert}>✅ Your account has been successfully topped up!</div>
      )}
    </div>
  );
};

const styles = {
  alert: {
    position: "fixed",
    top: "10px",
    right: "10px",
    backgroundColor: "#4caf50",
    color: "white",
    padding: "10px 20px",
    borderRadius: "5px",
    zIndex: 999,
  },
};

export default Logincard;
