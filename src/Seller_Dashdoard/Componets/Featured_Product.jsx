import * as React from 'react';
import PropTypes from 'prop-types';
import { Global } from '@emotion/react';
import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { grey } from '@mui/material/colors';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';

import AddProduct from "./AddProduct"
import Order from "./Order"
import SellerLocation from "./SellerLocation"

const drawerBleeding = 56;

const Root = styled('div')(({ theme }) => ({
  height: '100%',
  backgroundColor: grey[100],
  ...(theme.applyStyles?.('dark', {
    backgroundColor: (theme.vars || theme).palette.background.default,
  })),
}));

const StyledBox = styled('div')(({ theme }) => ({
  backgroundColor: '#fff',
  ...(theme.applyStyles?.('dark', {
    backgroundColor: grey[800],
  })),
}));

const Puller = styled('div')(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: grey[100],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(70% - 15px)',
  ...(theme.applyStyles?.('dark', {
    backgroundColor: grey[900],
  })),
}));

export default function SwipeableEdgeDrawer(props) {
  const { window } = props;
  const [open, setOpen] = React.useState(false);
  const [drawerContent, setDrawerContent] = React.useState('');

  const toggleDrawer = (newOpen, content) => () => {
    setDrawerContent(content);
    setOpen(newOpen);
  };

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Root>
      <CssBaseline />
      <Global
        styles={{
          '.MuiDrawer-root > .MuiPaper-root': {
            height: `calc(70% - ${drawerBleeding}px)`,
            overflow: 'visible',
          },
        }}
      />
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              pt: 2, 
              pb: 4, 
              px: 2,
              gap: "2%", 
              backgroundColor: "#ffffff", 
              borderRadius: 2 
            }}
          >
            <Card sx={{ width: 120, p: 2, borderRadius: 4, boxShadow: 1 }}>
              <CardActionArea onClick={toggleDrawer(true, 'Add Product')}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box
                    component="img"
                    src="https://cdn-icons-png.flaticon.com/128/992/992651.png"
                    alt="Add Product"
                    sx={{ width: 48, height: 48, mb: 1 }}
                  />
                  <Typography align="center" variant="body2" sx={{ color: 'green', fontWeight: 500 }}>
                    Add Product
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>

            <Card sx={{ width: 120, p: 2, borderRadius: 4, boxShadow: 1 }}>
              <CardActionArea onClick={toggleDrawer(true, 'Orders')}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box
                    component="img"
                    src="https://cdn3.iconfinder.com/data/icons/iconpark-vol-2/48/order-128.png"
                    alt="Orders"
                    sx={{ width: 48, height: 48, mb: 1 }}
                  />
                  <Typography align="center" variant="body2" sx={{ color: 'green', fontWeight: 500 }}>
                    My Orders
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>

            <Card sx={{ width: 120, p: 2, borderRadius: 4, boxShadow: 1 }}>
              <CardActionArea onClick={toggleDrawer(true, 'Set Location')}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box
                    component="img"
                    src="https://cdn1.iconfinder.com/data/icons/okku-office/32/Okku_Office_Expand-18-128.png"
                    alt="Set Location"
                    sx={{ width: 48, height: 48, mb: 1 }}
                  />
                  <Typography align="center" variant="body2" sx={{ color: 'green', fontWeight: 500 }}>
                    Set Location
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Box>



      <SwipeableDrawer
        container={container}
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false, '')}
        onOpen={toggleDrawer(true, drawerContent)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        keepMounted
      >
        <StyledBox
          sx={{
            position: 'absolute',
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            right: 0,
            left: 0,
          }}
        >
          <Puller />
          <Typography sx={{ p: 2, color: 'text.secondary' }}>{drawerContent}</Typography>
        </StyledBox>

        <StyledBox
          sx={{
            px: 2,
            pb: 2,
            height: '100%',
            maxHeight: '100%',
            overflowY: 'auto',
          }}
        >
          <Typography variant="body2">
            {drawerContent === 'Add Product' && (
              <>
               <AddProduct/>
              </>
            )}
            {drawerContent === 'Orders' && (
              <>
            <Order/>
              </>
            )}
            {drawerContent === 'Set Location' && (
              <>
                <SellerLocation/>
              </>
            )}
          </Typography>
        </StyledBox>
      </SwipeableDrawer>
    </Root>
  );
}

SwipeableEdgeDrawer.propTypes = {
  window: PropTypes.func,
}
