import React, { useState, useEffect } from 'react';

const UpdateProduct = ({ product, onCloseDrawer, refreshProducts }) => {
  const [formData, setFormData] = useState({
    product_name: '',
    description: '',
    price: '',
    stockQuantity: '',
    image: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        product_name: product.product_name || '',
        description: product.description || '',
        price: product.price || '',
        stockQuantity: product.stockQuantity || '',
        image: product.image || '',
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/api/v1/product/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Product updated successfully!');
        onCloseDrawer();
        refreshProducts();
      } else {
        alert('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const styles = {
    formContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      padding: '1rem',
    },
    input: {
      padding: '10px',
      fontSize: '16px',
      borderRadius: '5px',
      border: '1px solid #ccc',
    },
    label: {
      fontWeight: 'bold',
    },
    button: {
      padding: '10px',
      backgroundColor: '#1976d2',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
  };

  return (
    <form onSubmit={handleSubmit} style={styles.formContainer}>
      <h2>Update Product</h2>

      <label style={styles.label}>Product Name</label>
      <input
        style={styles.input}
        type="text"
        name="product_name"
        value={formData.product_name}
        onChange={handleChange}
        required
      />

      <label style={styles.label}>Description</label>
      <input
        style={styles.input}
        type="text"
        name="description"
        value={formData.description}
        onChange={handleChange}
      />

      <label style={styles.label}>Price</label>
      <input
        style={styles.input}
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        required
      />

      <label style={styles.label}>Stock Quantity</label>
      <input
        style={styles.input}
        type="number"
        name="stockQuantity"
        value={formData.stockQuantity}
        onChange={handleChange}
        required
      />

      <label style={styles.label}>Image URL</label>
      <input
        style={styles.input}
        type="text"
        name="image"
        value={formData.image}
        onChange={handleChange}
      />

      <button type="submit" style={styles.button}>Update Product</button>
    </form>
  );
};

export default UpdateProduct;
