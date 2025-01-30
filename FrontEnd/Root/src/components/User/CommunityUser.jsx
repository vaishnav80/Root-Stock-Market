import React, { useEffect, useState } from 'react';
import { 
  Search, 
  X, 
  Users,
  UserPlus,
  Check
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { getChatUser } from '../../actions/Community';

const UserSelectModal = ({ isOpen, onClose, onUserSelect }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isGroup, setIsGroup] = useState(false);
    const [groupName, setGroupName] = useState('');
    const auth = useSelector((select)=>select.auth)
    const [user,setUSer] = useState([])
    
  useEffect(()=>{
    async function fetchData() {
        const response = await getChatUser(auth.token)
        console.log(response);
        if(response.status ==200){
            setUSer(response.data.user)
        }
        
    }
    fetchData()
  },[])
  console.log(user,'us');
  
  const filteredUsers = user.filter(user => 
    user.first_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleUserSelection = (user) => {
    if (selectedUsers.find(u => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleCreateChat = () => {
    console.log(selectedUsers);
    
    onUserSelect({
      users: selectedUsers,
      isGroup,
      groupName: isGroup ? groupName : ''
    });
    onClose();
  };

  return (
    <div 
  className={`fixed inset-y-0 left-0 w-80 max-w-full bg-gray-900 transform transition-transform duration-300 ease-in-out ${
    isOpen ? 'translate-x-0' : '-translate-x-full'
  } shadow-lg z-50 md:w-64 lg:w-72 xl:w-80`}
>
  <div className="flex flex-col h-full">
    <div className="p-4 border-b border-gray-800">
      <div className="flex justify-between items-center">
        <h2 className="text-lg sm:text-xl font-semibold text-white">New Chat</h2>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-800 rounded-full"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </div>

    <div className="p-4 border-b border-gray-800">
      <label className="flex items-center space-x-2 text-sm sm:text-base">
        <input
          type="checkbox"
          checked={isGroup}
          onChange={(e) => setIsGroup(e.target.checked)}
          className="form-checkbox text-blue-500"
        />
        <span className="text-white">Create Group Chat</span>
      </label>
      {isGroup && (
        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="mt-2 w-full bg-gray-800 text-white px-3 py-2 rounded-lg text-sm sm:text-base"
        />
      )}
    </div>

    <div className="p-4">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg text-sm sm:text-base"
        />
      </div>
    </div>

    <div className="flex-1 overflow-y-auto">
      {filteredUsers.map(user => (
        <div
          key={user.id}
          onClick={() => toggleUserSelection(user)}
          className="flex items-center p-3 sm:p-4 hover:bg-gray-800 cursor-pointer"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-700 rounded-full flex items-center justify-center text-sm sm:text-base">
            {user.first_name[0]}
          </div>
          <div className="ml-3 flex-1">
            <div className="text-white font-medium text-sm sm:text-base">{user.first_name}</div>
            <div className="text-xs sm:text-sm text-gray-400">{user.status}</div>
          </div>
          {selectedUsers.find(u => u.id === user.id) && (
            <Check className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
          )}
        </div>
      ))}
    </div>

    <div className="p-4 border-t border-gray-800">
      <button
        onClick={handleCreateChat}
        disabled={selectedUsers.length === 0 || (isGroup && !groupName) || (selectedUsers.length>1 && !isGroup)}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
      >
        {isGroup ? 'Create Group' : 'Start Chat'}
      </button>
    </div>
  </div>
</div>

  );
};

export default UserSelectModal;