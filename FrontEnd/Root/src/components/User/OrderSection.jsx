import React, { useEffect, useState } from 'react';
import { getorder } from '../../actions/order';
import { useSelector } from 'react-redux';

const OrderSection = () => {
    const auth  = useSelector((select)=>select.auth)
    const [order,setOrder] = useState([])
  
  useEffect (()=>{
    async function fetchdata(){
        const response = await getorder(auth.token)
        console.log(response,'sdfsd');
        setOrder(response.data.order)

    }
    fetchdata()
  },[])


  return (
    <div className="p-6 bg-gray-900 h-full w-full shadow-xl text-gray-100">
  <div className="mb-6">
    <h2 className="text-2xl font-bold">Orders</h2>
  </div>

  <div className="space-y-8">
    <div className="overflow-x-auto mt-5">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-800">
            <th className="p-3 text-left">Stock/Asset</th>
            <th className="p-3 text-left">Quantity</th>
            <th className="p-3 text-left">Price</th>
            <th className="p-3 text-left">Total Amount</th>
            <th className="p-3 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {order.map((stock, index) => (
            <tr key={index} className="border-b border-gray-700">
              <td className="p-3">{stock.company}</td>
              <td className="p-3">{stock.quantity}</td>
              <td className="p-3">₹{stock.price}</td>
              <td className="p-3">₹{stock.totalAmount}</td>
              <td className="p-3">{stock.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    {/* <div className="text-xl ">Total Profit: ₹45</div> */}
  </div>
</div>

  );
};

export default OrderSection;