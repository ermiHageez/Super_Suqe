import React, { useState, useEffect } from 'react';
import './ComponetCSS/Featured_Product.css';

const featuredData = [
  {
    title: 'Habesha Men/የወንድ ሐበሻ ልብስ',
    description: 'Up to 50% off',
    image: 'https://i.pinimg.com/originals/2a/10/1d/2a101d519811cc092ca35c9b1599a868.jpg',
  },
  {
    title: 'Habesha Kemis/ሐበሻ ቀሚ.',
    description: 'Check the latest trends',
    image: 'https://i.pinimg.com/564x/dc/59/f3/dc59f30813334bcd2f90f325a34a5e1c.jpg',
  },
  {
    title: 'Ermi Electronics',
    description: 'Limited time offers!',
    image: 'https://i.ytimg.com/vi/XQBu50vXvvE/maxresdefault.jpg',
  },

];

function Featured_Product() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % featuredData.length);
    }, 8000); // change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const { title, description, image } = featuredData[index];

  return (
    <div className="featured-wrapper">
      <div className="featured-product fade-in">
        <div className="featured-content">
          <h2>{title}</h2>
          <p>{description}</p>
          <button>Shop Now</button>
        </div>
        <div className="featured-image">
          <img src={image} alt={title} />
        </div>
      </div>
    </div>
  );
}

export default Featured_Product;
