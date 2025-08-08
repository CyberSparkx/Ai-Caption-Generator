import React, { useState } from 'react'
import { AiInput } from './Components/AiInput'
import CenteredResult from './Components/CenteredResult'
import { HistorySidebar } from './Components/HistorySidebar'

const App = () => {
  const [history, setHistory] = useState([]) // { imageUrl, caption }
  const [showSidebar, setShowSidebar] = useState(false)

  const addToHistory = (newEntry) => {
    setHistory(prev => [newEntry, ...prev])
  }

  return (
    <div className="h-screen w-full bg-zinc-900 relative overflow-hidden flex">
      <button
        className="absolute  top-4 left-4 z-20 px-4 py-2 bg-zinc-300 font-semibold text-black rounded"
        onClick={() => setShowSidebar(!showSidebar)}
      >
        {showSidebar ? 'Close History' : 'Open History'}
      </button>

      <HistorySidebar history={history} show={showSidebar} />

      <div className="flex-1 flex justify-center items-end pb-10">
        <AiInput />
        <CenteredResult  />
      </div>
    </div>
  )
}

export default App
