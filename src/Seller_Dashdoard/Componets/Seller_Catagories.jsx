import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./ComponetCSS/Catagories.css";

function Seller_Catagories() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const username = "dagmawiacc";
        const response = await axios.get(`http://localhost:8080/api/orders/username/${username}`);
        const orderData = response.data;

        setOrders(orderData);
        setTotalOrders(orderData.length);

        const salesSum = orderData.reduce((sum, order) => sum + order.totalPrice, 0);
        setTotalSales(salesSum);

      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, []);

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
        <h2 className="card-value">${totalSales.toLocaleString()}</h2>
        <p className="card-change green">↑ 12.5% <span className="gray">vs last month</span></p>
      </div>

      <div className="card">
        <div className="card-top">
          <span className="card-title">Orders</span>
          <div className="card-icon blue">
            🛍️
          </div>
        </div>
        <h2 className="card-value">{totalOrders}</h2>
        <p className="card-change blue">↑ 8.2% <span className="gray">vs last month</span></p>
      </div>
    </div>
  );
}

export default Seller_Catagories;
