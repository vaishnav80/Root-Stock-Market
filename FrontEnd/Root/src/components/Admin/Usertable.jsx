import React, { useEffect, useState } from 'react';
import { Edit, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { active, login } from '../../redux/authSlice';
import { userList } from '../../actions/user';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

const UsersTable = () => {
  const [search, setSearch] = useState('');
  const auth = useSelector((state)=>state.auth)
  const [users,setUser] =useState([])
  const [tempData,setTemp] = useState({})
  const [refresh,setRefresh] = useState(true)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect (()=>{
    async function collect(){
      const response = await userList(auth.token)
      console.log(response);
      console.log(response.data.user);
      setUser(response.data.user)
    }
    collect()
  },[refresh,navigate])
  const handleEdit = async (id) => {
    console.log('Edit user:', id);
      try {     
      const response = await axios.patch(`https://api.rootstocks/account/update/${id}/`, tempData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "multipart/form-data",
        },}
      )
      setRefresh(!refresh)
      console.log(response.data.active,'asdsdfdfsd');
      dispatch(active(response.data.active))
      toast.success(response.data.message);
      
    } catch (error) {
      console.log(error);
      
    }
  };
  const filteredUsers = users.filter(
    (user) =>
      user.first_name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      {/* Fixed Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="h-16 flex items-center justify-between px-6">
          <h1 className="text-2xl font-bold text-gray-100">Users Management</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 px-4 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
              
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 bg-gray-800">
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-700 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {user.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                  {user.first_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {user.is_active ?<p className='text-green-500'>Active</p>  :<p className='text-red-600'> Deactive</p>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right">
                  <button
                    onClick={() => handleEdit(user.id)}
                    className="p-1 hover:bg-gray-600 rounded-md transition-colors"
                  >
                    <Edit size={16} className="text-gray-300 hover:text-gray-100" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-800 border-t border-gray-700">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Showing 1 to 10 of 10 entries
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
              <ChevronLeft size={16} />
              Previous
            </button>
            <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
      <Toaster
  position="top-center"
  reverseOrder={false}
/>
    </div>
  );
};

export default UsersTable;