import axios from 'axios'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { userLogout } from '../../actions/user'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../redux/authSlice'

function Adminsidebar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const auth = useSelector((state)=>state.auth)
  const handleLogout = async ()=>{
      const response = await userLogout(auth.token,auth.refreshToken)
      if (response.status ==200){
        dispatch(logout())
        navigate('/admin')
      }
      console.log(response.data);
      
  }
  return (
    <div className="bg-gray-800 h-screen p-4 flex flex-col">
         <Link to={'/admin/dashboard'}><button className="w-full py-5 my-5 mt-8 text-white border border-gray-500 rounded">Dashboard</button> </Link>
         <Link to={'/admin/userlist'}><button className="w-full py-5 my-5 text-white border border-gray-500 rounded">Users</button></Link> 
         <Link to={'/admin/lessons'}><button className="w-full py-5 my-5 text-white border border-gray-500 rounded">Lessons</button></Link>
         <Link to={'/admin/Quiz'}><button className="w-full py-5 my-5 text-white border border-gray-500 rounded">Quiz</button> </Link>
         <Link to={'/admin/Support'}><button className="w-full py-5 my-5 text-white border border-gray-500 rounded">Support</button></Link>
          <button className="w-full py-5 my-5 text-white border border-gray-500 rounded" onClick={handleLogout}>LogOut</button>
           </div>

  )
}

export default Adminsidebar