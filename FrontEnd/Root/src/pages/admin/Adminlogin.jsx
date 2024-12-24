import React from "react";

const Adminlogin = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 shadow-md rounded-lg">
        <h2 className="text-3xl font-bold text-center text-gray-100">
          Admin Login
        </h2>
        <form className="space-y-6">
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
    </div>
  );
};

export default Adminlogin;
