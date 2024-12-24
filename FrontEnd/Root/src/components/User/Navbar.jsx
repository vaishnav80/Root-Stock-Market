import React from 'react';

const Navbar = () => {
  const menuItems = [
    { name: 'LIVE MARKET', isActive: true },
    { name: 'ANALYSIS', isActive: false },
    { name: 'COMMUNITY', isActive: false },
    { name: 'TUTORIAL', isActive: false },
    { name: 'NEWS', isActive: false },
    { name: 'PORTFOLIO', isActive: false },
  ];

  return (
    <div className="bg-black py-4">
      <div className="flex justify-center space-x-8">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`px-6 py-2 text-white text-sm font-medium ${
              item.isActive
                ? 'border border-white rounded-full'
                : 'hover:text-gray-400'
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
