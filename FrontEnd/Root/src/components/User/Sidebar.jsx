import React, { useEffect, useState, useContext } from 'react';
import { context } from '../../pages/user/Dashboard';
import { FallingLines } from 'react-loader-spinner'
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
  const { setTick } = useContext(context);
  console.log(change);
  
  const changeColor = change > 0 ? 'text-green-500' : change < 0 ? 'text-red-500' : 'text-gray-400';

  return (
    <div
      className="bg-gray-800 text-white p-4 rounded-md flex justify-between items-center"
      onClick={() => setTick(name)}
    >
      <div className="flex flex-col">
        <div className="text-lg font-medium">{name}</div>
        <div className="text-gray-400 text-sm">NSE EQ</div>
      </div>
      <div className="text-right">
        <div className="text-xl font-semibold">₹ {price}</div>
        <div className={`text-sm ${changeColor}`}>
          {change > 0 ? '+' : ''}{change}%
        </div>
      </div>
    </div>
  );
};

const StockApp = () => {
  const [stockData, setStockData] = useState({});
  const [prevStockData, setPrevStockData] = useState({}); 
  const [error, setError] = useState(null);
  const { setTick } = useContext(context);
  const [loading,setLoading] = useState(false)

  useEffect(() => {
    const socket = new WebSocket('wss://api.rootstocks.site/ws/data/');

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.error) {
          setError(message.error);
        } else if (message.data) {
          console.log(stockData,'stock');
          setPrevStockData((prev) => ({ ...prev, ...stockData }));
          setStockData(message.data);
          setLoading(true)
        }
      } catch (e) {
        console.error('Error parsing WebSocket message:', e);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('WebSocket error occurred');
    };

    return () => {
      socket.close();
    };
  }, [stockData]);

  const calculateChange = (ticker) => {
    const prevPrice = prevStockData[ticker];
    const currentPrice = stockData[ticker];
    console.log(prevPrice,currentPrice,'GDFGF');
    
    if (prevPrice && currentPrice) {
      return (((currentPrice - prevPrice) / prevPrice) * 100).toFixed(2);
    }
    return 0;
  };

  return (
    <div className="bg-black min-h-screen p-6">
      <Header />
      <div className="space-y-4">
        {loading? Object.keys(stockData).map((ticker) => (
          <StockItem
            key={ticker}
            name={ticker}
            price={stockData[ticker]}
            change={calculateChange(ticker)}
          />
        )):<div className=" flex justify-center items-center h-[400px]">
        <div className="flex items-center justify-center ">
     
     <img
       src="src/assets/1.png"
       alt="Loading"
       className="w-20 h-20 animate-bounce"
     />
   </div>
      </div>}
      </div>
    </div>
  );
};

export default StockApp;
