import React, { useEffect, useState } from 'react';
import { getWatchList } from '../../actions/Community';
import { useSelector } from 'react-redux';

const WatchList = () => {
    const auth = useSelector((select)=>select.auth)
    const [watchList,setWatchlist] = useState([])

  useEffect(()=>{
    async function fetchdata() {
        const response = await getWatchList(auth.token)
        console.log(response,'watch');
        setWatchlist(response.data.data)
        
    }
    fetchdata()
  },[])
  return (
    <div className="bg-black">
  {watchList.length > 0 ? (
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
                stock.company.startsWith('-') ? 'text-red-500' : 'text-green-500'
              }`}
            >
              <td className="py-3 px-6 text-left">{stock.symbol}</td>
              <td className="py-3 px-6 text-left">{stock.company}</td>
              <td className="py-3 px-6 text-right">₹ 4080</td>
              <td className="py-3 px-6 text-right">0.03</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <h1 className="text-white">loading......</h1>
  )}
</div>

  );
};

export default WatchList;
