import React, { useState, useEffect, useContext } from 'react';
import { Line } from 'react-chartjs-2';
import { FallingLines } from 'react-loader-spinner'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { context } from '../../pages/user/Dashboard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const RealTimeGraph = () => {
  const [prices, setPrices] = useState([]);
  const [timestamps, setTimestamps] = useState([]);
  const [socket, setSocket] = useState(null);
  const [currentStock, setCurrentStock] = useState({ ticker: 'TATAMOTORS', exchange: 'NSE' });
  const [inputStock, setInputStock] = useState({ ticker: 'TATAMOTORS', exchange: 'NSE' });
  const [status, setStatus] = useState('');
  const { tick, setTick,setBuyingPrice,setCompany } = useContext(context);
  const [load,setLoad] = useState(false)
  useEffect(() => {
    const ws = new WebSocket('ws://127.0.0.1:8000/ws/stock/');
    
    ws.onopen = () => {
      setStatus('Connected');
      setSocket(ws);
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.price) {
        setPrices((prevPrices) => [...prevPrices.slice(-50), data.price]);
        setCompany(data.ticker)
        setBuyingPrice(data.price)
        setTimestamps((prevTimestamps) => [
          ...prevTimestamps.slice(-50),
          new Date().toLocaleTimeString(),
        ]);
        setStatus(`Fetching ${data.ticker}:${data.exchange}`);
        setLoad(true)
      } else if (data.error) {
        setStatus(`Error: ${data.error}`);
      } else if (data.message) {
        setStatus(data.message);
      }
    };

    ws.onerror = (error) => {
      setStatus(`Error: ${error.message}`);
    };

    ws.onclose = () => {
      setStatus('Disconnected');
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (socket?.readyState === WebSocket.OPEN) {
      setPrices([]);
      setTimestamps([]);
      setCurrentStock(inputStock);
      socket.send(JSON.stringify({
        ticker: inputStock.ticker,
        exchange: inputStock.exchange
      }));
    } else {
      setStatus('WebSocket is not connected');
    }
  };

  const stepSize = Math.ceil((Math.max(...prices) - Math.min(...prices)) / 10) || 5;

  useEffect(()=>{
    setInputStock(prev => ({ ...prev, ticker: tick }))
    handleSubmit
  },[tick])
  const data = {
    labels: timestamps,
    datasets: [
      {
        label: `${currentStock.ticker}:${currentStock.exchange} Stock Price`,
        data: prices,
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        pointBorderColor: '#fff',
        pointRadius: 5,
        tension: 0.3, 
      },
    ],
  };



  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
          },
          color: '#333',
        },
      },
      title: {
        display: true,
        text: `Real-Time Stock Price: ${currentStock.ticker}: ${prices[prices.length-1]}`,
        font: {
          size: 20,
        },
        color: '#ffffff',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          stepSize: stepSize,
          color: '#555151',
          font: {
            size: 12,
          },
        },
        grid: {
          color: '#e0e0e0',
        },
      },
      x: {
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
          color: '#666',
          font: {
            size: 12,
          },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <form onSubmit={handleSubmit} className="flex gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700">Ticker</label>
            <input
              type="text"
              value={inputStock.ticker}
              onChange={(e) => setInputStock(prev => ({ ...prev, ticker: e.target.value.toUpperCase() }))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="TATAMOTORS"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Exchange</label>
            <input
              type="text"
              value={inputStock.exchange}
              onChange={(e) => setInputStock(prev => ({ ...prev, exchange: e.target.value.toUpperCase() }))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="NSE"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Update Stock
          </button>
        </form>
      </div>
      
      <div className="text-sm text-gray-600 mb-4">
        Status: {status}
      </div>
      
      <div className="h-[400px]">
      {load ? (
        <Line data={data} options={options} />
      ) : (
        <div className="flex justify-center items-center h-[400px]">
   <div className="flex items-center justify-center ">
     
      <img
        src="src/assets/1.png"
        alt="Loading"
        className="w-20 h-20 animate-bounce"
      />
    </div>
</div>
      )}
    </div>
    </div>
  );
};

export default RealTimeGraph;
