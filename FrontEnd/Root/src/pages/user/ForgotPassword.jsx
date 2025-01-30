import React, { useState } from 'react'
import { forgotPassword, resetPassword } from '../../actions/user'
import { useNavigate, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2'

function Forgotpassword() {
    const [email,setEmail] = useState('')
    const navigate = useNavigate() 
    
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await forgotPassword(email)
        console.log(response);
        
        if (response.status==200) {
            Swal.fire({
                title: "check your email to reset the password",
                icon: "success",
                draggable: true
              });
            navigate('/login')
        }
        else{
            alert('email is not matching with existing user plese create new account')
        }
      };
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
  <div
    className="w-full md:w-1/2 bg-[#1E1E2F] flex flex-col items-center justify-center bg-cover bg-center text-white relative"
    style={{ backgroundImage: "url('/assets/boy.jpg')" }}
  >
    <div className="absolute top-8 left-8 text-2xl font-bold flex items-center">
      <div
        className="min-w-32 h-16 rounded-full flex justify-center mr-2 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/1.png')" }}
      ></div>
    </div>
  </div>

  <div className="w-full md:w-1/2 bg-[#2D2D3D] flex items-center justify-center">
    <div className="w-11/12 md:w-3/4 bg-[#1E1E2F] p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white text-center mb-6">
        Welcome to Root
      </h2>
      <p className="text-gray-400 text-center mb-8"></p>
      <p className="text-rose-800 font-semibold text-lg">{}</p>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-400 mb-2"> Enter your valid Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border-none rounded-lg bg-[#2D2D3D] text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="Enter your Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200"
        >
          Submit
        </button>
      </form>
    </div>
  </div>
</div>

  )
}

export default Forgotpassword