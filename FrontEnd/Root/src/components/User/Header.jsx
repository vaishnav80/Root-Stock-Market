import React from 'react'
import { Link } from 'react-router-dom'

function Header() {
  return (
    <>
    <div className='w-full h-16 bg-black flex text-white' >
    <img className='w-16 h-16 ml-6' src="src/assets/1.png" alt="" />
    <h3 className='text-white mx-auto mt-4 text-3xl font-bold' >YOUR FINANCIAL MASTER FOR ANALYSIS STOCK MARKET</h3>
    <Link to={'/profile'}><p className='fa fa-user mt-6 pr-4'></p></Link>
    <p className='fa fa-bars mt-6 mr-8'></p>
    </div>
    </>
  )
}

export default Header