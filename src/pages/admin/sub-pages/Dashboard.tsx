import React, { useState, useEffect } from "react"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { motion } from "framer-motion"
import { Users, ShoppingBag, Briefcase } from "react-feather"
import { adminService } from "@/services/adminService"


const Dashboard: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [clientCount, setClientCount] = useState(0);
  const [vendorCount, setVendorCount] = useState(0);
  const [monthlyStats, setMonthlyStats] = useState<{ month: string; totalBookings: number; totalRevenue: number }[]>([]);

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

  const getmonthlyStats = async()=>{
      try{
      const response = await adminService.monthlyStats();
      if(response.success){
        setMonthlyStats(response.data);
      }else{
        console.error("Failed to fetch user count:", response.message);
      }
     }catch(error){
       console.error("Error fetching user count:", error)
     }
  }
  useEffect(()=>{
    getUserCount();
    getmonthlyStats();
  },[])

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleString("default", { month: "short" });
  };

  const chartData = monthlyStats.map(({ month, totalBookings, totalRevenue }) => ({
    name: formatMonth(month),
    bookings: totalBookings,
    revenue: totalRevenue,
  }));

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
              {/* <p className="text-xs text-cyan-400">+12% from last month</p> */}
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
              {/* <p className="text-xs text-cyan-400">+5% from last month</p> */}
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
              <h3 className="text-2xl font-bold text-white">12</h3>
              {/* <p className="text-xs text-cyan-400">+2 new this month</p> */}
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
            <LineChart data={chartData.length ? chartData : []}>
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

    </motion.div>
  )
}

export default Dashboard