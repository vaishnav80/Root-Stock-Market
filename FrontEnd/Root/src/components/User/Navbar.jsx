import { Link } from 'react-router-dom';

const Navbar = () => {
  
  const menuItems = [
    { name: 'LIVE MARKET', path: '/' },
    { name: 'ANALYSIS', path: '/analysis' },
    { name: 'COMMUNITY', path: '/community' },
    { name: 'TUTORIAL', path: '/lesson' },
    { name: 'NEWS', path: '/news' },
    { name: 'PORTFOLIO', path: "/portfolio" },
  ];

  return (
    <div className="bg-black py-4 w-full">
  <div className="flex flex-wrap justify-center space-x-8 sm:space-x-4">
    {menuItems.map((item, index) => (
      <Link
        key={index}
        to={item.path}
        className={`px-6 py-2 text-white text-sm font-medium ${
          item.isActive
            ? 'border border-white rounded-full'
            : 'hover:text-gray-400'
        }`}
      >
        {item.name}
      </Link>
    ))}
  </div>
</div>

  );
};

export default Navbar;
