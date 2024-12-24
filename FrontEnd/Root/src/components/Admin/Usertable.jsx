import React, { useState } from 'react';
import { Edit, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const UsersTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample user data - expanded for full page
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1 (555) 123-4567' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+1 (555) 234-5678' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '+1 (555) 345-6789' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', phone: '+1 (555) 456-7890' },
    { id: 5, name: 'Alex Brown', email: 'alex@example.com', phone: '+1 (555) 567-8901' },
   
  ];

  const handleEdit = (id) => {
    console.log('Edit user:', id);
  };

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                Phone
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 bg-gray-800">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-700 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  #{user.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {user.phone}
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
    </div>
  );
};

export default UsersTable;