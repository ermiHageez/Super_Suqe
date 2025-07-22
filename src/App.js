import "./App.css";
import React from "react";
import { Routes, Route } from "react-router-dom";

import Logincard from "./LandingPage/Logincard";
import LandingPage from "./LandingPage/LandingPage";
import Product from "./Product_Details/Product";
import Admin from "./Admin_Panel/Admin";
import Home from "./Home/Home";
import PopularProduct from "./Home/Componets/PopularProduct";
import Seller from "./Home/Componets/Seller";
import SellerDashbord from "./Seller_Dashdoard/SellerDashbord";
import AddProduct from "./Seller_Dashdoard/Componets/AddProduct";
import Order from "./Seller_Dashdoard/Componets/Order";
import Buyer from "./Buyer/Buyer";
import Add_order from "./Buyer/Componets/Add_order";
import SellerLocation from "./Seller_Dashdoard/Componets/SellerLocation";
import UpdateProduct from "./Seller_Dashdoard/Componets/UpdateProduct"; // ✅ Import

function App() {
  return (
    <>
      <Routes>
        <Route path="/product" element={<Product />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/" element={<Home />}>
          <Route index element={<PopularProduct />} />
          <Route path="category/:categoryId" element={<PopularProduct />} />
          <Route index element={<Seller />} />
        </Route>

        <Route path="/seller" element={<SellerDashbord />}>
          <Route path="addproduct" element={<AddProduct />} />
          <Route path="orders" element={<Order />} />
          <Route path="analytics" element={<SellerLocation />} />
          <Route path="update/:productId" element={<UpdateProduct />} /> {/* ✅ New route */}
        </Route>

        <Route path="/buyer" element={<Buyer />}>
          <Route path="addproduct" element={<AddProduct />} />
          <Route path="orders" element={<Add_order />} />
        </Route>

        <Route path="/login" element={<LandingPage />}>
          <Route index element={<Logincard />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
