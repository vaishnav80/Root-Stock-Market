import React from 'react'
import OrderSection from '../../components/User/OrderSection'
import Profilesidebar from '../../components/User/Profilesidebar'
import Header from '../../components/User/Header'

function Order() {
  return (
    <div>
        <Header/>
    <div className="flex">
      <div className="w-1/4">
        <Profilesidebar />
      </div>
      <div className="w-3/4">
        <OrderSection/>
      </div>
    </div>
    </div>
  )
}

export default Order