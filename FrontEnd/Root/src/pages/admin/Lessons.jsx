import React from 'react'
import Adminsidebar from '../../components/Admin/Adminsidebar'
import LessonTable from '../../components/Admin/LessonTable'

function AdminLessons() {
  return (
    <div>
        <div className='flex bg-black text-white'>
        <div className='w-1/4'>
            <Adminsidebar/>
        </div>
        <div className='w-3/4'>
            <LessonTable/>
        </div>
    </div>
        
       
      
    </div>
  )
}

export default AdminLessons