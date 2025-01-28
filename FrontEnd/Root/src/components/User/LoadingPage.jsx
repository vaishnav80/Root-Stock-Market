import React from 'react'

function LoadingPage() {
  return (
    <div className="flex items-center justify-center h-full bg-black ">
                      <img
                        src="/assets/1.png"
                        alt="Loading"
                        className="w-20 h-20 animate-bounce"
                      />
                    </div>
  )
}

export default LoadingPage