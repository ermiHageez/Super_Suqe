import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Componets/Header'

function SellerDashbord() {
  return (
    <>
      <Header />
      <div style={{ marginTop: '100px' }}>
        <Outlet />
      </div>
    </>
  )
}

export default SellerDashbord
