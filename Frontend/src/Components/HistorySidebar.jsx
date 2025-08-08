import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

export const HistorySidebar = ({  show }) => {
    
    const [history, sethistory] = useState([])

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get('http://localhost:3000/api/get-posts')
          sethistory(response.data) 
          
        } catch (error) {
          console.error('Error fetching data:', error)
        }
      }
  
      fetchData()
    }, [])


  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="fixed top-0 left-0 h-full w-72 bg-white p-4 overflow-y-auto z-10"
        >
          <h2 className="text-xl font-bold mb-4">History</h2>
          {history.length === 0 ? (
            <p className="text-gray-600">No generations yet.</p>
          ) : (
            <div className="space-y-4">
              {history.map((item, idx) => (
                <div key={idx} className="bg-gray-100 rounded p-2">
                  <img
                    src={item.postImage}
                    alt="Generated"
                    className="w-full rounded mb-2"
                  />
                  <p className="text-sm">{item.postCaption}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
