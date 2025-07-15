import React from 'react';
import './ComponetCSS/PopularProduct.css';

const products = [
  {
    id: 1,
    name: 'Cosmetics',
    price: 129.99,
    rating: 4.8,
    seller: "John's Electronics",
    image: 'https://th.bing.com/th/id/R.82b84d0d490898c986776f2db166f7d0?rik=JCn0INXSj%2b4qVg&pid=ImgRaw&r=0',
  },
  {
    id: 2,
    name: 'Smart TV',
    price: 89.99,
    rating: 4.7,
    seller: 'Audio World',
    image: 'https://th.bing.com/th/id/OIP.1izymIXypdS9oqOYXHfjagHaEo?rs=1&pid=ImgDetMain',
  },
  {
    id: 3,
    name: 'Smart Watch Pro',
    price: 129.99,
    rating: 4.8,
    seller: "John's Electronics",
    image: 'https://th.bing.com/th/id/OIP.vCCk-D4SnOzQmAfyFo1SHgHaHa?rs=1&pid=ImgDetMain',
  },
  {
    id: 4,
    name: 'Wireless Headphones',
    price: 89.99,
    rating: 4.7,
    seller: 'Audio World',
    image: 'https://th.bing.com/th/id/R.4598d1bda3bd21f0c0c290f6d08edee7?rik=CLcM1sylVTpOlg&riu=http%3a%2f%2fwww.bhphotovideo.com%2fimages%2fimages2500x2500%2fbeats_by_dr_dre_900_00108_01_studio_wireless_headphones_white_1016366.jpg&ehk=%2fBwHdKJ0eGmmpzE7oTrCNsim037FuKZAmyeWVDddWhg%3d&risl=&pid=ImgRaw&r=0',
  },
];

function PopularProduct() {
  return (
    <div className="popular-products">
      <div className="popular-products-header">
        <h2>Popular Products</h2>
        <a href="/all-products" className="see-all">See All</a>
      </div>
      <div className="product-list">
        {products.map(product => (
          <div className="product-card" key={product.id}>
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">${product.price.toFixed(2)}</p>
              <div className="product-rating-seller">
                <span className="product-rating">⭐ {product.rating}</span>
                <span className="product-seller">💙 {product.seller}</span>
              </div>
            </div>
              <button className='product-btn'>Shop Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PopularProduct;
