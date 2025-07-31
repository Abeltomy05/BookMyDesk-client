import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, ShoppingBag, Briefcase, Download, Filter } from "react-feather"
import { adminService } from "@/services/adminService"
import RevenueChart from "@/components/ReusableComponents/chart"
import type { RevenueDataPoint } from "@/types/vendor-home.types"
import { generateDateOptions } from "@/utils/constants/vendorHome"
import { formatDateLabel, getMonthName } from "@/utils/formatters/date"

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
  // Report filter state
  const [reportSelectedDate, setReportSelectedDate] = useState('');
  const [reportSelectedMonth, setReportSelectedMonth] = useState('');
  const [reportSelectedYear, setReportSelectedYear] = useState('');

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
    if (!isReportFilterValid()) {
      console.error("Please select valid report filter options");
      return;
    }

    setIsDownloading(true);
    try {
      const filterParams = {
        filterType: reportFilter === 'daily' ? 'date' : reportFilter === 'monthly' ? 'month' : 'year',
        date: reportFilter === 'daily' ? reportSelectedDate : undefined,
        month: reportFilter === 'monthly' ? reportSelectedMonth : undefined,
        year: reportFilter === 'yearly' ? reportSelectedYear : 
               reportFilter === 'monthly' ? reportSelectedYear : undefined
      }as {
        filterType: 'month' | 'year' | 'date';
        date?: string;
        month?: string;
        year: string;
      };

      const label = reportFilter === 'daily'
      ? formatDateLabel(reportSelectedDate)
      : reportFilter === 'monthly'
        ? `${getMonthName(reportSelectedMonth)} ${reportSelectedYear}`
        : reportSelectedYear;

      const response = await adminService.getRevenueReport(filterParams);
      console.log('revenue report: ',response.data)
      adminService.downloadPdf(response.data.bookings,response.data.totalAdminRevenue,label);
    } catch (error) {
      console.error("Error downloading report:", error);
    } finally {
      setIsDownloading(false);
    }
  }

const isReportFilterValid = () => {
  if (reportFilter === 'daily') return reportSelectedDate;
  if (reportFilter === 'monthly') return reportSelectedMonth && reportSelectedYear;
  if (reportFilter === 'yearly') return reportSelectedYear;
  return false;
};

  useEffect(() => {
    getUserCount();
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
   <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-6">
      {/* Stats Cards */}
      <div className="xl:col-span-3 flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 flex flex-col items-center justify-center h-full text-center"
          >
            <div className="p-3 rounded-full bg-orange-500 text-black mb-4 shadow-lg shadow-orange-500/30" style={{backgroundColor: '#f69938'}}>
              <Users size={24} />
            </div>
            <p className="text-sm text-gray-400 font-medium mb-2">Total Clients</p>
            <h3 className="text-2xl font-bold text-white">{clientCount}</h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 flex flex-col items-center justify-center h-full text-center"
          >
            <div className="p-3 rounded-full bg-purple-500 text-white mb-4 shadow-lg shadow-purple-500/30">
              <ShoppingBag size={24} />
            </div>
            <p className="text-sm text-gray-400 font-medium mb-2">Total Vendors</p>
            <h3 className="text-2xl font-bold text-white">{vendorCount}</h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 flex flex-col items-center justify-center h-full text-center"
          >
            <div className="p-3 rounded-full bg-cyan-400 text-black mb-4 shadow-lg shadow-cyan-400/30">
              <Briefcase size={24} />
            </div>
            <p className="text-sm text-gray-400 font-medium mb-2">Total Buildings</p>
            <h3 className="text-2xl font-bold text-white">12</h3>
          </motion.div>
        </div>
      </div>

      {/* Download Report Section - Takes 1 column */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="xl:col-span-1 bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 flex flex-col justify-between"
      >
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white mb-2">Download Reports</h3>
        </div>
        
        <div className="space-y-3">
          {/* Report Type Selector */}
          <div className="flex items-center gap-2">
            <select
              value={reportFilter}
              onChange={(e) => setReportFilter(e.target.value as 'daily' | 'monthly' | 'yearly')}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
            >
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          {/* Conditional Date Selection */}
          {reportFilter === 'daily' && (
            <input
              type="date"
              value={reportSelectedDate || ''}
              onChange={(e) => setReportSelectedDate(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
            />
          )}

          {reportFilter === 'monthly' && (
            <div className="space-y-2">
              <select
                value={reportSelectedMonth || ''}
                onChange={(e) => setReportSelectedMonth(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
              >
                <option value="">Select Month</option>
                {generateDateOptions().months.map(month => (
                  <option key={month.value} value={month.value}>{month.label}</option>
                ))}
              </select>
              <select
                value={reportSelectedYear || ''}
                onChange={(e) => setReportSelectedYear(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
              >
                <option value="">Select Year</option>
                {generateDateOptions().years.map(year => (
                  <option key={year} value={year.toString()}>{year}</option>
                ))}
              </select>
            </div>
          )}

          {reportFilter === 'yearly' && (
            <select
              value={reportSelectedYear || ''}
              onChange={(e) => setReportSelectedYear(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
            >
              <option value="">Select Year</option>
              {generateDateOptions().years.map(year => (
                <option key={year} value={year.toString()}>{year}</option>
              ))}
            </select>
          )}
          
          <button
            onClick={downloadReport}
            disabled={isDownloading || !isReportFilterValid()}
            className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-black px-4 py-2 rounded-lg font-medium transition-colors duration-200 w-full"
            style={{backgroundColor: isDownloading ? '#f69938aa' : '#f69938'}}
          >
            <Download size={16} />
            {isDownloading ? 'Downloading...' : 'Download Report'}
          </button>
        </div>
      </motion.div>
    </div>

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