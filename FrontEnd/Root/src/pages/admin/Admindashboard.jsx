import React, { useEffect, useState } from 'react'
import Adminsidebar from '../../components/Admin/Adminsidebar'
import { userList } from '../../actions/user'
import { useSelector } from 'react-redux'

function Admindashboard() {
  const [list,setList] = useState([])
  const auth = useSelector((select)=>select.auth)
  useEffect (()=>{
      async function collect(){
        const response = await userList(auth.token)
        console.log(response);
        if (response.status ==200){
          
          setList(response.data.user)
        }
      }
      collect()
    },[])
    console.log(list);
   
    
    const active = list.reduce((acc,i)=>{ return i.is_active?acc+1:acc},0)
    const inactiveUsers = list.length - active;
    
  return (
    <div className='flex bg-black text-white'>
        <div className='w-1/4'>
            <Adminsidebar/>
        </div>
        <div className='w-3/4'>
          <div className="bg-gray-900  text-white p-8 w-full">
            <div className="w-full  space-y-8">
            
              <header className="text-center">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              </header>

              
              <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                  <h2 className="text-xl font-semibold">Active Users</h2>
                  <p className="text-4xl font-bold">{active}</p>
                  <p className="text-sm text-gray-400">Currently active users</p>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                  <h2 className="text-xl font-semibold">Inactive Users</h2>
                  <p className="text-4xl font-bold">{inactiveUsers}</p>
                  <p className="text-sm text-gray-400">Currently inactive users</p>
                </div>
              </section>
              <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Leaderboard</h2>
                <ul className="divide-y divide-gray-700">
                  {list.map((user, index) => (
                    <li key={index} className="flex justify-between items-center py-2">
                      <span className={`text-white ${user.is_active ?   'text-gray-400' :'text-black'}`}>
                        {user.first_name}
                      </span>
                      <span className="text-sm text-gray-400">
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </div>
    
    </div>
  )
}

export default Admindashboard