import React from 'react'

function Adminsidebar() {
  return (
    <div className="bg-gray-800 h-screen p-4 flex flex-col">
         <button className="w-full py-5 my-5 mt-8 text-white border border-gray-500 rounded">Dashboard</button> 
         <button className="w-full py-5 my-5 text-white border border-gray-500 rounded">Users</button> 
         <button className="w-full py-5 my-5 text-white border border-gray-500 rounded">Lessons</button> 
         <button className="w-full py-5 my-5 text-white border border-gray-500 rounded">Quiz</button> 
         <button className="w-full py-5 my-5 text-white border border-gray-500 rounded">Support</button>
          <button className="w-full py-5 my-5 text-white border border-gray-500 rounded">LogOut</button>
           </div>

  )
}

export default Adminsidebar