import React, { useEffect, useState } from 'react';
import './ComponetCSS/Seller.css';
import { useNavigate } from 'react-router-dom';

function Seller() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  // Extract username and role from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const extractedUsername = params.get('username');
    const role = params.get('role');

    if (extractedUsername) {
      localStorage.setItem('username', extractedUsername);
      setUsername(extractedUsername);
    }

    if (role) {
      localStorage.setItem('role', role);
    }
  }, []);

  // Fetch seller's products
  useEffect(() => {
    const fetchProducts = async () => {
      if (!username) return;

      try {
        const response = await fetch(`http://localhost:8080/api/v1/product/username/${username}`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching seller products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [username]);

  return (
    <div className="seller-products">
      <div className="seller-products-header">
        <h2>Your Products</h2>
        <a href="/all-products" className="see-all">View All</a>
      </div>

      <div className="seller-section">
        <h3 className="seller-name">💙 @{username}</h3>

        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products found for @{username}</p>
        ) : (
          <div className="product-list">
            {products.map(product => (
              <div className="product-card" key={product.id}>
                <img
                  src={`data:image/jpeg;base64,${product.image}`}
                  alt={product.name}
                  className="product-image"
                />
                <div className="product-info">
                  <h4 className="product-name"><strong>{product.product_name}</strong></h4>
                  <p className="product-price">${product.price.toFixed(2)}</p>
                  <span className="product-rating">⭐ Quantity {product.stockQuantity || 'N/A'}</span><br />
                  <span className="product-rating">👁️ {product.description || '—'}</span>
                </div>
                <div className="product-actions">
                  <button
                    className="edit-button"
                    onClick={() => {
                      navigate('/UpdateProduct', {
                        state: {productId: product.id, productName: product.product_name, price: product.price, stockQuantity: product.stockQuantity, category: product.category, description: product.description, image: product.image}
                      }); 
                    }}
                  >
                    Update
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Seller;
