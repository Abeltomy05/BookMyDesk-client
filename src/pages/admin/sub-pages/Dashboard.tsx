// Dashboard.tsx - Your main dashboard component
import React, { useState, useEffect } from "react"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { motion } from "framer-motion"
import { Users, ShoppingBag, Briefcase } from "react-feather"
import { adminService } from "@/services/adminService"

const chartData = [
  { name: "Jan", bookings: 65, revenue: 4000 },
  { name: "Feb", bookings: 59, revenue: 3800 },
  { name: "Mar", bookings: 80, revenue: 5200 },
  { name: "Apr", bookings: 81, revenue: 5100 },
  { name: "May", bookings: 56, revenue: 3600 },
  { name: "Jun", bookings: 55, revenue: 3500 },
  { name: "Jul", bookings: 40, revenue: 2800 },
]

const bookingsData = [
  {
    id: 1,
    client: "Acme Corp",
    space: "Conference Room A",
    date: "2023-05-23",
    time: "09:00 - 11:00",
    status: "Confirmed",
  },
  {
    id: 2,
    client: "TechStart Inc",
    space: "Meeting Room 3",
    date: "2023-05-23",
    time: "13:00 - 14:30",
    status: "Pending",
  },
  {
    id: 3,
    client: "Global Solutions",
    space: "Auditorium",
    date: "2023-05-24",
    time: "10:00 - 16:00",
    status: "Confirmed",
  },
  { id: 4, client: "Innovate LLC", space: "Office Suite 5", date: "2023-05-25", time: "All day", status: "Confirmed" },
  {
    id: 5,
    client: "Creative Studios",
    space: "Photo Studio",
    date: "2023-05-26",
    time: "14:00 - 18:00",
    status: "Pending",
  },
]

const Dashboard: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [clientCount, setClientCount] = useState(0);
  const [vendorCount, setVendorCount] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true)
    }, 100)
  }, [])

  const getUserCount = async()=>{
     try{
      const response = await adminService.getUserCount();
      if(response.success){
        setClientCount(response.data.clients);
        setVendorCount(response.data.vendors);
      }else{
        console.error("Failed to fetch user count:", response.message);
      }
     }catch(error){
       console.error("Error fetching user count:", error)
     }
  }
  useEffect(()=>{
    getUserCount();
  },[])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: isLoaded ? 1 : 0 }} transition={{ duration: 0.5 }}>
      <h2 className="text-2xl font-semibold mb-6 text-white">Dashboard Overview</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-500 text-black mr-4 shadow-lg shadow-orange-500/30" style={{backgroundColor: '#f69938'}}>
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">Total Clients</p>
              <h3 className="text-2xl font-bold text-white">{clientCount}</h3>
              <p className="text-xs text-cyan-400">+12% from last month</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-500 text-white mr-4 shadow-lg shadow-purple-500/30">
              <ShoppingBag size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">Total Vendors</p>
              <h3 className="text-2xl font-bold text-white">{vendorCount}</h3>
              <p className="text-xs text-cyan-400">+5% from last month</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-cyan-400 text-black mr-4 shadow-lg shadow-cyan-400/30">
              <Briefcase size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">Total Buildings</p>
              <h3 className="text-2xl font-bold text-white">56</h3>
              <p className="text-xs text-cyan-400">+2 new this month</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Booking & Revenue Overview</h3>
          <div className="flex space-x-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-1 shadow-sm" style={{backgroundColor: '#f69938'}}></div>
              <span className="text-xs text-gray-400">Bookings</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-cyan-400 rounded-full mr-1 shadow-sm"></div>
              <span className="text-xs text-gray-400">Revenue</span>
            </div>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis yAxisId="left" orientation="left" stroke="#f69938" />
              <YAxis yAxisId="right" orientation="right" stroke="#22D3EE" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="bookings"
                stroke="#f69938"
                strokeWidth={3}
                dot={{ r: 4, fill: '#f69938', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#f69938', stroke: '#000', strokeWidth: 2 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="#22D3EE"
                strokeWidth={3}
                dot={{ r: 4, fill: '#22D3EE', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#22D3EE', stroke: '#000', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Latest Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Latest Bookings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-900">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Space
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {bookingsData.map((booking, index) => (
                <motion.tr
                  key={booking.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {booking.client}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{booking.space}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{booking.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{booking.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${
                        booking.status === "Confirmed"
                          ? "bg-cyan-400 text-black shadow-lg shadow-cyan-400/30"
                          : "bg-yellow-400 text-black shadow-lg shadow-yellow-400/30"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Dashboard