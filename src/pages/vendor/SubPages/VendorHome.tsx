import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Building2, Calendar, DollarSign, Users,  Download, ChevronDown,  } from 'lucide-react';
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

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const heroVariants = {
  hidden: { opacity: 0, scale: 1.1 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 1.2,
      ease: "easeOut"
    }
  }
};

const textVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.5,
      ease: "easeOut"
    }
  }
};

const VendorDashboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.vendor.vendor);

  const [loading, setLoading] = useState(true);
  const [homeData, setHomeData] = useState<VendorHomeData | null>(null);
  const [showBuildingDropdown, setShowBuildingDropdown] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate()

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await vendorService.getHomeData();
      console.log("VendorHomeData",response.data)
      if (response.success) {
        setHomeData(response.data);
        // console.log(response.data)
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


  const revenueData: RevenueDataPoint[] = Array.isArray(homeData?.monthlyBookings)
  ? homeData?.monthlyBookings
  : [];

  const handleDownloadReport = async(buildingId?: string) => {
    if (!homeData) return;

    const response = await vendorService.getRevenueReport(buildingId);

    const vendorData = {
      username:user?.username,
      companyName: user?.companyName,
      email: user?.email,
    }

    const selectedBuildingName = buildingId
    ? homeData.buildingIdsAndName.find(b => b._id === buildingId)?.name
    : undefined;

    vendorService.downloadPdf(response.data, vendorData, selectedBuildingName);

    setShowBuildingDropdown(false);
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
          variants={heroVariants}
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
            variants={textVariants}
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
         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              {/* Statistics Cards */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
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
                    icon: DollarSign,
                    color: "yellow-600",
                    bgColor: "bg-yellow-100",
                    trend: "Current balance",
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={cardVariants}
                    whileHover={{
                      y: -5,
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                      transition: { duration: 0.3 },
                    }}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 cursor-pointer"
                  >
                    <div className="flex items-start justify-between h-full">
                      <div className="flex flex-col justify-between h-full min-h-[100px]">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                          <motion.p
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 + index * 0.1, type: "spring", stiffness: 200 }}
                            className="text-3xl font-bold text-gray-900 mb-2"
                          >
                            {stat.value}
                          </motion.p>
                        </div>
                        <p className="text-xs text-gray-500">{stat.trend}</p>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center flex-shrink-0 ml-4`}
                      >
                        <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Download Report Section */}
             <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-1 max-w-md mx-auto"
              >
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 h-full">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Building2 className="w-5 h-5 mr-2 text-[#f69938]" />
                    Download Reports
                  </h3>
                  
                  <div className="space-y-3 relative">
                    {/* Main Download Button */}
                    <motion.button
                      onClick={() => setShowBuildingDropdown(!showBuildingDropdown)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-[#f69938] text-white py-3 px-4 rounded-lg hover:bg-[#e8872e] transition-colors duration-200 flex items-center justify-between space-x-2"
                    >
                      <div className="flex items-center space-x-2">
                        <Download className="w-4 h-4" />
                        <span>Revenue Report</span>
                      </div>
                      <ChevronDown 
                        className={`w-4 h-4 transition-transform duration-200 ${
                          showBuildingDropdown ? 'rotate-180' : ''
                        }`} 
                      />
                    </motion.button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {showBuildingDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full -left-5 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 w-58 overflow-y-auto"
                        >
                          {/* All Buildings Option */}
                          <motion.button
                            onClick={() => handleDownloadReport()}
                            whileHover={{ backgroundColor: '#f9fafb' }}
                            className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 border-b border-gray-100 flex items-center space-x-3"
                          >
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Building2 className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">All Buildings</p>
                              <p className="text-sm text-gray-500">Download complete report</p>
                            </div>
                          </motion.button>

                          {/* Individual Building Options */}
                          {homeData?.buildingIdsAndName?.map((building, index) => (
                            <motion.button
                              key={building._id}
                              onClick={() => handleDownloadReport(building._id)}
                              whileHover={{ backgroundColor: '#f9fafb' }}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-3 last:border-b-0 border-b border-gray-100"
                            >
                              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Building2 className="w-4 h-4 text-[#f69938]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">{building.name}</p>
                                <p className="text-sm text-gray-500">Building-specific report</p>
                              </div>
                            </motion.button>
                          ))}

                          {/* No Buildings Message */}
                          {(!homeData?.buildingIdsAndName || homeData.buildingIdsAndName.length === 0) && (
                            <div className="px-4 py-6 text-center text-gray-500">
                              <Building2 className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                              <p className="text-sm">No buildings available</p>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Optional: Close dropdown when clicking outside */}
                    {showBuildingDropdown && (
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowBuildingDropdown(false)}
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Revenue Chart */}
           <RevenueChart 
            data={revenueData}
            title="Revenue Overview"
            height={320}
            className="mb-8"
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