import React, { useState, useEffect } from "react";
import shopData from "./shopData.json";

const Shop = () => {
  const [selectedShop, setSelectedShop] = useState(null);

  const handleShopClick = (shop) => {
    setSelectedShop(shop);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Shops Working With Us</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {shopData.map((shop) => (
          <div
            key={shop.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              width: "200px",
              cursor: "pointer",
            }}
            onClick={() => handleShopClick(shop)}
          >
            <img
              src={shop.image}
              alt={shop.name}
              style={{ width: "100%", height: "120px", objectFit: "cover" }}
            />
            <h4>{shop.name}</h4>
            <p>{shop.location}</p>
          </div>
        ))}
      </div>

      {selectedShop && (
        <div style={{ marginTop: "40px" }}>
          <h3>Shop Details</h3>
          <img
            src={selectedShop.image}
            alt={selectedShop.name}
            style={{ width: "300px", height: "200px", objectFit: "cover" }}
          />
          <h4>{selectedShop.name}</h4>
          <p>{selectedShop.location}</p>
          <p>{selectedShop.description}</p>
        </div>
      )}
    </div>
  );
};

export default Shop;
