import React, { useState, useEffect } from 'react';
import { SwipeableDrawer, Button } from '@mui/material';
import UpdateProduct from './UpdateProduct';
import './ComponetCSS/Seller.css';

const Seller = () => {
  const [products, setProducts] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/product');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleUpdateClick = (product) => {
    setSelectedProduct(product);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedProduct(null);
    fetchProducts();
  };

  return (
    <div className="seller-container">
      <h2>Seller Dashboard</h2>
      <div className="product-list">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <h3>{product.product_name}</h3>
            <p>Price: ${product.price}</p>
            <p>Stock: {product.stockQuantity}</p>
            <Button variant="outlined" onClick={() => handleUpdateClick(product)}>
              Update
            </Button>
          </div>
        ))}
      </div>

      <SwipeableDrawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerClose}
        onOpen={() => {}}
      >
        <div style={{ width: 400, padding: '1rem' }}>
          {selectedProduct && (
            <UpdateProduct
              product={selectedProduct}
              onCloseDrawer={handleDrawerClose}
              refreshProducts={fetchProducts}
            />
          )}
        </div>
      </SwipeableDrawer>
    </div>
  );
};

export default Seller;
