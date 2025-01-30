import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar'

function Header() {
  const [state,setState] =  useState(false)
  return (
    <>
  <div className="w-full h-16 bg-black flex items-center text-white px-4 sm:px-6">
    {/* Logo */}
    <Link to={'/'}>
      <img className="w-12 sm:w-16 h-12 sm:h-16" src="/assets/1.png" alt="" />
    </Link>

    {/* Title */}
    <h3 className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-center flex-1 px-2 sm:px-4">
      YOUR FINANCIAL MASTER FOR ANALYSIS STOCK MARKET
    </h3>

    {/* Toggle Button */}
    <button className="px-3 sm:px-4 text-sm sm:text-base" onClick={() => setState(!state)}>
      {state ? 'HIDE' : 'SHOW'}
    </button>

    {/* User and Menu Icons */}
    <Link to={'/profile'}>
      <p className="fa fa-user text-lg sm:text-xl px-2 sm:px-4"></p>
    </Link>
    <p className="fa fa-bars text-lg sm:text-xl px-2 sm:px-4"></p>
  </div>

  {/* Navbar */}
  {state ? <Navbar /> : ''}
</>

  )
}

export default Header