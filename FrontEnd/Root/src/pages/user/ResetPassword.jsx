import React, { useState } from 'react'
import { resetPassword } from '../../actions/user'
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'

function Resetpassword() {
    const [password1,setPassword1] = useState('')
    const [password2,setPassword2] = useState('')
    const [searchParams] = useSearchParams();
    const uid = searchParams.get("uid");
    const token = searchParams.get("token");
    const navigate = useNavigate()
    const handleReset = async () => {
        event.preventDefault();
        console.log(uid,token);
        if (password1 !== password2) {
            Swal.fire({
                title: "Password Do not match",
                icon: "error",
                draggable: true
              });
          return;
        }
    
        try {
          const response = await axios.post("https://api.rootstocks.site/account/reset-password/", {
            uid,
            token,
            password: password1,
          });
          Swal.fire({
                          title: "Password Reset Successfull",
                          icon: "success",
                          draggable: true
                        });
          navigate('/login')
        } catch (error) {
          console.error(error);
          alert(error.response?.data?.error || "Password reset failed.");
        }
      };
  return (
    <div className="min-h-screen flex">
      <div
        className="w-1/2 bg-[#1E1E2F] flex flex-col items-center justify-center bg-cover bg-center text-white relative"
        style={{ backgroundImage: "url('/assets/boy.jpg')" }}
      >
        <div className="absolute top-8 left-8 text-2xl font-bold flex items-center">
          <div
            className="min-w-32 h-16 rounded-full flex justify-center mr-2 bg-cover bg-center"
            style={{ backgroundImage: "url('/assets/1.png')" }}
          ></div>
        </div>
      </div>
      <div className="w-1/2 bg-[#2D2D3D] flex items-center justify-center">
        <div className="w-3/4 bg-[#1E1E2F] p-8 rounded-lg shadow-lg">
         <h2 className="text-2xl font-bold text-white text-center mb-6">
            Welcome to Root
          </h2>
          <p className="text-gray-400 text-center mb-8">
            Reset your Password here
          </p>
          <p className="text-rose-800 font-semibold text-lg">{}</p>
          <form onSubmit={handleReset}>
            
            <div className="mb-6">
              <label className="block text-gray-400 mb-2">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border-none rounded-lg bg-[#2D2D3D] text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Enter your password"
                onChange={(e)=>setPassword1(e.target.value)}
                />
            </div>
            <div className="mb-6">
              <label className="block text-gray-400 mb-2">Confirm Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border-none rounded-lg bg-[#2D2D3D] text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Confirm"
                onChange={(e)=>setPassword2(e.target.value)}
                />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200"
              >
              Reset
            </button>
          </form>
          
          
        
        </div>
        
        </div>
        
      
    </div>
  )
}

export default Resetpassword