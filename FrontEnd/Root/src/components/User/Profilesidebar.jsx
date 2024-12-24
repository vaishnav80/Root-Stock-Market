import React from 'react'

function Profilesidebar() {
  return (
    <div className="bg-gray-800 h-screen p-4 flex flex-col">
         <button className="w-full py-5 my-5 mt-8 text-white border border-gray-500 rounded">Portfolio</button> 
         <button className="w-full py-5 my-5 text-white border border-gray-500 rounded">Orders</button> 
         <button className="w-full py-5 my-5 text-white border border-gray-500 rounded">Watchlist</button> 
         <button className="w-full py-5 my-5 text-white border border-gray-500 rounded">Wallet</button> 
         <button className="w-full py-5 my-5 text-white border border-gray-500 rounded">Contact us</button>
          <button className="w-full py-5 my-5 text-white border border-gray-500 rounded">LogOut</button>
           </div>

  )
}

export default Profilesidebar