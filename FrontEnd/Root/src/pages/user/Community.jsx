import React from 'react'
import Header from '../../components/User/Header'
import ChatApp from '../../components/User/chatCommunity'
import ChatInterface from '../../components/User/chatCommunity'

function Community() {
  return (
    <div className="flex flex-col h-screen">
  <Header />
  <ChatInterface />
</div>

  )
}

export default Community