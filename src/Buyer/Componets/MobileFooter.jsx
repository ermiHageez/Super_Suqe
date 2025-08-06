import React, { useState } from 'react';
import './ComponetCSS/footer.css';
import logo from '../../assets/mini_logo.png';
import { SwipeableDrawer, Box, Typography } from '@mui/material';

import FeedBack from "./DrawerFooter/FeedBack"
import Chat from "./DrawerFooter/Chat"
import Shop from "./DrawerFooter/Shop"
import AboutUs from "./DrawerFooter/AboutUs"

function MobileFooter() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState('');

  const toggleDrawer = (content) => {
    setDrawerContent(content);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setDrawerContent('');
  };

  return (
    <>
      <footer className="mobile-footer">
        <div className="footer-item" onClick={() => toggleDrawer('home')}>
          <img src="https://img.icons8.com/ios-filled/24/ffffff/home.png" alt="Home" />
          <span>Home</span>
        </div>

        <div className="footer-item" onClick={() => toggleDrawer('shop')}>
          <img src="https://img.icons8.com/ios-filled/24/ffffff/shop.png" alt="Shop" />
          <span>Shop</span>
        </div>

        <div className="footer-logo">
          <img src={logo} alt="Logo" />
        </div>

        <div className="footer-item" onClick={() => toggleDrawer('chat')}>
          <img src="https://img.icons8.com/ios-filled/24/ffffff/chat.png" alt="Chat" />
          <span>Chat</span>
        </div>

        <div className="footer-item" onClick={() => toggleDrawer('FeedBack')}>
          <img src="https://img.icons8.com/ios-filled/24/ffffff/feedback.png" alt="Contact" />
          <span>FeedBack</span>
        </div>
      </footer>

      <SwipeableDrawer
        anchor="bottom"
        open={drawerOpen}
        onClose={handleDrawerClose}
        onOpen={() => setDrawerOpen(true)}
      >
        <Box sx={{ p: 2, height: '50vh', overflowY: 'auto' }}>
          <Typography variant="h6" gutterBottom>
            {drawerContent.charAt(0).toUpperCase() + drawerContent.slice(1)}
          </Typography>

          {/* Example drawer content based on clicked icon */}
          {drawerContent === 'chat' && <div><Chat/></div>}
          {drawerContent === 'contact' && <div>Contact form or info here...</div>}
          {drawerContent === 'home' && <div>Home content goes here...</div>}
          {drawerContent === 'aboutUs' && <div><AboutUs/></div>}
          {drawerContent === 'shop' && <div><Shop/></div>}
          {drawerContent === 'FeedBack' && <div><FeedBack/></div>}
        </Box>
      </SwipeableDrawer>
    </>
  );
}

export default MobileFooter;
