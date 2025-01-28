import React, { createContext, useEffect, useState } from "react";
import Header from "../../components/User/Header";
import Sidebar from "../../components/User/Sidebar";
import Navbar from "../../components/User/Navbar";
import StockChart from "../../components/User/StockChart";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import CompanyGraph from "../../components/User/CompanyGraph";
import Footer from "../../components/User/Footer";
import Watchlist from "../../components/User/Watchlist";
import { useSelector } from "react-redux";
import { order } from "../../actions/order";
import { Navigate, useNavigate } from "react-router-dom";
import { getWallet } from "../../actions/wallet";
import LoadingPage from "../../components/User/LoadingPage";
import WatchList from "../../components/User/WatchlistTable";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const context = createContext();

const Dashboard = () => {
  const auth = useSelector((state) => state.auth);
  const [tick, setTick] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [quantity,setQuantity] = useState(0)
  const [company,setCompany] = useState('')
  const [buyingPrice,setBuyingPrice] = useState(0)
  const [wallet,setWallet] = useState(null)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  console.log(tick, "tick");
  console.log(company,buyingPrice);
  
  const toggleModal =async () => {
    setIsModalOpen(!isModalOpen);
    
  };
  const handleOrder=async(e)=>{
    
    e.preventDefault()
    setLoading(true);
    console.log(auth.token,company,buyingPrice,quantity,'dashboard');
    
    const response = await order(auth.token,company,buyingPrice,quantity)
    console.log(response);
    if(response.status ==201){
      setLoading(false)
      navigate('/portfolio')
    }
    
  }
  useEffect(()=>{
    async function fetchdata(){
      const response =await getWallet(auth.token)
      setWallet(response.data.wallet.balance)
    }
    fetchdata()
  },[])
  
  return (
    <context.Provider value={{ setTick, tick,setBuyingPrice,setCompany }}>
      {!loading?(
      <div className="bg-black">
        <Header className="mt-96" />
        <div className="flex">
          <div className="w-96 mt-2">
            <Sidebar />
          </div>
          <div className="mx-12 mt-4 flex-grow">
            
            <StockChart />

            <div className="flex justify-center mt-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={toggleModal}
              >
                Try Papper Trading
              </button>
            </div>

    
            {isModalOpen && wallet !== null && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-gray-800 p-6 rounded shadow-lg w-1/3 text-white">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">{company}</h2>
                    <button
                      onClick={toggleModal}
                      className="text-gray-400 hover:text-white"
                    >
                      &times;
                    </button>
                  </div>
                  <div className="text-sm text-gray-400 mb-4">
                    <div className="flex justify-between">
                      <span>₹ {buyingPrice} NSE</span>
                      <span>-6.45 (-0.32%)</span>
                    </div>
                    {/* <div className="flex justify-between">
                      <span>1,992.45 BSE</span>
                      <span></span>
                    </div> */}
                  </div>
                  <form onSubmit={handleOrder}>
                    <div className="mb-4">
                      <label className="block text-gray-300 font-medium mb-1">
                        Order Type
                      </label>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          className="flex-1 bg-gray-700 px-4 py-2 rounded text-center hover:bg-gray-600"
                        >
                          Delivery (long term)
                        </button>
                        <button
                          type="button"
                          className="flex-1 bg-gray-700 px-4 py-2 rounded text-center hover:bg-gray-600"
                        >
                          Intraday (same day)
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between mb-4">
                      <div className="w-1/2 pr-2">
                        <label
                          htmlFor="quantity"
                          className="block text-gray-300 font-medium mb-1"
                        >
                          Quantity
                        </label>
                        <div className="flex items-center border border-gray-700 rounded px-2">
                          
                          <input
                            type="number"
                            id="quantity"
                            className="bg-transparent text-white w-full text-center"
                            value={quantity}
                            onChange={(e)=>setQuantity(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="w-1/2 pl-2">
                        <label
                          htmlFor="price"
                          className="block text-gray-300 font-medium mb-1"
                        >
                          Price
                        </label>
                        <input
                          type="text"
                          id="price"
                          className="bg-gray-700 text-white w-full px-2 py-1 rounded"
                          value="Market"
                          readOnly
                        />
                      </div>
                    
                    </div>
                    
                    <div className="flex justify-between text-gray-400 text-sm mb-4">
                      <span>Required:₹  {buyingPrice * quantity} </span>
                      <span>Available:₹  {wallet}</span>
                    </div>
                    {buyingPrice * quantity > wallet ? (
                      <p className="text-red-500">Insufficient Balance</p>
                    ) : (
                      <button
                        type="submit"
                        className="w-full bg-green-500 px-4 py-2 rounded text-center hover:bg-green-600"
                      >
                        Invest
                      </button>
                    )}
                  </form>
                </div>
              </div>
            )}
            
            
                   
            <div className="flex space-x-4">
            <div className="w-1/2 mt-14">
              <h1 className="text-white text-2xl font-semibold text-center mb-4">
                Watchlist
              </h1>
              <WatchList />
            </div>
              <div className="w-1/2">
                <div className="p-4 rounded-lg shadow-lg h-[400px]">
                  <CompanyGraph />
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
      ):
      (
        <div className="bg-black w-screen h-screen">
        <LoadingPage />
      </div>
          )}
    </context.Provider>
  );
};

export default Dashboard;
