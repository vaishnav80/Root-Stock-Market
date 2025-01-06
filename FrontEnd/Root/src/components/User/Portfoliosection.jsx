import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { investment } from '../../actions/order';

const PortfolioSection = () => {
    const [investments,setInvestments] = useState([])
    const auth  = useSelector((select)=>select.auth)
    useEffect(()=>{
        async function fetchdata() {
            const response  = await investment(auth.token)
            setInvestments(response.data.order)
            
        }
        fetchdata()
    },[])
  
    const totalInvestment = investments.reduce((acc, i) => acc + Number(i.investment_value), 0);
  return (
    <div className=" p-6 bg-gray-900 h-full w-full shadow-xl text-gray-100">

      <div className="mb-6">
        <h2 className="text-2xl font-bold">Investments</h2>
      </div>    
      <div className="space-y-8">
        
        <div className="overflow-x-auto mt-5">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-800">
                <th className="p-3 text-left">Stock/Asset</th>
                <th className="p-3 text-left">Buy Price</th>
                <th className="p-3 text-left">Quantity</th>
                <th className="p-3 text-left">Current Price</th>
                <th className="p-3 text-left">Investment Value</th>
              </tr>
            </thead>
            <tbody>
              {investments.map((stock, index) => (
                  <tr key={index} className="border-b border-gray-700">
                  <td className="p-3">{stock.company}</td>
                  <td className="p-3">₹ {stock.price}</td>
                  <td className="p-3">{stock.quantity}</td>
                  <td className="p-3">
                    
                     800</td>
                  <td className="p-3">₹ {stock.investment_value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        
        <div className="text-xl">Total Value: ₹ {totalInvestment}</div>
        
        
        <div className="overflow-x-auto  rounded">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-800">
                <th className="p-3 text-left">Stock/Asset</th>
                <th className="p-3 text-left">Current Price</th>
                <th className="p-3 text-left">Quantity</th>
                <th className="p-3 text-left">Total Value</th>
              </tr>
            </thead>
            <tbody>
              {investments.map((stock, index) => (
                <tr key={index} className="border-b border-gray-700">
                  <td className="p-3">{stock.company}</td>
                  <td className="p-3">₹ 800</td>
                  <td className="p-3">{stock.quantity}</td>
                  <td className="p-3">₹{stock.quantity * 800}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="text-xl">Total Profit: ₹ 000</div>

        {/* Profit Table
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-800">
                <th className="p-3 text-left">Stock/Asset</th>
                <th className="p-3 text-left">Investment Value</th>
                <th className="p-3 text-left">Current Value</th>
                <th className="p-3 text-left">Profit (%)</th>
              </tr>
            </thead>
            <tbody>
              {stocksData.filter(stock => stock.profitLoss > 0).map((stock, index) => (
                <tr key={index} className="border-b border-gray-700">
                  <td className="p-3">{stock.symbol}</td>
                  <td className="p-3">₹{stock.investmentValue}</td>
                  <td className="p-3">₹{stock.currentValue}</td>
                  <td className="p-3 text-green-500">+{stock.profitLoss.toFixed(0)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Loss Table */}
        {/* <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-800">
                <th className="p-3 text-left">Stock/Asset</th>
                <th className="p-3 text-left">Investment Value</th>
                <th className="p-3 text-left">Current Value</th>
                <th className="p-3 text-left">Loss (%)</th>
              </tr>
            </thead>
            <tbody>
              {stocksData.filter(stock => stock.profitLoss < 0).map((stock, index) => (
                <tr key={index} className="border-b border-gray-700">
                  <td className="p-3">{stock.symbol}</td>
                  <td className="p-3">₹{stock.investmentValue}</td>
                  <td className="p-3">₹{stock.currentValue}</td>
                  <td className="p-3 text-red-500">{stock.profitLoss.toFixed(0)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> */} 
      </div>
    </div>
  );
};

export default PortfolioSection;