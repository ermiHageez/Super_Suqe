import React, { useEffect, useState } from 'react';
import './ComponetCSS/PopularProduct.css';
import axios from 'axios';

function PopularProduct() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/product/all');
        const allProducts = response.data;

        // Limit to first 6 products (optional)
        const formattedProducts = allProducts.slice(0, 6).map(product => ({
          id: product.id,
          name: product.productName || product.product_name,
          price: product.price,
          rating: product.rating || 4.5,
          seller: product.seller?.username || "Unknown Seller",
          image: `http://localhost:8080/api/v1/product/image/${product.image}`,
        }));

        setProducts(formattedProducts);
      } catch (err) {
        console.error('Error loading popular products:', err);
        setError('Unable to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPopularProducts();
  }, []);

  if (loading) return <p>Loading popular products...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="popular-products">
      <div className="popular-products-header">
        <h2>Popular Products</h2>
        <a href="/all-products" className="see-all">See All</a>
      </div>
      <div className="product-list">
        {products.map(product => (
          <div className="product-card" key={product.id}>
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">${product.price.toFixed(2)}</p>
              <div className="product-rating-seller">
                <span className="product-rating">⭐ {product.rating}</span>
                <span className="product-seller">💙 {product.seller}</span>
              </div>
            </div>
            <button className="product-btn">Shop Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PopularProduct;
