import "./App.css";
//importing react and css file
import React from "react";
import { Routes, Route} from "react-router-dom";

// importing Pages
import Logincard from "./LandingPage/Logincard";
import LandingPage from "./LandingPage/LandingPage";
import Product from "./Product_Details/Product";
import Admin from "./Admin_Panel/Admin";
import Home from "./Home/Home";
// import Header from "./Home/Componets/Header";
// import Catagories from "./Home/Componets/Catagories";
import PopularProduct from "./Home/Componets/PopularProduct";
import Seller from "./Home/Componets/Seller";
import SellerDashbord from "./Seller_Dashdoard/SellerDashbord";
import AddProduct from "./Seller_Dashdoard/Componets/AddProduct";
import Order from "./Seller_Dashdoard/Componets/Order";
import Buyer from "./Buyer/Buyer";
import Add_order from "./Buyer/Componets/Add_order";
import SellerLocation from "./Seller_Dashdoard/Componets/SellerLocation";
function App() {
  return (
    <>
      <Routes>
        {/* Product Details Route */}
        <Route path="/product" element={<Product />}>
          <Route index element={<Product />} />
        </Route>
        {/* ADMIN PANEL   Route */}
        <Route path="/admin" element={<Admin />}>
          <Route index element={<Admin />} />
        </Route>
        {/* Home Route */}
        <Route path="/" element={<Home />}>
          <Route index element={<PopularProduct />} />
          <Route path="category/:categoryId" element={<PopularProduct />} />
          <Route index element={<Seller />} />
        </Route>
        {/* 404 Page Not Found Route */}
        <Route path="/seller" element={<SellerDashbord />}>
           <Route path="addproduct" element={<AddProduct />} />
           <Route path="orders" element={<Order />} />
          <Route path="analytics" element={<SellerLocation />} />
        </Route>
        <Route path="/buyer" element={<Buyer />}>
           <Route path="addproduct" element={<AddProduct />} />
           <Route path="orders" element={<Add_order />} />
   
        </Route>
         {/* LOGIN PANEL   Route */}
        <Route path="/login" element={<LandingPage />}>
          <Route index element={<Logincard />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
