import React from 'react';

const Header = () => {
  return (
    <div className="flex justify-between mb-6">
      <div className="bg-gray-800 text-white p-4 rounded-md flex flex-col items-center">
        <div className="text-lg">NIFTY</div>
        <div className="text-green-500 text-xl font-semibold">+0.78%</div>
        <div className="text-green-400 text-sm">+12.70 (+0.64%)</div>
      </div>
      <div className="bg-gray-800 text-white p-4 rounded-md flex flex-col items-center">
        <div className="text-lg">SENSEX</div>
        <div className="text-green-500 text-xl font-semibold">+0.78%</div>
        <div className="text-green-400 text-sm">+12.70 (+0.64%)</div>
      </div>
    </div>
  );
};

const StockItem = ({ name, price, change }) => {
  const isNegative = change.startsWith('-');
  return (
    <div className="bg-gray-800 text-white p-4 rounded-md flex justify-between items-center">
      <div className="flex flex-col">
        <div className="text-lg font-medium">{name}</div>
        <div className="text-gray-400 text-sm">NSE EQ</div>
      </div>
      <div className="text-right">
        <div className="text-xl font-semibold">{price}</div>
        <div className={`text-sm ${isNegative ? 'text-red-500' : 'text-green-400'}`}>{change}</div>
      </div>
    </div>
  );
};

const StockApp = () => {
  const stocks = [
    { name: 'INFY', price: '1,999.70', change: '+12.70 (+0.64%)' },
    { name: 'INFY', price: '1,999.70', change: '-12.70 (-0.64%)' },
    { name: 'INFY', price: '1,999.70', change: '+12.70 (+0.64%)' },
    { name: 'INFY', price: '1,999.70', change: '-12.70 (-0.64%)' },
    { name: 'INFY', price: '1,999.70', change: '+12.70 (+0.64%)' },
    { name: 'INFY', price: '1,999.70', change: '-12.70 (-0.64%)' },
    { name: 'INFY', price: '1,999.70', change: '+12.70 (+0.64%)' },
    { name: 'INFY', price: '1,999.70', change: '-12.70 (-0.64%)' },
    { name: 'INFY', price: '1,999.70', change: '-12.70 (-0.64%)' },
  ];

  return (
    <div className="bg-black min-h-screen p-6">
      <Header />
      <div className="space-y-4">
        {stocks.map((stock, index) => (
          <StockItem
            key={index}
            name={stock.name}
            price={stock.price}
            change={stock.change}
          />
        ))}
      </div>
    </div>
  );
};

export default StockApp;
