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
import Resetpassword from './pages/user/Resetpassword'
import Forgotpassword from './pages/user/ForgotPassword'
import Wallet from './pages/user/Wallet'
import Portfolio from './pages/user/Portfolio'
import Order from './pages/user/Order'
import LessonContent from './pages/admin/LessonContent'
import AddLesson from './pages/admin/AddLesson'
import Quiz from './pages/admin/Quiz'
import Support from './pages/admin/Support'
import LessonLayout from './pages/user/LessonLayout'
import StockMarketNews from './pages/user/News'
import QuizCompetition from './pages/user/QuizCompetition'
import Community from './pages/user/Community'
import Analysis from './pages/user/Analysis'
import EditLesson from './pages/admin/EditLesson'
import Contactus from './pages/user/Contactus'
import WatchList from './components/User/Watchlist'
import WatchListPage from './pages/user/WatchList'

function App() {
  const auth = useSelector((state)=>state.auth)
  const dispatch = useDispatch()

  const Protected = ({element})=>{
    if(!auth.token || !auth.is_active){
      dispatch(logout())
      return <Navigate to="/login" />;
    }
    if (auth.is_staff) {
      dispatch(logout())
      return <Navigate to="/login" />;
        
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
      {/* autentication */}
      <Route path="/login" element={<Unauthorized element = {<Login/>}/>}/>
      <Route path="/register" element={<Unauthorized element={<Register/>}/>}/>
      <Route path='/resetPassword' element = {<Resetpassword/>}/>
      <Route path='/forgotPassword' element = {<Forgotpassword/>} />

      {/* user side Protected*/}
      <Route path="/" element={<Protected element ={<Dashboard/>}/>}/>
      <Route path="/profile" element={<Protected element = {<Profile/>}/>}/>
      <Route path="/wallet" element={<Protected element = {<Wallet/>}/>}/>
      <Route path="/portfolio" element={<Protected element ={<Portfolio/>}/>}/>
      <Route path="/order" element={<Protected element ={<Order/>}/>}/>
      <Route path="/lesson" element={<Protected element ={<LessonLayout/>}/>}/>
      <Route path="/news" element={<Protected element ={<StockMarketNews/>}/>}/>
      <Route path="/quizcompetition" element={<Protected element ={<QuizCompetition/>}/>}/>
      <Route path="/community" element={<Protected element ={<Community/>}/>}/>
      <Route path="/analysis" element={<Protected element ={<Analysis/>}/>}/>
      <Route path="/contactus" element={<Protected element ={<Contactus/>}/>}/>
      <Route path="/watchlist" element={<Protected element ={<WatchListPage/>}/>}/>

      {/* admin side */}
      <Route path="/admin" element={<Adminlogin/>}/>

      {/* admin side Protected */}
      <Route path="/admin/dashboard" element={<Adminauth element={<Admindashboard/>}/>}/>
      <Route path="/admin/userlist" element={<Adminauth element={<Userlist/>}/>}/>
      <Route path="/admin/lessons" element={<Adminauth element={<AdminLessons/>}/>}/>
      <Route path ="/admin/content/:id/:heading" element ={<Adminauth element={<LessonContent/>}/> }/>
      <Route path ="/admin/Addcontent/:id/:heading" element ={<Adminauth element={<AddLesson/>}/> }/>
      <Route path ="/admin/Editcontent/:headingId/:id/:heading" element ={<Adminauth element={<EditLesson/>}/> }/>
      <Route path ="/admin/Quiz" element ={<Adminauth element={<Quiz/>}/> }/>
      <Route path ="/admin/Support" element ={<Adminauth element={<Support/>}/> }/>
      
    </Routes>
    </>
    
  )
}

export default App
