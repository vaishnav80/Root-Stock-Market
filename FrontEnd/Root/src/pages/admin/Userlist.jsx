import React from 'react'
import Adminsidebar from '../../components/Admin/Adminsidebar'
import UsersTable from '../../components/Admin/Usertable'

function Userlist() {
  return (
    <div>
        <div className='flex bg-black text-white'>
        <div className='w-1/4'>
            <Adminsidebar/>
        </div>
        <div className='w-3/4'>
            <UsersTable/>
        </div>
    </div>
        
        
    </div>
  )
}

export default Userlist