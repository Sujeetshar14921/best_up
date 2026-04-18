import React, { useState, useEffect } from 'react'
import axios from 'axios'
import PhoneCard from '../PhoneCard'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const API_ROOT = API.replace(/\/api\/?$/, '')

export default function UpcomingPhonesSection() {
  const [upcomingPhones, setUpcomingPhones] = useState([])

  useEffect(() => {
    fetchUpcomingPhones()
  }, [])

  const fetchUpcomingPhones = async () => {
    try {
      const response = await axios.get(`${API}/phones?isUpcoming=true&limit=30`)
      setUpcomingPhones(response.data.data || [])
    } catch (err) {
      console.error('Failed to fetch upcoming phones:', err)
    }
  }

  if (!upcomingPhones.length) return null

  return (
    <section className="py-12 md:py-16 px-0 w-screen bg-white">
      <div className="px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
              Coming Soon
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">Upcoming Launches</h2>
          <p className="text-gray-600 text-lg">Exciting new phones on the horizon</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
          {upcomingPhones.map((phone) => (
            <div key={phone._id}>
              <PhoneCard phone={phone} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
