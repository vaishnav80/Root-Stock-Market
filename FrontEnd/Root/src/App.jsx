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
function App() {
  

  return (
    

    <>
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/" element={<Dashboard/>}/>
      <Route path="/profile" element={<Profile/>}/>
      <Route path="/admin" element={<Adminlogin/>}/>
      <Route path="/admin/dashboard" element={<Admindashboard/>}/>
      <Route path="/admin/userlist" element={<Userlist/>}/>
      <Route path="/admin/lessons" element={<AdminLessons/>}/>
    </Routes>
    </>
    
  )
}

export default App
