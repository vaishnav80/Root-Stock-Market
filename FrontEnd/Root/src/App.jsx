import { useState } from 'react'
import './App.css'
import Login from './pages/user/login'
import Register from './pages/user/Register'
import Dashboard from './pages/user/Dashboard'
import Profile from './pages/user/Profile'
import Adminlogin from './pages/admin/Adminlogin'
import Admindashboard from './pages/admin/Admindashboard'
import Userlist from './pages/admin/Userlist'
import { BrowserRouter as Router, Route, Routes, Link,useNavigate } from 'react-router-dom';
import AdminLessons from './pages/admin/Lessons'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { logout } from './redux/authSlice'

function App() {
  const auth = useSelector((state)=>state.auth)
  const dispatch = useDispatch()

  const Protected = ({element})=>{
    if(!auth.token || !auth.is_active){
      dispatch(logout())
      return <Navigate to="/login" />;
    }
    if (auth.is_staff) {
        return <Navigate to="/admin/dashboard" />;
        
      }
    return element;
  }
  const Unauthorized = ({element})=>{
    if (auth.token){
      return <Navigate to="/" />;
    }
    return element
  } 
  const Adminauth = ({element})=>{

    if (!auth.token || auth.is_staff === false ){
      dispatch(logout())
      return <Navigate to="/admin" />;
    }
    return element
  } 


  return (
    

    <>
    <Routes>
      <Route path="/login" element={<Unauthorized element = {<Login/>}/>}/>
      <Route path="/register" element={<Unauthorized element={<Register/>}/>}/>


      <Route path="/" element={<Protected element ={<Dashboard/>}/>}/>
      <Route path="/profile" element={<Protected element = {<Profile/>}/>}/>


      <Route path="/admin" element={<Adminlogin/>}/>

      <Route path="/admin/dashboard" element={<Adminauth element={<Admindashboard/>}/>}/>
      <Route path="/admin/userlist" element={<Adminauth element={<Userlist/>}/>}/>
      <Route path="/admin/lessons" element={<Adminauth element={<AdminLessons/>}/>}/>
      
    </Routes>
    </>
    
  )
}

export default App
