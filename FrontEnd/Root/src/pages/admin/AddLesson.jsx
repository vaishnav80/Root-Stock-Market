import React from 'react'
import AddEditLesson from '../../components/Admin/AddContents'
import Adminsidebar from '../../components/Admin/Adminsidebar'

function AddLesson() {
  return (
    <div>
        <div className='flex bg-black text-white'>
        <div className='w-1/4'>
            <Adminsidebar/>
        </div>
        <div className='w-3/4'>
            <AddEditLesson/>
        </div>
    </div>
        
       
      
    </div>
  )
}

export default AddLesson