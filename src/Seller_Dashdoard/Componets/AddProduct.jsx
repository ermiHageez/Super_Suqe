import React, { useEffect, useState } from 'react';
import './ComponetCSS/add_product.css';
import { useNavigate } from 'react-router-dom';
import CameraCapture from '../../Camera/Camera';
import axios from 'axios';

const AddProduct = () => {
  const [product_name, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [productId, setProductId] = useState(null); // ← track saved product ID

  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const username = params.get("username");
    const role = params.get("role");

    if (username) localStorage.setItem("username", username);
    if (role) localStorage.setItem("role", role);
  }, []);

  const handleCapture = (imageData) => {
    setImage(imageData);
  };

  const removeImage = () => setImage(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSaveProduct = async () => {
    const sellerUsername = localStorage.getItem("username");
    const seller = { username: sellerUsername };
    if (!sellerUsername) {
      alert("No seller identified. Please log in again.");
      return;
    }

    const product = {
      productName: product_name,
      price: parseFloat(price),
      stockQuantity: parseInt(stockQuantity),
      category,
      description,
      seller
    };

    try {
      const res = await axios.post(`http://localhost:8080/api/v1/product/add/${sellerUsername}`, product);
      const savedProduct = res.data;
      setProductId(savedProduct.id); // ← store ID
      alert("✅ Product saved. Now add image.");
      console.log("Product being sent:", product);
    } catch (err) {
      console.error("Error saving product:", err);
      alert("❌ Failed to save product.");
    }
  };

  const handleUploadImage = async () => {
    if (!productId || !image) {
      alert("Missing product ID or image.");
      return;
    }

    const base64Image = image.replace(/^data:image\/\w+;base64,/, '');
    const dto = { id: productId, image: base64Image };

    try {
      await axios.post("http://localhost:8080/api/v1/product/upload-image", dto);
      alert("✅ Image uploaded successfully.");
      // navigate("/seller");
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("❌ Failed to upload image.");
    }
  };

  const handleCancel = () => navigate("/seller");

  return (
    <div className="container" style={{ overflowY: 'auto', maxHeight: '100%', paddingBottom: '20px' }}>
      <h1>Add New Product</h1>

      <div className="image-section">
        <div className="image-box">
          <img 
            src={image || "https://i.pinimg.com/736x/c1/0b/22/c10b22dd5ec114ebca263b8220bdead4.jpg"}
            alt="Product Preview"
          />
        </div>

        {image && (
          <button 
            style={{
              marginTop: '10px',
              backgroundColor: 'red',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            onClick={removeImage}
          >
            Delete Image
          </button>
        )}

        {productId && (
          <>
            <CameraCapture onCapture={handleCapture} />

            <div style={{ marginTop: '10px' }}>
              <label style={{ fontWeight: 'bold' }}>Or Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ marginTop: '5px' }}
              />
            </div>
          </>
        )}
      </div>

      {!productId && (
        <div className="form-section">
          <div className="input-group">
            <label>Product Name</label>
            <input
              type="text"
              value={product_name}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Enter product name"
            />
          </div>

          <div className="input-group">
            <label>Price (ETB)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="input-group">
            <label>Stock Quantity</label>
            <input
              type="number"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="category-section">
            <label>Category</label>
            <div className="categories">
              {["Electronics", "Clothing", "Food", "Home", "Toys", "Other"].map((cat) => (
                <button 
                  key={cat}
                  className={category === cat ? 'selected' : ''}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="input-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description"
            />
          </div>
        </div>
      )}

      <div className="button-section">
        <button className="draft-btn" onClick={handleCancel}>
          Cancel
        </button>
        {!productId ? (
          <button className="publish-btn" onClick={handleSaveProduct}>
            Save Product
          </button>
        ) : (
          <button className="publish-btn" onClick={handleUploadImage}>
            Upload Image
          </button>
        )}
      </div>
    </div>
  );
};

export default AddProduct;
