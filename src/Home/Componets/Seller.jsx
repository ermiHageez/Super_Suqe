import React from 'react';
import './ComponetCSS/Seller.css';
import { useNavigate } from 'react-router-dom';

// Grouped by sellers
const sellers = [
  {
    seller: "@johns_electronics",
    products: [
      {
        id: 1,
        name: 'Smart Watch Pro',
        price: 129.99,
        rating: 4.8,
        image: 'https://th.bing.com/th/id/OIP.vCCk-D4SnOzQmAfyFo1SHgHaHa?rs=1&pid=ImgDetMain',
      },
      {
        id: 2,
        name: 'Wireless Headphones',
        price: 89.99,
        rating: 4.7,
        image: 'https://th.bing.com/th/id/R.4598d1bda3bd21f0c0c290f6d08edee7?rik=CLcM1sylVTpOlg&riu=http%3a%2f%2fwww.bhphotovideo.com%2fimages%2fimages2500x2500%2fbeats_by_dr_dre_900_00108_01_studio_wireless_headphones_white_1016366.jpg&ehk=%2fBwHdKJ0eGmmpzE7oTrCNsim037FuKZAmyeWVDddWhg%3d&risl=&pid=ImgRaw&r=0',
      },
    ],
  },
  {
    seller: "@Mahi_Cosmetics",
    products: [
      {
        id: 1,
        name: 'Cosmetics',
        price: 129.99,
        rating: 4.8,
        image: 'https://th.bing.com/th/id/R.82b84d0d490898c986776f2db166f7d0?rik=JCn0INXSj%2b4qVg&pid=ImgRaw&r=0',
      },
      {
        id: 2,
        name: 'Bass Boost Headset',
        price: 99.99,
        rating: 4.6,
        image: 'https://th.bing.com/th/id/OIP.PsauRC3J5OhNUyMiJeQ4YQHaFn?rs=1&pid=ImgDetMain',
      },
      {
        id: 1,
        name: 'Cosmetics',
        price: 129.99,
        rating: 4.8,
        image: 'https://th.bing.com/th/id/R.82b84d0d490898c986776f2db166f7d0?rik=JCn0INXSj%2b4qVg&pid=ImgRaw&r=0',
      },
      {
        id: 2,
        name: 'Bass Boost Headset',
        price: 99.99,
        rating: 4.6,
        image: 'https://th.bing.com/th/id/OIP.PsauRC3J5OhNUyMiJeQ4YQHaFn?rs=1&pid=ImgDetMain',
      },
    ],
 
  },
];

function Seller() {
  const navigate = useNavigate();
  return (
    <div className="seller-products">
      <div className="seller-products-header">
        <h2>Seller Products</h2>
        <a href="/all-products" className="see-all">See All Sellers</a>
      </div>

      {sellers.map((sellerObj, index) => (
        <div key={index} className="seller-section">
          <h3 className="seller-name">💙 {sellerObj.seller}</h3>
          <div className="product-list">
            {sellerObj.products.map(product => (
              <div className="product-card" key={product.id}>
                <img src={product.image} alt={product.name} className="product-image" />
                <div className="product-info">
                  <h4 className="product-name">{product.name}</h4>
                  <p className="product-price">${product.price.toFixed(2)}</p>
                  <span className="product-rating">⭐ {product.rating}</span>
                </div>
                 <button className='product-btn' onClick={()=>{navigate("/seller")}}>Shop Now</button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Seller;
