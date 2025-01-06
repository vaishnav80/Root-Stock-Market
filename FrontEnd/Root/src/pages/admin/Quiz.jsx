import React from 'react'
import QuizTable from '../../components/Admin/QuizTable'
import Adminsidebar from '../../components/Admin/Adminsidebar'

function Quiz() {
  return (
<div>
        <div className='flex bg-black text-white'>
        <div className='w-1/4'>
            <Adminsidebar/>
        </div>
        <div className='w-3/4'>
            <QuizTable/>
        </div>
    </div>
        
       
      
    </div>
  )
}

export default Quiz