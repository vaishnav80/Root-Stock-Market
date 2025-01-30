import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

const ChatWithAdmin = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const chatEndRef = useRef(null);
  const auth = useSelector((select) => select.auth);

  const ws = useRef(null);

  useEffect(() => {
    console.log(auth.id);

    ws.current = new WebSocket(`wss://api.rootstocks.site/ws/chat/?user_id=${auth.id}`);
    ws.current.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      console.log(newMessage,'newsssss');
      setMessages((prev) => {
        if (!prev.some((msg) => msg.timestamp === newMessage.timestamp && msg.content === newMessage.content)) {
          return [...prev, newMessage];
        }
        return prev;
      });
    };

    return () => ws.current.close();
  }, [auth.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        sender: auth.id,
        content: message.trim(),
        timestamp: new Date().toISOString(),
      };
  
      ws.current.send(JSON.stringify(newMessage));
      console.log(newMessage);
      
      setMessage('');
    }
  };
  console.log(messages);
  
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-200">
  {/* Header */}
  <div className="bg-gray-800 text-white text-lg sm:text-xl p-3 sm:p-4 border-b border-gray-700">
    Contact Us <p className="text-xs sm:text-sm">(share your concerns)</p>
  </div>

  {/* Messages Container */}
  <div className="flex-1 overflow-y-auto p-3 sm:p-4">
    {messages.map((msg, index) => (
      <div
        key={index}
        className={`flex ${
          msg.receiver === auth.id ? 'justify-start' : 'justify-end'
        } mb-3 sm:mb-4`}
      >
        <div
          className={`p-2 sm:p-3 rounded-lg text-xs sm:text-sm ${
            msg.receiver === auth.id
              ? 'bg-gray-800 text-gray-200' 
              : 'bg-gray-600 text-gray-100' 
          } max-w-xs sm:max-w-md md:max-w-lg`}
        >
          <p>{msg.message}</p>
          <span className="text-[10px] sm:text-xs text-gray-400">
            {msg && new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
          </span>
        </div>
      </div>
    ))}
    <div ref={chatEndRef}></div>
  </div>

  {/* Input Section */}
  <div className="p-3 sm:p-4 bg-gray-800 flex items-center border-t border-gray-700">
    <input
      type="text"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="Type your message"
      className="flex-1 p-2 sm:p-3 rounded-lg bg-gray-700 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm sm:text-base"
    />
    <button
      onClick={sendMessage}
      className="ml-3 sm:ml-4 px-3 sm:px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm sm:text-base"
    >
      Send
    </button>
  </div>
</div>

  );
};

export default ChatWithAdmin;
