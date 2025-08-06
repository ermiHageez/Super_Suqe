import React from "react";

const AboutUs = () => {
  const backgroundStyle = {
    backgroundImage:
      "url('https://images.unsplash.com/photo-1515169067865-5387ec356754?auto=format&fit=crop&w=1950&q=80')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: "60px 20px",
    minHeight: "100vh",
    color: "#fff",
    textShadow: "1px 1px 3px rgba(0,0,0,0.7)",
  };

  const contentStyle = {
    maxWidth: "800px",
    margin: "0 auto",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: "30px",
    borderRadius: "10px",
  };

  return (
    <div style={backgroundStyle}>
      <div style={contentStyle}>
        <h1>About Hageez & Super Suqe</h1>
        <p>
          <strong>Hageez</strong> is a forward-thinking tech startup focused on empowering local communities and small businesses through simple, powerful digital tools.
        </p>
        <p>
          <strong>Super Suqe</strong> is our flagship marketplace — a Telegram-powered platform where local sellers can easily showcase products, and buyers can explore and shop with one click.
        </p>
        <p>
          Built with the goal of connecting small vendors to digital customers, Super Suqe simplifies online selling in Ethiopia using the tools people already use daily.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
