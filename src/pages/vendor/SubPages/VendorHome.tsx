import React from 'react';
import { motion,} from 'framer-motion';
import {  Building2, Calendar, Plus, Settings, MapPin, DollarSign, Users,  Eye, Edit, TrendingUp, } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';

import VendorLayout from '../VendorLayout';

interface Building {
  id: string;
  name: string;
  location: string;
  totalSpaces: number;
  availableSpaces: number;
  image: string;
}



const VendorDashboard: React.FC = () => {
  const user = useSelector((state:RootState)=>state.vendor.vendor) 


  // Sample data
  const buildings: Building[] = [
    {
      id: '1',
      name: 'Tech Hub Downtown',
      location: 'Downtown, NYC',
      totalSpaces: 50,
      availableSpaces: 12,
      image: 'https://res.cloudinary.com/dnivctodr/image/upload/v1748162545/coliving_boaois.avif'
    },
    {
      id: '2',
      name: 'Creative Space Midtown',
      location: 'Midtown, NYC',
      totalSpaces: 30,
      availableSpaces: 8,
      image: 'https://res.cloudinary.com/dnivctodr/image/upload/v1748162039/desk4_rjya8d.jpg'
    },
    {
      id: '3',
      name: 'Business Center',
      location: 'Brooklyn, NYC',
      totalSpaces: 75,
      availableSpaces: 25,
      image: 'https://res.cloudinary.com/dnivctodr/image/upload/v1748162538/bizzare_qarkrc.avif'
    }
  ];





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

  return (
    <VendorLayout
      notificationCount={5}
    >
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
            Welcome back, <span className="text-[#f69938]">{user?.username ? `${user.username}!` :"Vendor!"}</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto"
          >
            Manage your spaces, track bookings, and grow your business with our comprehensive vendor dashboard.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >


          </motion.div>
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
          {/* Statistics Cards */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {[
              { title: "Total Buildings", value: "3", icon: Building2, color: "[#f69938]", bgColor: "bg-orange-100", trend: "+2 this month" },
              { title: "Available Spaces", value: "45", icon: Users, color: "green-600", bgColor: "bg-green-100", trend: "Out of 155 total" },
              { title: "This Month's Bookings", value: "127", icon: Calendar, color: "purple-600", bgColor: "bg-purple-100", trend: "+15% from last month" },
              { title: "Total Revenue", value: "$12,450", icon: DollarSign, color: "yellow-600", bgColor: "bg-yellow-100", trend: "+8% from last month" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  transition: { duration: 0.3 }
                }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <motion.p 
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + index * 0.1, type: "spring", stiffness: 200 }}
                      className="text-3xl font-bold text-gray-900"
                    >
                      {stat.value}
                    </motion.p>
                  </div>
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}
                  >
                    <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                  </motion.div>
                </div>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="mt-4 flex items-center text-sm"
                >
                  {stat.trend.includes('+') && <TrendingUp className="w-4 h-4 text-green-500 mr-1" />}
                  <span className={stat.trend.includes('+') ? "text-green-600" : "text-gray-600"}>{stat.trend}</span>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>




          {/* Your Buildings */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Your Buildings</h2>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#f69938] text-white px-4 py-2 rounded-lg hover:bg-[#e8872e] transition-colors duration-200 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Building</span>
              </motion.button>
            </div>
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {buildings.map((building, index) => (
                <motion.div
                  key={building.id}
                  variants={cardVariants}
                  whileHover={{ 
                    y: -10,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                    transition: { duration: 0.3 }
                  }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer"
                >
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    src={building.image}
                    alt={building.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <motion.h3 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="text-lg font-semibold text-gray-900 mb-2"
                    >
                      {building.name}
                    </motion.h3>
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-center text-gray-600 mb-4"
                    >
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{building.location}</span>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center justify-between text-sm text-gray-600 mb-4"
                    >
                      <span>Total Spaces: {building.totalSpaces}</span>
                      <span className="text-green-600">Available: {building.availableSpaces}</span>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex space-x-2"
                    >
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 bg-[#f69938] text-white py-2 px-4 rounded-lg hover:bg-[#e8872e] transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Manage</span>
                      </motion.button>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
    </VendorLayout>
  );
};

export default VendorDashboard;