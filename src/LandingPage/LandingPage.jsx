import React from 'react'
import { Outlet } from 'react-router-dom'
import Landing_Header from './Landing_Header'

function LandingPage() {
  return (
   <>
   <Landing_Header/>
     <h1>Landing Page</h1>
     <Outlet/>
   </>
  )
}

export default LandingPage