import React from 'react'
import Header from '../../components/User/Header'
import ChatApp from '../../components/User/chatCommunity'
import ChatInterface from '../../components/User/chatCommunity'

function Community() {
  return (
    <div className="flex flex-col min-h-screen">
  <Header />
  <div className="flex-1 overflow-auto">
    <ChatInterface />
  </div>
</div>

  )
}

export default Community