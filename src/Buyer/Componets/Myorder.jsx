import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ComponetCSS/Myorders.css";

const Myorder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!expanded) return;
    fetchOrders();
  }, [expanded]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:8080/api/orders");
      setOrders(response.data);
    } catch (err) {
      setError("Failed to fetch orders. Please try again.");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleAccept = async (orderId, currentStatus) => {
    try {
      let nextStatus;
      if (currentStatus === "Pending") {
        nextStatus = "Accepted";
      } else if (currentStatus === "Accepted") {
        nextStatus = "Delivered";
      } else {
        return; // Delivered already, do nothing
      }

      await axios.put(`http://localhost:8080/api/orders/${orderId}/status`, {
        status: nextStatus
      });

      alert(`Order marked as ${nextStatus} 🎉`);
      setOrders((prevOrders) =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: nextStatus } : order
        )
      );
    } catch (err) {
      alert("Failed to update order status");
      console.error("Accept error:", err);
    }
  };

  const handleCancel = async (orderId) => {
    try {
      await axios.delete(`http://localhost:8080/api/orders/delete/${orderId}`);
      alert("Order canceled ❌");
      setOrders((prevOrders) =>
        prevOrders.filter(order => order.id !== orderId)
      );
    } catch (err) {
      alert("Failed to cancel order");
      console.error("Cancel error:", err);
    }
  };

  return (
    <div className="myorder-container">
      <button className="toggle-orders-btn" onClick={toggleExpand}>
        {expanded ? "Hide My Orders ▲" : "Show My Orders ▼"}
      </button>

      {expanded && (
        <div className="orders-list">
          {loading && <div style={{ textAlign: "center", marginTop: "1rem" }}>⏳ Loading orders...</div>}
          {error && <p style={{ color: "red", textAlign: "center", marginTop: "1rem" }}>{error}</p>}
          {!loading && !error && orders.length === 0 && (
            <p style={{ textAlign: "center", marginTop: "1rem" }}>No orders found.</p>
          )}

          {!loading && !error && orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-details">
                <div className="partone">
                  <p><strong>📦 Product:</strong> {order.productName}</p>
                  <p><strong>🧍 Seller:</strong> {order.seller || "N/A"}</p>
                  <p><strong>📱 Buyer:</strong> {order.buyer || "N/A"}</p>
                  <p><strong>📞 Phone:</strong> {order.phoneNumber || "N/A"}</p>
                </div>
                <div className="parttwo">
                  <p><strong>📅 Ordered At:</strong> {order.orderedAt || "N/A"}</p>
                  <p><strong>🛒 Quantity:</strong> {order.quantity}</p>
                  <p><strong>💵 Price:</strong> ${order.totalPrice}</p>
                  <p><strong>📌 Status:</strong> {order.status || "Pending"}</p>
                </div>
              </div>
              <div className="button-section">
                <button className="draft-btn" onClick={() => handleCancel(order.id)}>
                  Cancel Order
                </button>
                <button
                  className="publish-btn"
                  onClick={() => handleAccept(order.id, order.status)}
                  disabled={order.status === "Delivered"}
                  style={{
                    backgroundColor:
                      order.status === "Pending" ? "#ffb300ff" :
                      order.status === "ACCEPTED" ? "#007bff" :
                      order.status === "Delivered" ? "green" : "gray",
                    color: "white",
                    cursor: order.status === "Delivered" ? "not-allowed" : "pointer"
                  }}
                >
                  {order.status === "Pending" && "Your Order Pending... ⏳"}
                  {order.status === "ACCEPTED" && "Accept Order ✅"}
                  {order.status === "Delivered" && "Delivered ደርሶኛል"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Myorder;
