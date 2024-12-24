import React from 'react'
import Adminsidebar from '../../components/Admin/Adminsidebar'

function Admindashboard() {
  return (
    <div className='flex bg-black text-white'>
        <div className='w-1/4'>
            <Adminsidebar/>
        </div>
        <div className='h-3/4'>
            <h1>Dashboard</h1>
        </div>
    
    </div>
  )
}

export default Admindashboard