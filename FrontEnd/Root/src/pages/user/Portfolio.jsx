import React from 'react'
import Header from '../../components/User/Header'
import Profilesidebar from '../../components/User/Profilesidebar'
import Portfoliosection from '../../components/User/portfoliosection'
import Navbar from '../../components/User/Navbar'

function Portfolio() {
  return (
    <div>
        <Header/>
    <div className="flex">
      <div className="w-1/4 h-screen">
        <Profilesidebar />
      </div>
      <div className="w-3/4 ">
        <Portfoliosection/>
      </div>
    </div>
    </div>
  )
}

export default Portfolio