import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ComponetCSS/searchAndDisplay.css';
import search from "../../assets/search.png"; // Your search icon image

function SearchAndDisplay() {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchSubmitted, setSearchSubmitted] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/v1/product/all');
        const mapped = res.data.map(p => ({
          ...p,
          name: p.productName || p.product_name,
          category: (p.category || '').toLowerCase(),
          image: `http://localhost:8080/api/v1/product/image/${p.image}`
        }));
        setAllProducts(mapped);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };

    fetchProducts();
  }, []);

  const handleSearchSubmit = () => {
    const results = allProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredProducts(results);
    setSearchSubmitted(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  return (
    <div className="search-filter-wrapper">
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="Search any product"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          className="search-input"
        />
        <img
          src={search}
          alt="Search"
          className="search-icon-inside"
          onClick={handleSearchSubmit}
          role="button"
        />
      </div>

      {searchSubmitted && (
        <div className="product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <img
                  src={product.image}
                  alt={product.name}
                  onError={(e) => (e.target.style.display = 'none')}
                />
                <h3>{product.name}</h3>
                <p>${product.price?.toFixed(2)}</p>
                <p>⭐ {product.rating || 4.5}</p>
                <button>Shop Now</button>
              </div>
            ))
          ) : (
            <p className="no-results">No products found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchAndDisplay;
