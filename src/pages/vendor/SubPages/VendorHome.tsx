import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Calendar, IndianRupee, Users, Filter  } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { vendorService } from '@/services/vendorServices';
import { formatCurrency } from '@/utils/formatters/currency';
import RevenueChart from '@/components/ReusableComponents/chart';
import CompletedBookingsTable  from '@/components/vendorSide/CompletedBookingsTable';
import type { RevenueDataPoint, VendorHomeData } from '@/types/vendor-home.types';
import { useNavigate } from 'react-router-dom';
import { getErrorMessage } from '@/utils/errors/errorHandler';
import Loading from '@/components/Loadings/Loading';
import { generateDateOptions } from '@/utils/constants/vendorHome';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import DownloadReportSection, { type DownloadReportFilterParams } from '@/components/VendorHomeComps/DownloadReport';
import { vendorHomeCardVariants, vendorHomeHeroVariants, vendorHomeStaggerContainer, vendorHomeTextVariants } from '@/utils/animations/motionVariants';

const VendorDashboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.vendor.vendor);
  const [loading, setLoading] = useState(true);
  const [homeData, setHomeData] = useState<VendorHomeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  // revenue chat data
  const [chartLoading, setChartLoading] = useState(false);
  const [chartData, setChartData] = useState<RevenueDataPoint[]>([]);
  const [chartFilterType, setChartFilterType] = useState<'month' | 'year' | 'date'>('month');
  const [chartSelectedDate, setChartSelectedDate] = useState('');
  const [chartSelectedMonth, setChartSelectedMonth] = useState('');
  const [chartSelectedYear, setChartSelectedYear] = useState(new Date().getFullYear().toString());
  const navigate = useNavigate()

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await vendorService.getHomeData();
      console.log("VendorHomeData",response.data)
      if (response.success) {
        setHomeData(response.data);
      } else {
        setError(response.message || 'Failed to fetch data');
      }
    } catch (error: unknown) {
      setError(getErrorMessage(error));
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchChartData = async () => {
    if (
      (chartFilterType === "date" && !chartSelectedDate) ||
      (chartFilterType === "month" && !chartSelectedMonth) ||
      !chartSelectedYear
    ) {
      toast.error("Please select valid filter options");
      return;
    }
    setChartLoading(true);
    try {
      const filterParams = {
        filterType: chartFilterType,
        date: chartFilterType  === 'date' ? chartSelectedDate : undefined,
        month: chartFilterType  === 'month' ? chartSelectedMonth : undefined,
        year: chartSelectedYear
      };
      const response = await vendorService.getRevenueChartData(filterParams);
      console.log('Revenue Chart Data:', response.data);
      if (response.success) {
        setChartData(response.data);
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
      setChartData([]);
    } finally {
      setChartLoading(false);
    }
  };

  const handleDownloadReport = async(buildingId?: string,filterParams?: DownloadReportFilterParams) => {
    if (!homeData) return;
    const response = await vendorService.getRevenueReport(buildingId,filterParams);
    const vendorData = {
      username:user?.username,
      companyName: user?.companyName,
      email: user?.email,
    }
    const selectedBuildingName = buildingId
    ? homeData.buildingIdsAndName.find(b => b._id === buildingId)?.name
    : undefined;
    vendorService.downloadPdf(response.data, vendorData, selectedBuildingName);
  };

  const handleApplyFilter = () => {
  if (chartFilterType === 'date' && !chartSelectedDate) {
    toast.error("Please select a valid date");
    return;
  }
  fetchChartData();
};
  const completedBookings = homeData ? homeData.completedBookings  : [];
  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
              <Loading/>
         </div>
    );
  }
  if (error) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchData}
              className="bg-[#f69938] text-white px-4 py-2 rounded-lg hover:bg-[#e8872e] transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <motion.section 
          variants={vendorHomeHeroVariants}
          initial="hidden"
          animate="visible"
          className="relative h-screen flex items-center justify-center overflow-hidden"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://res.cloudinary.com/dnivctodr/image/upload/v1748162538/bizzare_qarkrc.avif')`
            }}
          />
          {/* Black Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-black"
          />     
          {/* Hero Content */}
          <motion.div 
            variants={vendorHomeTextVariants}
            initial="hidden"
            animate="visible"
            className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Welcome back, <span className="text-[#f69938]">{user?.username ? `${user.username}!` : "Vendor!"}</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto"
            >
              Manage your spaces, track bookings, and grow your business with our comprehensive vendor dashboard.
            </motion.p>
          </motion.div>
          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-6 h-10 border-2 border-white rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-1 h-3 bg-white rounded-full mt-2"
              />
            </motion.div>
          </motion.div>
        </motion.section>
        {/* Main Content */}
        <main className="bg-gray-50 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
            {/* Statistics Cards and Download Report */}
         <div className="lg:flex gap-6 mb-8">
              {/* Statistics Cards */}
              <motion.div
                variants={vendorHomeStaggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 flex-1"
              >
                {[
                  {
                    title: "Total Buildings",
                    value: homeData?.totalBuildings?.toString() || "0",
                    icon: Building2,
                    color: "[#f69938]",
                    bgColor: "bg-orange-100",
                    trend: "Buildings managed",
                  },
                  {
                    title: "Available Spaces",
                    value: homeData?.totalSpaces?.toString() || "0",
                    icon: Users,
                    color: "green-600",
                    bgColor: "bg-green-100",
                    trend: "Total spaces",
                  },
                  {
                    title: "Completed Bookings",
                    value: homeData?.completedBookingsCount?.toString() || "0",
                    icon: Calendar,
                    color: "purple-600",
                    bgColor: "bg-purple-100",
                    trend: "Successfully completed",
                  },
                  {
                    title: "Total Revenue",
                    value: `${formatCurrency(homeData?.totalRevenue || 0) || "0.00"}`,
                    icon: IndianRupee,
                    color: "yellow-600",
                    bgColor: "bg-yellow-100",
                    trend: "Current balance",
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={vendorHomeCardVariants}
                    whileHover={{
                      y: -5,
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                      transition: { duration: 0.3 },
                    }}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 cursor-pointer"
                  >
                <div className="flex flex-col items-center text-center space-y-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-14 h-14 ${stat.bgColor} rounded-lg flex items-center justify-center`}
                  >
                    <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                  </motion.div>

                  <p className="text-sm font-medium text-gray-600 mb-10">{stat.title}</p>

                  <motion.p
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.1, type: "spring", stiffness: 200 }}
                    className="text-3xl font-bold text-gray-900"
                  >
                    {stat.value}
                  </motion.p>

                  <p className="text-xs text-gray-500">{stat.trend}</p>
                </div>
                  </motion.div>
                ))}
              </motion.div>
              {/* Download Report Section */}
              <div className="mt-6 lg:mt-0 w-full lg:w-[320px] flex-shrink-0">
                <DownloadReportSection
                  buildings={homeData?.buildingIdsAndName}
                  onDownloadReport={handleDownloadReport}
                />
              </div>
            </div>
            {/* Revenue Chart */}
           <div className="mb-8">
            <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  {/* Chart Header with Controls */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
                    <h2 className="text-xl font-bold text-gray-900">Revenue Overview</h2>
                    
                    {/* Chart Filter Controls */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      {/* Filter Type */}
                      <select
                        value={chartFilterType}
                        onChange={(e) => setChartFilterType(e.target.value as 'month' | 'year' | 'date')}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f69938] focus:border-transparent text-sm"
                      >
                        <option value="month">Monthly</option>
                        <option value="year">Yearly</option>
                        <option value="date">Daily</option>
                      </select>

                      {/* Conditional Date Inputs */}
                      {chartFilterType  === 'date' && (
                        <input
                          type="date"
                          value={chartSelectedDate}
                          onChange={(e) => setChartSelectedDate(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f69938] focus:border-transparent text-sm"
                        />
                      )}
                      {chartFilterType  === 'month' && (
                        <div className="flex gap-2">
                          <select
                            value={chartSelectedMonth}
                            onChange={(e) => setChartSelectedMonth(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f69938] focus:border-transparent text-sm"
                          >
                            <option value="">All Months</option>
                            {generateDateOptions().months.map(month => (
                              <option key={month.value} value={month.value}>{month.label}</option>
                            ))}
                          </select>
                          <select
                            value={chartSelectedYear}
                            onChange={(e) => setChartSelectedYear(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f69938] focus:border-transparent text-sm"
                          >
                            {generateDateOptions().years.map(year => (
                              <option key={year} value={year.toString()}>{year}</option>
                            ))}
                          </select>
                        </div>
                      )}
                      {chartFilterType  === 'year' && (
                        <select
                          value={chartSelectedYear}
                          onChange={(e) => setChartSelectedYear(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f69938] focus:border-transparent text-sm"
                        >
                          {generateDateOptions().years.map(year => (
                            <option key={year} value={year.toString()}>{year}</option>
                          ))}
                        </select>
                      )}
                      <Button 
                        onClick={handleApplyFilter}
                        disabled={
                          (chartFilterType === 'date' && !chartSelectedDate) ||
                          (chartFilterType === 'month' && !chartSelectedMonth) ||
                          !chartSelectedYear
                        }
                      >
                      <Filter className="mr-2 h-4 w-4" /> Apply Filter
                      </Button>
                    </div>
                  </div>
                  {/* Chart Content */}
                  {chartLoading ? (
                    <div className="h-80 flex items-center justify-center">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-[#f69938] rounded-full animate-bounce"></div>
                        <div className="w-4 h-4 bg-[#f69938] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-4 h-4 bg-[#f69938] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  ) : chartData.length > 0 ? (
                    <RevenueChart 
                      data={chartData}
                      title=""
                      height={320}
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
                      xAxisKey={
                        chartFilterType === 'date' ? 'hour' :
                        chartFilterType === 'month' ? 'date' :
                        'month'
                      }
                      showLegend={true}
                    />
                  ) : (
                    <div className="h-80 flex flex-col items-center justify-center text-gray-500">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <p className="text-lg font-medium mb-2">No Data Available</p>
                      <p className="text-sm text-center max-w-sm">
                        No revenue data found for the selected {chartFilterType  === 'date' ? 'date' : chartFilterType  === 'month' ? 'month' : 'year'}.
                      </p>
                    </div>
                  )}
                </motion.div>
           </div>
            {/* Completed Bookings Table */}
            <CompletedBookingsTable 
            completedBookings={completedBookings}
            loading={loading}
            onViewAll={() => {
              navigate('/vendor/bookings')
            }}
          />
          </div>
        </main>
      </div>
  );
};

export default VendorDashboard;