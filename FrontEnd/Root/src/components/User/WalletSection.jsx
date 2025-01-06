import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getTransaction, getWallet } from "../../actions/wallet";
import { useNavigate } from "react-router-dom";

const WalletSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
const auth = useSelector((state)=>state.auth)
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [wallet,setWallet] = useState(0);
  const [transaction,setTransaction] = useState([])
  const navigate = useNavigate()
  useEffect(()=>{
    async function fetchdata (){
        console.log(auth.token);
        const response = await getWallet(auth.token)
        setWallet(response.data.wallet)
        const transactonResponse = await getTransaction(auth.token)
        setTransaction(transactonResponse.data.transaction)
    }
    fetchdata()
  },[])
  console.log(wallet.balance,'df');
  
  return (
    <div className="p-6 bg-gray-900 h-full shadow-xl text-gray-100 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Wallet</h1>
      <div className="flex flex-col gap-4">

        <div className="flex justify-between items-center p-4 bg-gray-800 rounded-lg shadow-md">
          <span className="text-lg font-medium">Current Balance</span>
          <span className="text-xl font-semibold text-green-400">₹ {wallet.balance}</span>
        </div>

  
        <div className="p-4 bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-lg font-medium mb-2">Add Funds</h2>
          <div className="flex items-center gap-2">
           
            <button
              onClick={openModal}
              className="px-8 py-2 bg-green-500 rounded-md text-gray-900 font-medium hover:bg-green-400"
            >
              Add
            </button>
          </div>
        </div>

        <div className="p-4 bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-lg font-medium mb-4">Transaction History</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-700">Date</th>
                <th className="py-2 px-4 border-b border-gray-700">Description</th>
                <th className="py-2 px-4 border-b border-gray-700 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transaction.map((t,i)=>(
                 <tr>
                 <td className="py-2 px-4 border-b border-gray-700">{t.date}</td>
                 <td className="py-2 px-4 border-b border-gray-700">{t.description}</td>
                 <td className="py-2 px-4 border-b border-gray-700 text-right text-red-400">₹ {t.amount}</td>
               </tr>
              ))}
             
              
            </tbody>
          </table>
        </div>
      </div>

     
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-gray-100">
            <h2 className="text-xl font-bold mb-4">Add Money</h2>
            <p className="mb-6">
              You need to attend a quiz competition to gain the money. Please complete the quiz to proceed.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-red-500 rounded-md text-gray-100 font-medium hover:bg-red-400"
              >
                Cancel
              </button>
              <button
                onClick={()=>navigate('/quizcompetition')}
                className="px-4 py-2 bg-green-500 rounded-md text-gray-900 font-medium hover:bg-green-400"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletSection;
