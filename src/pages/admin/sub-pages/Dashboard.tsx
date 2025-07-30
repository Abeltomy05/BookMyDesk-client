import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, ShoppingBag, Briefcase, Download, Calendar, Filter } from "react-feather"
import { adminService } from "@/services/adminService"
import RevenueChart from "@/components/ReusableComponents/chart"
import type { RevenueDataPoint } from "@/types/vendor-home.types"
import { generateDateOptions } from "@/utils/constants/vendorHome"

const Dashboard: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [clientCount, setClientCount] = useState(0);
  const [vendorCount, setVendorCount] = useState(0);
  const [reportFilter, setReportFilter] = useState<'daily' | 'monthly' | 'yearly'>('monthly');
  const [chartData, setChartData] = useState<RevenueDataPoint[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoadingChart, setIsLoadingChart] = useState(false);
  // Chart filter state
  const [chartFilterType, setChartFilterType] = useState<'month' | 'year' | 'date'>('month');
  const [chartSelectedDate, setChartSelectedDate] = useState('');
  const [chartSelectedMonth, setChartSelectedMonth] = useState('');
  const [chartSelectedYear, setChartSelectedYear] = useState(new Date().getFullYear().toString());

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true)
    }, 100)
  }, [])

  const getUserCount = async() => {
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

  const fetchChartData = async() => {
    if (
      (chartFilterType === "date" && !chartSelectedDate) ||
      (chartFilterType === "month" && !chartSelectedMonth) ||
      !chartSelectedYear
    ) {
      console.error("Please select valid filter options");
      return;
    }

    setIsLoadingChart(true);
    try {
      const filterParams = {
        filterType: chartFilterType,
        date: chartFilterType === 'date' ? chartSelectedDate : undefined,
        month: chartFilterType === 'month' ? chartSelectedMonth : undefined,
        year: chartSelectedYear
      };
      
      const response = await adminService.getRevenueChartData(filterParams);
      if (response.success) {
        console.log("Chart data fetched successfully:", response.data);
        setChartData(response.data);
      } else {
        console.error("Failed to fetch chart data:", response.message);
        setChartData([]);
      }

    } catch (error) {
      console.error("Error fetching chart data:", error);
      setChartData([]);
    } finally {
      setIsLoadingChart(false);
    }
  }

  const handleApplyFilter = () => {
    if (chartFilterType === 'date' && !chartSelectedDate) {
      console.error("Please select a valid date");
      return;
    }
    fetchChartData();
  };

  const downloadReport = async() => {
    setIsDownloading(true);
    try {
      const reportData = {
        filter: reportFilter,
        clients: clientCount,
        vendors: vendorCount,
        generatedAt: new Date().toISOString(),
        chartData: chartData
      };
      
      const dataStr = JSON.stringify(reportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `admin_report_${reportFilter}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error("Error downloading report:", error);
    } finally {
      setIsDownloading(false);
    }
  }

  useEffect(() => {
    getUserCount();
    handleApplyFilter();
  }, [])

  const getXAxisKey = () => {
    switch (chartFilterType) {
      case 'date': return 'hour';
      case 'month': return 'date';
      default: return 'month';
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: isLoaded ? 1 : 0 }} transition={{ duration: 0.5 }}>

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
            </div>
          </div>
        </motion.div>
      </div>

      {/* Download Report Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Download Reports</h3>
            <p className="text-sm text-gray-400">Generate and download comprehensive reports</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-400" />
              <select
                value={reportFilter}
                onChange={(e) => setReportFilter(e.target.value as 'daily' | 'monthly' | 'yearly')}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            
            <button
              onClick={downloadReport}
              disabled={isDownloading}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-black px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              style={{backgroundColor: isDownloading ? '#f69938aa' : '#f69938'}}
            >
              <Download size={16} />
              {isDownloading ? 'Downloading...' : 'Download Report'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6"
      >
        {/* Chart Header with Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Revenue Analytics</h3>
            <p className="text-sm text-gray-400">Track revenue and booking trends over time</p>
          </div>
          
          {/* Chart Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Filter Type */}
            <select
              value={chartFilterType}
              onChange={(e) => setChartFilterType(e.target.value as 'month' | 'year' | 'date')}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
              <option value="date">Daily</option>
            </select>

            {/* Conditional Date Inputs */}
            {chartFilterType === 'date' && (
              <input
                type="date"
                value={chartSelectedDate}
                onChange={(e) => setChartSelectedDate(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            )}
            {chartFilterType === 'month' && (
              <div className="flex gap-2">
                <select
                  value={chartSelectedMonth}
                  onChange={(e) => setChartSelectedMonth(e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select Month</option>
                  {generateDateOptions().months.map(month => (
                    <option key={month.value} value={month.value}>{month.label}</option>
                  ))}
                </select>
                <select
                  value={chartSelectedYear}
                  onChange={(e) => setChartSelectedYear(e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {generateDateOptions().years.map(year => (
                    <option key={year} value={year.toString()}>{year}</option>
                  ))}
                </select>
              </div>
            )}
            {chartFilterType === 'year' && (
              <select
                value={chartSelectedYear}
                onChange={(e) => setChartSelectedYear(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {generateDateOptions().years.map(year => (
                  <option key={year} value={year.toString()}>{year}</option>
                ))}
              </select>
            )}
            <button 
              onClick={handleApplyFilter}
              disabled={
                (chartFilterType === 'date' && !chartSelectedDate) ||
                (chartFilterType === 'month' && !chartSelectedMonth) ||
                !chartSelectedYear ||
                isLoadingChart
              }
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              style={{backgroundColor: isLoadingChart ? '#6b7280' : '#f69938'}}
            >
              <Filter size={16} />
              {isLoadingChart ? 'Loading...' : 'Apply Filter'}
            </button>
          </div>
        </div>

        {/* Chart Content */}
        {isLoadingChart ? (
          <div className="h-96 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-500 rounded-full animate-bounce"></div>
              <div className="w-4 h-4 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-4 h-4 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        ) : chartData.length > 0 ? (
          <RevenueChart
            data={chartData}
            height={400}
            showLegend={true}
            xAxisKey={getXAxisKey()}
            primaryLine={{
              dataKey: "revenue",
              stroke: "#f69938",
              label: "Revenue"
            }}
            secondaryLine={{
              dataKey: "bookings",
              stroke: "#3b82f6",
              label: "Bookings"
            }}
          />
        ) : (
          <div className="h-96 flex flex-col items-center justify-center text-gray-400">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-lg font-medium mb-2 text-white">No Data Available</p>
            <p className="text-sm text-center max-w-sm">
              No revenue data found for the selected {chartFilterType === 'date' ? 'date' : chartFilterType === 'month' ? 'month' : 'year'}.
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default Dashboard