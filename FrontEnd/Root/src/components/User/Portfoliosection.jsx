import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { investment, sellOrder } from '../../actions/order';
import LoadingPage from './LoadingPage';
import { use } from 'react';


const PortfolioSection = () => {
    const [investments,setInvestments] = useState([])
    const [currentPrice,SetPrice] = useState({})
    const [load,setLoad] = useState(false)
    const auth  = useSelector((select)=>select.auth)
    const [sell,setSell] = useState(false)
    const [price,setPrice] = useState(0)
    const [company,setCompany] = useState('')
    const [quantity ,setQuantity] = useState(0)
    const [qty,setQty] = useState(0)
    const [error,setError] = useState("")
    useEffect(()=>{
      const userId = auth.email
      setLoad(false)
      const socket = new WebSocket(`wss://api.rootstocks.site/ws/Userdata/?user_id=${userId}`);
      
      socket.onmessage = function(event) {
        const data = JSON.parse(event.data);
    
        if (data.data) {
            console.log("Stock Prices:", data.data);
            SetPrice(data.data)
            setLoad(true)
            
        }
    
        if (data.error) {
            console.error("Error fetching stock prices:", data.error);
        }
    };
    socket.onerror = function(error) {
      console.error("WebSocket error:", error);
  };
        async function fetchdata() {
            const response  = await investment(auth.token)
            setInvestments(response.data.order) 
            
        }
        fetchdata()
    },[])
    
    const handleSell = async (company,price,qty)=>{
      console.log(qty,quantity);
      
      if(qty>quantity){
        
        setError('quantity exceeded than purchased')
      }
      else{
        const response = await sellOrder(auth.token,company,price,qty,)
        console.log(response);
        setSell(false)
      }
    }
    const totalInvestment = investments.reduce((acc, i) => acc + Number(i.investment_value), 0);
    const total = investments.reduce((acc,i)=>acc+Number(currentPrice[i.company] * i.quantity),0)
    console.log(total);
    const colorClass = (total-totalInvestment)>0 ? "text-green-400" : "text-red-600"
console.log(sell,'df');

return (
  <div className="bg-gray-900 h-full w-full text-gray-100">
    {load ? (
      <>
      
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Investments</h2>
         
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800">
                  <th className="p-3 text-left">Stock/Asset</th>
                  <th className="p-3 text-left">Buy Price</th>
                  <th className="p-3 text-left">Quantity</th>
                  <th className="p-3 text-left">Investment Value</th>
                </tr>
              </thead>
              <tbody>
                {investments.map((stock, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="p-3">{stock.company}</td>
                    <td className="p-3">₹{stock.price}</td>
                    <td className="p-3">{stock.quantity}</td>
                    <td className="p-3">₹ {stock.investment_value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="text-xl mt-2">Total Value: ₹ {totalInvestment.toFixed(2)}</div>
        
        
        <div className="overflow-x-auto  rounded">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-800">
                <th className="p-3 text-left">Stock/Asset</th>
                <th className="p-3 text-left">Current Price</th>
                <th className="p-3 text-left">Quantity</th>
                <th className="p-3 text-left">Total Value</th>
                <th className="p-3 text-left">Sell</th>
              </tr>
            </thead>
            <tbody>
              {investments.map((stock, index) => {
                const price = Number(currentPrice[stock.company]).toFixed(2)
                return (
                <tr key={index} className="border-b border-gray-700">
                  <td className="p-3">{stock.company}</td>
                  <td className="p-3">₹ {price}</td>
                  <td className="p-3">{stock.quantity}</td>
                  <td className="p-3">₹{Number(stock.quantity) * price}</td>
                  <td><button onClick={()=>{setCompany(stock.company);setPrice(price);setQuantity(stock.quantity);setSell(!sell)}}>sell</button></td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
        <div className='flex mt-3'>

        <div className="text-xl mr-3">Total Extimated Selling Price: ₹ {total.toFixed(2)}</div>
        
        <div className={` text-xl ${colorClass}`}>Total Profit: ₹ {(total-totalInvestment).toFixed(2)}</div>
        

      </div>

        {sell && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
           
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-gray-600 rounded-lg shadow-lg w-96 p-6">
              <h2 className="text-xl font-semibold text-black mb-4">Sell Stock</h2>
              <form>
                <div className="mb-4">
                  <label htmlFor="company" className="block text-sm font-medium ">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    className="mt-1 text-black block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Enter company name"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="price" className="block text-sm font-medium">
                    Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value))}
                    placeholder="Enter price"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="quantity" className="block text-sm font-medium">
                    Quantity
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    className="mt-1 text-black block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={qty}
                    onChange={(e) => setQty(parseInt(e.target.value))}
                    placeholder="Enter quantity"
                  />
                  {error?error:' '}
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setSell(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSell(company, price, qty)}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Sell
                  </button>
                </div>
              </form>
            </div>
          </div>


          </div>
        )}
      </>
    ) : (
      <div className="h-screen w-full">
        <LoadingPage />
      </div>
    )}
  </div>
);}


export default PortfolioSection;