import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./ComponetCSS/Catagories.css";

function Seller_Catagories() {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  return (
    <div className="card-container">
      <div className="card">
        <div className="card-top">
          <span className="card-title">Total Sales</span>
          <div className="card-icon green">
            💵
          </div>
        </div>
        <h2 className="card-value">$4,521</h2>
        <p className="card-change green">↑ 12.5% <span className="gray">vs last month</span></p>
      </div>

      <div className="card">
        <div className="card-top">
          <span className="card-title">Orders</span>
          <div className="card-icon blue">
            🛍️
          </div>
        </div>
        <h2 className="card-value">42</h2>
        <p className="card-change blue">↑ 8.2% <span className="gray">vs last month</span></p>
      </div>
    </div>
  );
}

export default Seller_Catagories;
