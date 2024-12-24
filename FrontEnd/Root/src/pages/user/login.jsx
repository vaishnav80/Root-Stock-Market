import React, { useEffect, useState } from "react";
import { loginUser } from "../../actions/user";
import { login } from "../../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const  auth  = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  useEffect(()=>{
    console.log('ds');
    
    if (auth){
      navigate('/')
    }

  },[auth])
  const loginSubmit = async (e) => {
    e.preventDefault();
    const response = await loginUser(email, password);
    if (response.status == 200) {
      console.log(response.data.user);
      dispatch(login(response.data.user));
      navigate("/");
    } else {
      console.log(response);
    }
  };
  return (
    <div className="min-h-screen flex">
      <div
        className="w-1/2 bg-[#1E1E2F] flex flex-col items-center justify-center bg-cover bg-center text-white relative"
        style={{ backgroundImage: "url('src/assets/boy.jpg')" }}
      >
        <div className="absolute top-8 left-8 text-2xl font-bold flex items-center">
          <div
            className="min-w-32 h-16 rounded-full flex justify-center mr-2 bg-cover bg-center"
            style={{ backgroundImage: "url('src/assets/1.png')" }}
          ></div>
        </div>
      </div>
      <div className="w-1/2 bg-[#2D2D3D] flex items-center justify-center">
        <div className="w-3/4 bg-[#1E1E2F] p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            Welcome to Root
          </h2>
          <p className="text-gray-400 text-center mb-8">
            Please sign in to your account
          </p>
          <form onSubmit={loginSubmit}>
            <div className="mb-6">
              <label className="block text-gray-400 mb-2">
                Email or Username
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border-none rounded-lg bg-[#2D2D3D] text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-400 mb-2">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border-none rounded-lg bg-[#2D2D3D] text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center mb-6">
              <input type="checkbox" id="remember" className="mr-2" />
              <label htmlFor="remember" className="text-gray-400">
                Remember me
              </label>
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200"
            >
              Sign In
            </button>
          </form>
          <p className="text-center text-gray-400 mt-6">
            New on our Root?{" "}
            <a href="/register" className="text-purple-600 hover:underline">
              Create an account
            </a>
          </p>
          <div className="flex justify-center mt-4">
            <a
              href="#"
              className="text-gray-400 hover:text-purple-600 transition"
            >
              <i className="fab fa-facebook"></i>
            </a>
            <a
              href="#"
              className="ml-4 text-gray-400 hover:text-purple-600 transition"
            >
              <i class="fab fa-google" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
