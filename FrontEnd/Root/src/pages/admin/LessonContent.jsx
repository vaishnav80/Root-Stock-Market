import React from 'react'
import Adminsidebar from '../../components/Admin/Adminsidebar'
import ContentTable from '../../components/Admin/ContentTable'

function LessonContent() {
  return (
    <div>
        <div className='flex bg-black text-white'>
        <div className='w-1/4'>
            <Adminsidebar/>
        </div>
        <div className='w-3/4'>
            <ContentTable/>
        </div>
    </div>
        
       
      
    </div>
  )
}

export default LessonContent