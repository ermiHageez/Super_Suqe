import React, { useState } from 'react';

function Feedback() {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Feedback submitted:', message);
    alert('Thank you for your feedback!');
    setMessage('');
  };

  return (
    <div>
      <h4>We value your feedback! </h4>
      <form onSubmit={handleSubmit} className="feedback-form">
        <textarea
          rows="4"
          style={{ width: '90%', padding: '10px', marginBottom: '10px', borderRadius: '5px'}}
          placeholder="Write your feedback here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#007BFF',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Submit
        </button>
      </form>

      <div style={{ marginTop: '20px', textAlign:'left' }}>
        <h5>📞 Contact Information</h5>
        <p ><strong>Email:</strong> ermihageez@gmail.com</p>
        <p><strong>Phone:</strong> +251 984502134</p>
        <p><strong>Address:</strong> 1000 Addis Ababa Ethiopia</p>
      </div>
    </div>
  );
}

export default Feedback;
