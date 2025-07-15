import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "./ComponetCSS/order.css";

function MapResizer() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 200);
  }, [map]);
  return null;
}

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleCancel = async (orderId) => {
    try {
      await axios.delete(`http://localhost:8080/api/orders/delete/${orderId}`);
      alert("Order canceled ❌");
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== orderId)
      );
    } catch (err) {
      alert("Failed to cancel order");
      console.error("Cancel error:", err);
    }
  };

  const handleAccept = async (orderId) => {
    try {
      await axios.put(`http://localhost:8080/api/orders/${orderId}/status`, {
        status: "ACCEPTED",
      });
      alert("Order accepted ደሶኛል 🎉");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "ACCEPTED" } : order
        )
      );
    } catch (err) {
      alert("Failed to accept order");
      console.error("Accept error:", err);
    }
  };

  useEffect(() => {
    (async () => {
      const seller = localStorage.getItem("username");
      try {
        const res = await axios.get(
          `http://localhost:8080/api/orders/username/${seller}`
        );
        setOrders(res.data);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    })();
  }, []);

  if (loading)
    return <div style={{ textAlign: "center" }}>⏳ Loading orders...</div>;

  return (
    <div className="container">
      <h2>🧾 Buyer Orders</h2>
      {orders.map((order) => {
        const buyerLoc = [order.buyerLatitude, order.buyerLongitude];
        const sellerLoc = [order.sellerLatitude, order.sellerLongitude];
        return (
          <div key={order.id} className="order-card">
            <MapContainer
              center={sellerLoc}
              zoom={13}
              style={{ height: "250px", width: "100%" }}
            >
              <MapResizer />
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {order.sellerLatitude && order.sellerLongitude && (
                <Marker position={sellerLoc}>
                  <Popup>Seller</Popup>
                </Marker>
              )}
              {order.buyerLatitude && order.buyerLongitude && (
                <Marker position={buyerLoc}>
                  <Popup>Buyer</Popup>
                </Marker>
              )}
              {order.sellerLatitude && order.buyerLatitude && (
                <Polyline positions={[sellerLoc, buyerLoc]} color="blue" />
              )}
            </MapContainer>

            <div className="order-details">
              <p>
                <strong>📦 Product:</strong> {order.productName}
              </p>
              <p>
                <strong>🧍 Buyer:</strong> {order.buyer}
              </p>
              <p>
                <strong>📱 Phone:</strong> {order.phoneNumber}
              </p>
              <p>
                <strong>🛒 Quantity:</strong> {order.quantity}
              </p>
              <p>
                <strong>💵 Price:</strong> {order.price}
              </p>
              <p>
                <strong>📌 Status:</strong> {order.status}
              </p>
            </div>
            <div className="button-section">
              <button
                className="draft-btn"
                onClick={() => handleCancel(order.id)}
              >
                Cancel Order
              </button>
              <button
                className="publish-btn"
                onClick={() => handleAccept(order.id)}
                disabled={order.status === "ACCEPTED"}
                style={{
                  backgroundColor: order.status === "ACCEPTED" ? "green" : "",
                  color: order.status === "ACCEPTED" ? "white" : "",
                }}
              >
                Accept Order
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Order;
