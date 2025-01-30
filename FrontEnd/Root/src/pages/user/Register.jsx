import React, { useState } from "react";
import { RegisterUser } from "../../actions/user";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const a = await RegisterUser(
      formData.name,
      formData.email,
      formData.password,
      formData.confirm_password
    );
    console.log(a);
    if (a.status == 201) {
      navigate("/login");
    } else {
      toast.error(a.data.error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
  <div
    className="w-full sm:w-1/2 bg-[#1E1E2F] flex flex-col items-center justify-center bg-cover bg-center text-white relative"
    style={{ backgroundImage: "url('/assets/boy.jpg')" }}
  >
    <div className="absolute top-8 left-8 text-2xl font-bold flex items-center">
      <div
        className="min-w-32 h-16 rounded-full flex justify-center mr-2 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/1.png')" }}
      ></div>
    </div>
  </div>

  <div className="w-full sm:w-1/2 bg-[#2D2D3D] flex items-center justify-center p-4 sm:p-0">
    <div className="w-full sm:w-3/4 bg-[#1E1E2F] p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white text-center mb-6">
        Create Your Account
      </h2>
      <p className="text-gray-400 text-center mb-8">
        Please fill in the details to register
      </p>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-400 mb-2">Full Name</label>
          <input
            type="text"
            name="name"
            className="w-full px-4 py-2 border-none rounded-lg bg-[#2D2D3D] text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="Enter your full name"
            onChange={handleChange}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-400 mb-2">Email</label>
          <input
            type="email"
            name="email"
            className="w-full px-4 py-2 border-none rounded-lg bg-[#2D2D3D] text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="Enter your email"
            onChange={handleChange}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-400 mb-2">Password</label>
          <input
            type="password"
            name="password"
            className="w-full px-4 py-2 border-none rounded-lg bg-[#2D2D3D] text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="Enter your password"
            onChange={handleChange}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-400 mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirm_password"
            className="w-full px-4 py-2 border-none rounded-lg bg-[#2D2D3D] text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="Confirm your password"
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200"
        >
          Register
        </button>
        <p className="text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-purple-600 hover:underline">
            Sign in here
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
            <i className="fab fa-google" aria-hidden="true"></i>
          </a>
        </div>
      </form>
    </div>
  </div>

  <Toaster position="top-center" reverseOrder={false} />
</div>

  );
};

export default Register;
