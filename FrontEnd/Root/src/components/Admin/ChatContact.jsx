import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

const ChatWithUser = ({user}) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const chatEndRef = useRef(null);
  const auth = useSelector((select) => select.auth);
  const [receiver,setReceiver] = useState(0)

  
  const ws = useRef(null);
  console.log(user,'user');
  
  useEffect(() => {
    console.log(auth.id);
    const a = user.participants[0] !== auth.id ? user.participants[0] : user.participants[1]
    console.log(a,'rec');
    setReceiver(a)
    setMessages([''])
    ws.current = new WebSocket(`ws://api.rootstocks.site/ws/chat/?user_id=${a}`);
    ws.current.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      console.log(newMessage,'new');
      
      setMessages((prev) => {
        if (!prev.some((msg) => msg.timestamp === newMessage.timestamp && msg.content === newMessage.content)) {
          return [...prev, newMessage];
        }
        return prev;
      });
    };

    return () => ws.current.close();
  }, [user.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
   
    if (message.trim()) {
      const newMessage = {
        sender: auth.id,
        content: message.trim(),
        timestamp: new Date().toISOString(), 
        receiver : receiver
      };
  
      ws.current.send(JSON.stringify(newMessage));
      setMessage('');
    }
  };

  
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-200">
   
      <div className="bg-gray-800 text-white text-xl p-4 border-b border-gray-700">
        Contact Us <p className="text-sm">(share your concerns)</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
      {messages.map((msg, index) => (
  <div
    key={index}
    className={`flex ${
      msg.receiver === auth.id ? 'justify-start' : 'justify-end' 
    } mb-4`}
  >
    <div
      className={`p-3 rounded-lg text-sm ${
        msg.receiver === auth.id
          ? 'bg-gray-700 text-gray-200' 
          : 'bg-gray-600 text-gray-100' 
      }`}
    >
      <p>{msg.message}</p>
      <span className="text-xs text-gray-400">
        {msg && new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
      </span>
    </div>
  </div>
))}

        <div ref={chatEndRef}></div>
      </div>

      <div className="p-4 bg-gray-800 flex items-center border-t border-gray-700">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
          className="flex-1 p-2 rounded-lg bg-gray-700 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <button
          onClick={sendMessage}
          className="ml-4 px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWithUser;
