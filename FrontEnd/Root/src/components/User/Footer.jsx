import React from 'react';

const Footer = () => {
  return (
    <div className="flex space-x-10 p-2 text-white h-32  mx-8 bg-black">
      {/* User Profile Card */}
      <div className="bg-gradient-to-r from-green-400 to-blue-500 p-2 rounded-lg flex flex-col items-center h-28 w-1/3">
        <div className="w-16 h-16 bg-gray-300 rounded-full mb-4"></div>
        <h2 className="text-lg font-bold">ABDULLAH ALTHAF</h2>
        <p className="text-sm">Beginner</p>
        <p className="text-green-300 font-semibold">PROFITABLE</p>
      </div>

      {/* Stock Market Update Card */}
      <div className="bg-gradient-to-r from-green-400 to-blue-500 p-4 h-28 rounded-lg flex flex-col w-1/3">
        <div className="flex items-center mb-4">
          <img src="path/to/stock-market-image.jpg" alt="Stock Market" className="w-12 h-12 mr-4" />
          <h2 className="text-lg font-bold">Stock market today: Nifty 50, Sensex ...</h2>
        </div>
        <button className='mr-1'>Explore More</button>
      </div>

      {/* Learning Community Card */}
      <div className="bg-gradient-to-r from-green-400 to-blue-500 p-2 rounded-lg flex flex-col w-1/3">
        <div className="flex items-center ">
          {/* <img src="path/to/learning-community-image.jpg" alt="Learning Community" className="w-12 h-10 mr-4" /> */}
          <h2 className="text-lg font-bold">Learning community</h2>
        </div>
          <p>Hai</p>
        
        <div className="flex items-center">
          <input type="text" placeholder="Type here" className="flex-grow p-2 rounded-l bg-gray-800 text-white" />
          <button className="bg-blue-500 text-white px-4  rounded-r">→</button>
        </div>
      </div>
    </div>
  );
};

export default Footer;
