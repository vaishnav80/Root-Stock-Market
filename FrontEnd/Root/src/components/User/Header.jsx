import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar'

function Header() {
  const [state,setState] =  useState(false)
  return (
    <>
    <div className='w-full h-16 bg-black flex text-white' >
    <Link to={'/'}><img className='w-16 h-16 ml-6' src="/assets/1.png" alt="" /></Link>
    <h3 className='text-white mx-auto mt-4 text-[1.6rem] font-bold' >YOUR FINANCIAL MASTER FOR ANALYSIS STOCK MARKET</h3>
    <button className='pr-8' onClick={()=>setState(!state)}>{state ? 'HIDE' : 'SHOW'}</button>
    <Link to={'/profile'}><p className='fa fa-user mt-6 pr-4'></p></Link>
    <p className='fa fa-bars mt-6 mr-8'></p>
    </div>
    {state ? <Navbar/> : ''}
    </>
  )
}

export default Header