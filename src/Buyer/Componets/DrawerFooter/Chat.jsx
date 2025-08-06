import React, { useState, useEffect } from 'react';

function Chat() {
  const [buyerUsername, setBuyerUsername] = useState('');
  const [sellerUsername, setSellerUsername] = useState('');
  const [subscriptionActive, setSubscriptionActive] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // Get seller username from URL
    const seller = params.get('seller');
    if (seller) {
      setSellerUsername(seller.startsWith('@') ? seller.slice(1) : seller);
    }

    // Get subscription status from URL
    const subscription = params.get('subscription');
    setSubscriptionActive(subscription === 'active');
  }, []);

  const handleStartChat = (e) => {
    e.preventDefault();
    if (!buyerUsername || !sellerUsername) return;
    window.open(`https://t.me/${sellerUsername}`, '_blank');
  };

  if (!subscriptionActive) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h4>🔒 Chat Access Denied</h4>
        <p>This feature is only available for <strong>subscribed sellers</strong>.</p>
        <p>But <strong>{sellerUsername} is Unsubscribed Seller </strong> <br/> <br/> <h2 style={{color:"green"}}>So use Order Button buyers.</h2></p>
      </div>
    ); 
  }

  return (
    <div style={{ padding: '20px' }}>
      <h4>Start Chat with Seller</h4>

      {!sellerUsername ? (
        <p style={{ color: 'red' }}>Seller username not found in URL.</p>
      ) : (
        <>
          <p><strong>Seller Telegram:</strong> @{sellerUsername}</p>

          <form onSubmit={handleStartChat} style={{ marginTop: '20px' }}>
            <label htmlFor="buyerUsername"><strong>Your Telegram Username:</strong></label>
            <input
              type="text"
              id="buyerUsername"
              value={buyerUsername}
              onChange={(e) => setBuyerUsername(e.target.value)}
              placeholder="@yourusername"
              required
              style={{
                width: '100%',
                padding: '10px',
                margin: '10px 0',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            />

            <button
              type="submit"
              style={{
                padding: '10px 20px',
                backgroundColor: '#0088cc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Start Chat on Telegram
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default Chat;
