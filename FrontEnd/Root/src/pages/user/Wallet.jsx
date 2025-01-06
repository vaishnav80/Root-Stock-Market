import React from 'react'
import Profilesidebar from '../../components/User/Profilesidebar'
import Header from '../../components/User/Header'
import WalletSection from '../../components/User/WalletSection'

function Wallet() {
  return (
    <>
    <Header/>
    <div className="flex">
      <div className="w-1/4">
        <Profilesidebar />
      </div>
      <div className="w-3/4">
        <WalletSection/>
      </div>
    </div>
    </>
  )
}

export default Wallet