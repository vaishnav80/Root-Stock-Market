import React from 'react'
import Header from '../../components/User/Header'
import Profilesidebar from '../../components/User/Profilesidebar'
import PortfolioSection from '../../components/User/portfoliosection'



function Portfolio() {
  return (
    <div className='bg-gray-900'>
    <Header />
    <div className="flex flex-col md:flex-row h-screen">
      <div className="w-full md:w-1/4 h-full bg-gray-100">
        <Profilesidebar />
      </div>
      <div className="w-full md:w-3/4 h-full overflow-y-scroll">
        <PortfolioSection/>
      </div>
    </div>
  </div>
  )
}

export default Portfolio