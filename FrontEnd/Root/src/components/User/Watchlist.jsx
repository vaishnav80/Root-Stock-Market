import React, { useState } from "react";
import WatchList from "./WatchlistTable";
import { postWatchList } from "../../actions/Community";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

const WatchlistAdd = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const auth = useSelector((select)=>select.auth)
  const addCompany = async () => {
    if (companyName.trim() !== "") {
      const response = await postWatchList(auth.token,companyName)
      console.log(response);
      
      if(response.status == 400){
        toast.error(response.response.data.message)
      }
      setWatchlist([...watchlist, companyName.trim()]);
      setCompanyName("");
      setShowModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Company Watchlist</h1>

      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white font-semibold mb-6"
      >
        Add Company
      </button>

      <div className="w-full max-w-3xl">
        
          <WatchList/>
      
      </div>

     
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-200 mb-4">
              Add Company
            </h2>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter company name"
              className="w-full px-4 py-2 rounded bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-600 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={addCompany}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white font-semibold"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
      <Toaster
    position="top-center"
    reverseOrder={false}
  />
    </div>
  );
};

export default WatchlistAdd;
