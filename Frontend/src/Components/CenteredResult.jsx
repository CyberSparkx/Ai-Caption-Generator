import React, { useEffect, useState } from 'react'
import axios from 'axios'

const CenteredResult = () => {
  const [result, setResult] = useState(null)

  useEffect(() => {
    const fetchLatestPost = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/get-posts')

        if (res.data && res.data.length > 0) {
          // Sort by createdAt (newest first)
          const sorted = res.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
          setResult(sorted[0]) // take the newest post
        }
      } catch (err) {
        console.error('Error fetching latest post:', err)
      }
    }

    fetchLatestPost()
  }, [])

  if (!result) return null // or show a loading spinner

  return (
    <div className="absolute inset-0   flex flex-col items-center mt-20 text-center p-4">
      <div className="p-6 lg:w-[40vw] md:w-[50] w-[90vw] h-[40vh] md:h-[60vh] lg:h-[50vh] overflow-auto">
        <img
          src={result.postImage}
          alt="Generated"
          className="w-full h-[75%] object-cover rounded mb-4"
        />
        <p className="text-white text-medium md:text-lg font-medium">{result.postCaption}</p>
      </div>
    </div>
  )
}

export default CenteredResult
