import React, { useEffect, useState } from 'react';
import './ComponetCSS/Buyer.css';
import { SwipeableDrawer, Box, Typography } from '@mui/material';
import axios from 'axios';
import AddOrder from './Add_order';
import BuyerLocation from './Buyerlocation';

function Buyer() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerOpenLocation, setDrawerOpenLocation] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/product/all');
        const products = response.data;

        const grouped = products.reduce((acc, product) => {
          const username = product.seller?.username || "Unknown Seller";
          if (!acc[username]) acc[username] = [];
          acc[username].push(product);
          return acc;
        }, {});

        const formatted = Object.entries(grouped).map(([seller, products]) => ({
          seller,
          sellerLat: products[0]?.seller?.latitude || 9.0245,
          sellerLng: products[0]?.seller?.longitude || 38.7485,
          products: products.map(p => ({
            id: p.id,
            name: p.productName || p.product_name,
            price: p.price,
            rating: p.rating || 4.5,
            stockQuantity: p.stockQuantity || 0,
            image: `data:image/jpeg;base64,${p.image}`,
            seller: seller,
          })),
        }));

        setSellers(formatted);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleOrderNow = (product, sellerLat, sellerLng) => {
    setSelectedProduct({
      ...product,
      sellerLat,
      sellerLng
    });
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedProduct(null);
  };

  if (loading) return <p>Loading seller products...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="seller-products">
      <div className="seller-products-header">
        <h2>Seller Products</h2>
      </div>

      {sellers.map((sellerObj, index) => (
        <div key={index} className="seller-section">
          <h3 className="seller-name">💙 {sellerObj.seller}</h3>
          <div className="product-row">
            {sellerObj.products.map(product => (
              <div className="product-card-new" key={`${sellerObj.seller}-${product.id}`}>
                
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image-new"
                  onError={(e) => e.target.style.display = 'none'}
                />
                <div className="product-details-new">
                  <div className="product-name-new">{product.name}</div>
                  <div className="product-price-new">${product.price.toFixed(2)}</div>
                  <div className="product-rating-new">⭐ {product.rating}</div>
                </div>
                <button
                  className="order-now-btn"
                  onClick={() => handleOrderNow(product, sellerObj.sellerLat, sellerObj.sellerLng)}
                >
                  Order Now
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <SwipeableDrawer
        anchor="bottom"
        open={drawerOpen}
        onClose={handleDrawerClose}
        onOpen={() => setDrawerOpen(true)}
        swipeAreaWidth={56}
      >
        <Box sx={{ p: 2, height: '90vh', overflowY: 'auto' }}>
          <Typography variant="h6" gutterBottom>Order Details</Typography>
          {selectedProduct && (
            <AddOrder
              product={selectedProduct}
              sellerLat={selectedProduct?.sellerLat}
              sellerLng={selectedProduct?.sellerLng}
              onClose={handleDrawerClose}
            />
          )}
        </Box>
      </SwipeableDrawer>

      <SwipeableDrawer
        anchor="bottom"
        open={drawerOpenLocation}
        onClose={handleDrawerClose}
        onOpen={() => setDrawerOpenLocation(true)}
        swipeAreaWidth={56}
      >
        <Box sx={{ p: 2, height: '50vh', overflowY: 'auto' }}>
          <Typography variant="h6" gutterBottom>Set Your Location</Typography>
          <BuyerLocation/>
        </Box>
      </SwipeableDrawer>
    </div>
  );
}

export default Buyer;
