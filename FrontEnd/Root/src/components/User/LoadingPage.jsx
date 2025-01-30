import React from 'react'

function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
  <img
    src="/assets/1.png"
    alt="Loading"
    className="w-16 h-16 sm:w-20 sm:h-20 animate-bounce"
  />
</div>
  )
}

export default LoadingPage