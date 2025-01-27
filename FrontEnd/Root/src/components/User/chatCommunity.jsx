import React, { useEffect, useRef, useState } from 'react';
import { 
  Search, Plus, Send, Paperclip, Video, Image as ImageIcon,
  File, Smile, MoreVertical, Phone,Check
} from 'lucide-react';
import CallInterface from './callComponent';
import UserSelectModal from './CommunityUser';
import { useSelector } from 'react-redux';
import { getChat, postChat } from '../../actions/Community';

const ChatInterface = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isUserSelectOpen, setIsUserSelectOpen] = useState(false);
  const [activeCall, setActiveCall] = useState(null);
  const auth = useSelector((select) => select.auth);
  const [chats, setChats] = useState([]);
  const [state, setState] = useState(false);
  const [messageStatuses, setMessageStatuses] = useState({});
  const [selected, setSelected] = useState(null);
  const messagesEndRef = useRef(null);
  const ws = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    ws.current = new WebSocket(`ws://api.rootstocks.site/ws/community/?user_id=${auth.id}`);

    ws.current.onopen = () => {
      console.log('WebSocket connected');
      ws.current.send(JSON.stringify({
        type: 'fetch_chats'
      }));
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received websocket data:', data);
      
      if (data.type === 'message') {
        setMessages(prev => [...prev, data]);
        if (data.sender_id !== auth.id) {
          ws.current.send(JSON.stringify({
            type: 'status_update',
            message_id: data.id,
            status_type: 'delivered'
          }));
        }
        scrollToBottom();
      }else if (data.type === 'status_update') {
        setMessageStatuses(prev => ({
          ...prev,
          [data.message_id]: {
            ...prev[data.message_id],
            [data.status_type]: true,
            [`${data.status_type}_by`]: [...(prev[data.message_id]?.[`${data.status_type}_by`] || []), data.user_id]
          }
        }));
      }if (data.type === 'incoming_call') {
        console.log('incoming......');
        
        setActiveCall({
          type: data.call_type,
          remoteUser: {
            ...selected,
            call_id: data.call_id,
            caller_id: data.caller_id,
            offer: data.offer
          }
        });
      }
      
      else if (data.type === 'chat_list') {
        setChats(data.chats);
      } else if (data.type === 'chat_history') {
        if (data.chat_id === selected?.id) {
          setMessages(data.messages || []);
          scrollToBottom();
        }
      }
    }
    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [auth.id,state]);


  useEffect(() => {
    if (selected && ws.current) {
      // Fetch messages when chat is selected
      ws.current.send(JSON.stringify({
        type: 'fetch_messages',
        chat_id: selected.id
      }));
    }
  }, [selected]);

  useEffect(() => {
    if (selected && messages.length > 0) {
      const unreadMessages = messages.filter(
        msg => msg.sender_id !== auth.id && 
        (!messageStatuses[msg.id]?.read_by?.includes(auth.id))
      );

      unreadMessages.forEach(msg => {
        ws.current?.send(JSON.stringify({
          type: 'status_update',
          message_id: msg.id,
          status_type: 'read',
          chat_id :selected.id
        }));
      });
    }
  }, [selected, messages, messageStatuses, auth.id]);

  const getMessageStatus = (message) => {
    if (message.sender_id === auth.id) {
      const status = messageStatuses[message.id] || {};
      if (status.read_by?.length > 0) {
        return 'read';
      } else if (status.delivered_by?.length > 0) {
        return 'delivered';
      }
      return 'sent';
    }
    return null;
  };

  const MessageStatus = ({ status }) => {
    switch (status) {
      case 'sent':
        return <Check className="w-4 h-4 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-4 h-4 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-4 h-4 text-blue-400" />;
      default:
        return null;
    }
  };
  
  const handleSend = () => {
    if (message.trim() && selected) {
      const messageData = {
        type: 'message',
        chat_id: selected.id,
        content: message
      };

      ws.current.send(JSON.stringify(messageData));
      setMessage('');
    }
  };

  const handleChatSelect = (chat) => {
    setSelected(chat);
    setMessages([]);
  };
  const handleStartCall = (type) => {
    setActiveCall({
      type: type, 
      remoteUser: selected
    });
  };
  const handleUserSelect = async ({ users, isGroup, groupName }) => {
    console.log(state);
    
    const responsse = await postChat(auth.token,{'users':users,"group":isGroup,"name" :groupName})
    setState(!state)
  };
  console.log(selected,'seelected');
  console.log(messages,'messagee');
  
  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
     
      <div className="w-80 border-r border-gray-800 flex flex-col">
      
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h1 className="text-xl font-bold">Chats</h1>
          <button onClick={() => setIsUserSelectOpen(true)}>
        <Plus className="w-5 h-5" />
      </button>
        </div>

        <div className="p-4">
          <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search chats..."
              className="bg-transparent border-none focus:outline-none ml-2 w-full text-gray-100"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
        {chats.map((chat, index) => (
          <div
            key={chat.id}
            className={`flex items-center p-4 hover:bg-gray-800 cursor-pointer ${
              selected?.id === chat.id ? 'bg-gray-800' : ''
            }`}
            onClick={() => handleChatSelect(chat)}
          >
            <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
              {chat.is_group == true ? chat.name[0] : chat.members[0].user_id !== auth.id ? chat.members[0].name[0] :chat.members[1].name[0] }
            </div>
            <div className="ml-3 flex-1">
              <div className="font-semibold">{chat.is_group == true ? chat.name : chat.members[0].user_id !== auth.id ? chat.members[0].name :chat.members[1].name}</div>
              {chat.last_message && (
                <div className="text-sm text-gray-400">
                  {chat.last_message}
                  {chat.last_message_time && (
                    <span className="text-xs ml-2">
                      {new Date(chat.last_message_time).toLocaleTimeString()}
                    </span>
                  )}
                </div>
              )}
            </div>
            {chat.members.some(member => member.is_online) && (
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            )}
          </div>
        ))}
        </div>
      </div>

      
    {selected && (
      <div className="flex-1 flex flex-col">

        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
              {selected.is_group == true ? selected.name[0] : selected.members[0].user_id !== auth.id ? selected.members[0].name[0] :selected.members[1].name[0] }
            </div>
                      <div className="ml-3">
            <div className="font-semibold">
              {selected.is_group
                ? selected.name 
                : selected.members[0].user_id !== auth.id
                ? selected.members[0].name 
                : selected.members[1].name}
            </div>

            <div className="text-sm text-gray-400">
              {selected.is_group ? (
                selected.members.map((member, index) => (
                  <span key={index}>
                    {member.name}
                    {index !== selected.members.length - 1 && ", "}
                  </span>
                ))
              ) : selected.is_active ? (
                "online"
              ) : (
                "offline"
              )}
            </div>
          </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-800 rounded-full" onClick={()=>{handleStartCall('audio')}}>
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-800 rounded-full" onClick={()=>{handleStartCall('video')}}>
              <Video className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-800 rounded-full">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

     
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className="flex flex-col">
            <div
              className={`rounded-lg p-3 max-w-md ${
                msg.sender_name === auth.name
                  ? 'bg-gray-700 self-end'
                  : 'bg-gray-800 self-start'
              }`}
            >
              {msg.sender_name !== auth.name && (
                <div className="text-sm text-gray-400 mb-1">
                  {selected.is_group == true ? msg.sender_name :"" }
                </div>
              )}
              <div className="flex items-end gap-2">
                <p>{msg.content}</p>
                <MessageStatus status={getMessageStatus(msg)} />
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

        <div className="p-4 border-t border-gray-800">
            <div className="flex items-center bg-gray-800 rounded-lg px-4 py-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 bg-transparent border-none focus:outline-none mx-2 text-gray-100"
              />
              <div className="flex items-center space-x-2">
                <button
                  className="p-2 hover:bg-gray-700 rounded-full"
                  onClick={handleSend}
                >
                  <Send className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
    )}
      {activeCall && (
        <CallInterface
          callType={activeCall.type}
          remoteUser={activeCall.remoteUser}
          onEndCall={() => setActiveCall(null)}
          ws = {ws}
        />
      )}
      <UserSelectModal
        isOpen={isUserSelectOpen}
        onClose={() => setIsUserSelectOpen(false)}
        onUserSelect={handleUserSelect}
      />
    </div>
  );
};

export default ChatInterface;