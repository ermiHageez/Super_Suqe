import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Componets/Header'
import Footer from './Componets/Footer'
function SellerDashbord() {
  return (
    <>
      <Header />
      <div style={{ marginTop: '100px' }}>
        <Outlet />
      </div>
      <Footer/>
    </>
  )
}

export default SellerDashbord
