import React from 'react';

const WatchList = () => {
  const watchList = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 174.49, change: '+1.24%' },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 265.28, change: '-0.75%' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 135.32, change: '+0.98%' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 140.22, change: '+0.53%' },
  ];

  return (
    <div className=" bg-black">
      <h1 className="text-2xl font-bold text-center mb-4 text-white">
        Stock Watch List
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-black border border-gray-700 rounded-lg">
          <thead>
            <tr className="bg-gray-800 text-gray-300 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Symbol</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-right">Price</th>
              <th className="py-3 px-6 text-right">Change</th>
            </tr>
          </thead>
          <tbody className="text-gray-300 text-sm">
            {watchList.map((stock, index) => (
              <tr
                key={index}
                className={`border-b border-gray-700 hover:bg-gray-700 ${
                  stock.change.startsWith('-') ? 'text-red-500' : 'text-green-500'
                }`}
              >
                <td className="py-3 px-6 text-left">{stock.symbol}</td>
                <td className="py-3 px-6 text-left">{stock.name}</td>
                <td className="py-3 px-6 text-right">${stock.price.toFixed(2)}</td>
                <td className="py-3 px-6 text-right">{stock.change}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WatchList;
