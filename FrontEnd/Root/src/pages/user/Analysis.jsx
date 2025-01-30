import React from 'react'
import Header from '../../components/User/Header'
import StockAnalysis from '../../components/User/AnalysisComponent'

function Analysis() {
  return (
    <div className="bg-black min-h-screen flex flex-col">
  <Header />
  <div className="flex-1 overflow-x-auto">
    <StockAnalysis />
  </div>
</div>

  )
}

export default Analysis