import React from 'react'
import EditContent from '../../components/Admin/EditContent'
import Adminsidebar from '../../components/Admin/Adminsidebar'

function EditLesson() {
  return (
    <div>
        <div className='flex bg-black text-white'>
        <div className='w-1/4'>
            <Adminsidebar/>
        </div>
        <div className='w-3/4'>
            <EditContent/>
        </div>
    </div>
        
       
      
    </div>
  )
}

export default EditLesson