import React from 'react'
import Profilesidebar from '../../components/User/Profilesidebar'
import Header from '../../components/User/Header'
import WatchList from '../../components/User/Watchlist';



function WatchListPage() {
    console.log('wathc');
    
  return (
  
    <div className='bg-gray-900'>
  <Header />
  <div className="flex h-screen">
    <div className="w-1/4 h-full bg-gray-100">
      <Profilesidebar />
    </div>
    <div className="w-3/4 h-full overflow-y-scroll">
      <WatchList/>
    </div>
  </div>
</div>
    
  )
}

export default WatchListPage