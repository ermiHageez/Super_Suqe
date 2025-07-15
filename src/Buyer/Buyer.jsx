import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Componets/Header'
import Catagories from './Componets/Catagories'
import Featured_Product from './Componets/Featured_Product'
import Seller from './Componets/Buyer'
import Myorder from './Componets/Myorder'
import "./BuyerCSS/home.css"
function Home() {
  return (
    <>
      <div className="home">
      <Header />
      {/* <Catagories/> */}
      <Myorder />
      <Featured_Product/>
      <Outlet/>
      <Seller/>
      
      </div>

    </>
  )
}

export default Home