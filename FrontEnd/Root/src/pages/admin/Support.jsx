import React, { useEffect, useState } from 'react';
import Adminsidebar from '../../components/Admin/Adminsidebar';
import ChatWithUser from '../../components/Admin/ChatContact';

import { useSelector } from 'react-redux';
import { getChatAdmin } from '../../actions/wallet';

function Support() {
  const auth = useSelector((select) => select.auth);
  const [contacts, setContacts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  
  useEffect(() => {
    async function fetchContacts() {
      const response = await getChatAdmin(auth.token)
      console.log(response.data.data);
      
      setContacts(response.data.data || []);
    }
    fetchContacts();
  }, [auth.token]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="flex bg-black text-white h-screen">
 
      <div className="w-1/4">
        <Adminsidebar />
      </div>

      <div className="w-3/4 flex">
       
        <div className="w-1/3 bg-gray-800 p-4 border-r border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Contact List</h2>
          <div className="space-y-2">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => handleSelectUser(contact)}
                className={`p-3 rounded-lg cursor-pointer ${
                  selectedUser?.id === contact.id
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-600 text-gray-300'
                } hover:bg-gray-700 hover:text-white`}
              >
                {contact.name}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Section */}
        <div className="w-2/3">
          {selectedUser ? (
            <ChatWithUser user={selectedUser}/>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">Select a contact to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Support;
