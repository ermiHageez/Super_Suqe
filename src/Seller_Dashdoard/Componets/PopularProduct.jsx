import React, { useEffect, useState } from 'react';
import './ComponetCSS/PopularProduct.css';

function PopularProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);

  // Extract query params and save to localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const extractedUsername = params.get("username");
    const role = params.get("role");

    if (extractedUsername) {
      localStorage.setItem("username", extractedUsername);
      setUsername(extractedUsername);
    }

    if (role) {
      localStorage.setItem("role", role);
    }
  }, []);

  // Fetch products after username is set
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
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [username]); // depends on username

  return (
    <div className="popular-products">
      <div className="popular-products-header">
        <h2>Popular Products</h2>
        <a href="/all-products" className="see-all">See All</a>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="product-list">
          {products.length === 0 ? (
            <p>No products found for user: {username}</p>
          ) : (
            products.map(product => (
              <div className="product-card" key={product.id}>
                <img
                  src={`data:image/jpeg;base64,${product.image}`}
                  alt={product.name}
                  className="product-image"
                />
                <div className="product-info" >
                  <h3 className="product-name">{product.product_name || 'Unnamed Product'}</h3>
                  <p className="product-price">ETB {product.product_name}</p>
                  <div className="product-rating-seller">
                    <span className="product-rating">⭐ {product.stockQuantity || 'N/A'}</span>
                    <span className="product-seller">💙 {product.description}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default PopularProduct;
