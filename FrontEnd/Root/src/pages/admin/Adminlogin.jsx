import React, { useEffect, useState } from "react";
import { loginUser, userLogout } from "../../actions/user";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const Adminlogin = () => {
  const auth = useSelector((state)=>state.auth)
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
      if (auth.token && auth.is_staff) {
        navigate("/admin/dashboard", { replace: true });
      }
    }, [auth.token, navigate]);

  const handleSubmit =async (e)=>{
    e.preventDefault()
    const response = await loginUser(email,password)
    console.log(response);
    
    if(response.status == 200){
      dispatch(login(response.data))
      if (response.data.user.is_staff ==true){
        navigate('/admin/dashboard')
      }
      else{
        toast.error("this page is only for admins");
       
        setTimeout(async () => {  
          const a = await userLogout(response.data.tokens.access, response.data.tokens.refresh);
          if (a.status === 200) {
            dispatch(logout());
            navigate('/login');  
          }
        }, 2000);
      }
    }
    else{
      toast.error('invalid user')
    }
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 shadow-md rounded-lg">
        <h2 className="text-3xl font-bold text-center text-gray-100">
          Admin Login
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 mt-2 text-gray-100 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="admin@example.com"
              required
              onChange={(e)=>setEmail(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 mt-2 text-gray-100 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Enter your password"
              required
              onChange={(e)=>setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 text-lg font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:ring-4 focus:ring-gray-500"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-center text-gray-400">
          Forgot your password?{" "}
          <a
            href="#"
            className="font-medium text-gray-300 hover:underline"
          >
            Reset it
          </a>
        </p>
      </div>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </div>
  );
};

export default Adminlogin;
