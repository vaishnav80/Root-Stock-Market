import React from 'react'
import OrderSection from '../../components/User/OrderSection'
import Profilesidebar from '../../components/User/Profilesidebar'
import Header from '../../components/User/Header'

function Order() {
  return (
    <div className='bg-gray-900'>
  <Header />
  <div className="flex h-screen">
    <div className="w-1/4 h-full bg-gray-100">
      <Profilesidebar />
    </div>
    <div className="w-3/4 h-full overflow-y-scroll">
      <OrderSection />
    </div>
  </div>
</div>
  )
}

export default Order