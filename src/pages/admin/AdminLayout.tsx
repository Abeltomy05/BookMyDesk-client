// AdminLayout.tsx
import type React from "react"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bell,
  ChevronDown,
  Home,
  Users,
  ShoppingBag,
  Briefcase,
  Calendar,
  LogOut,
  User,
  Menu,
  X,
} from "react-feather"
import { IndianRupee } from "lucide-react"
import toast from "react-hot-toast"
import { adminService } from "@/services/adminService"
import { adminLogout } from "@/store/slices/admin.slice"
import { useDispatch } from "react-redux"
import { useNavigate, useLocation } from "react-router-dom"
import { ShieldCheck, Wrench } from "lucide-react"
import NotificationsComponent from "@/components/ReusableComponents/NotificationTab"


const sidebarItems = [
  { icon: Home, label: "Dashboard", route: "/admin/home" },
  { icon: Users, label: "Clients", route: "/admin/users" },
  { icon: ShoppingBag, label: "Vendors", route: "/admin/vendors" },
  { icon: ShieldCheck, label: "Vendor Verification", route: "/admin/vendor-verification" },
  { icon: Briefcase, label: "Buildings & Spaces", route: "/admin/buildings" },
  { icon: Briefcase, label: "Buildings Verification", route: "/admin/building-verification" },
  { icon: Wrench, label: "Amenities", route: "/admin/amenities" },
  { icon: Calendar, label: "Bookings", route: "/admin/bookings" },
  { icon: IndianRupee, label: "Wallet", route: "/admin/wallet" },
]

interface AdminLayoutProps {
  children: React.ReactNode
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showNotificationTooltip, setShowNotificationTooltip] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef<HTMLDivElement>(null);
  const limit = 3;
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (
          notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
          setShowNotifications(false);
        }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
  const fetchInitialNotificationData = async () => {
    const res = await fetchNotificationsFromAdmin(0, "unread");
    setUnreadCount(res.unreadCount); 
  };

  fetchInitialNotificationData();
  const interval = setInterval(fetchInitialNotificationData, 60000);

  return () => clearInterval(interval);
}, []);

  const fetchNotificationsFromAdmin = async (page: number, filter: "unread" | "all") => {
  const response = await adminService.getNotifications(page, limit, filter);

  if (!response.success || !response.data) {
    toast.error("Failed to fetch notifications");
    return {
      items: [],
      totalCount: 0,
      unreadCount: 0,
      hasMore: false,
    };
  }

  return {
    items: response.data.items || [],
    totalCount: response.data.totalCount || 0,
    unreadCount: response.data.unreadCount || 0,
    hasMore: response.data.hasMore || false,
  };
};

const handleMarkAsRead = async (id: string): Promise<{ success: boolean }> => {
 try {
    const response = await adminService.markAsRead(id);
    if (response?.success) {
      setUnreadCount((prev) => prev - 1);
      return { success: true };
    } else {
      toast.error("Something went wrong!");
      return { success: false };
    }
  } catch (error) {
    console.error("Error marking as read:", error);
    toast.error("Something went wrong!");
    return { success: false };
  }
};

const handleClearNotifications = async (): Promise<{ success: boolean }> => {
 try {
    const response = await adminService.clearNotifications();
    if (response?.success) {
      return { success: true };
    } else {
      toast.error("Something went wrong!");
      return { success: false };
    }
  } catch (error) {
    console.error("Error clearing notifications:", error);
    toast.error("Something went wrong!");
    return { success: false };
  }
};

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen)
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleSidebarNavigation = (route: string) => {
    navigate(route)
    if (window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }

  const handleLogout = async () => {
    try {
      const response = await adminService.logout()
      if (response.success) {
        toast.success("Logout successful!")
        dispatch(adminLogout())
        navigate("/admin/login")
      } else {
        toast.error(response.message || "Logout Error")
      }
    } catch (error) {
      toast.error("Logout Error")
    }
  }

  const getCurrentPageTitle = () => {
    const currentItem = sidebarItems.find(item => item.route === location.pathname)
    return currentItem?.label || "Dashboard"
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans">

      <div className="md:hidden fixed top-4 left-4 z-30">
        <button onClick={toggleSidebar} className="p-2 bg-gray-800 rounded-md shadow-md text-gray-300 border border-gray-700">
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <AnimatePresence>
        {(sidebarOpen || window.innerWidth >= 768) && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed md:relative z-20 w-64 h-full bg-gray-800 shadow-lg md:shadow-none border-r border-gray-700 ${
              sidebarOpen ? "block" : "hidden md:block"
            }`}
          >
            <div className="p-6">
              <div className="flex items-center justify-center mb-8">
                <h1 className="text-2xl font-bold text-orange-400" style={{color: '#f69938'}}>AdminPanel</h1>
              </div>
              <nav>
                <ul className="space-y-2">
                  {sidebarItems.map((item, index) => {
                    const isActive = location.pathname === item.route
                    return (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <button
                          onClick={() => handleSidebarNavigation(item.route)}
                          className={`w-full flex items-center p-3 text-gray-300 rounded-lg hover:bg-gray-700 hover:shadow-lg transition-all duration-200 ${
                            isActive ? "bg-orange-500 text-black font-medium shadow-lg shadow-orange-500/30" : ""
                          }`}
                          style={isActive ? {backgroundColor: '#f69938'} : {}}
                        >
                          <item.icon className={`w-5 h-5 mr-3 ${isActive ? "text-black" : "text-gray-400"}`} />
                          <span>{item.label}</span>
                        </button>
                      </motion.li>
                    )
                  })}
                </ul>
              </nav>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-black shadow-lg border-b border-gray-800 z-10"
        >
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold md:ml-0 ml-8" style={{color: '#f69938'}}>
                {getCurrentPageTitle()}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div 
              className="relative"
              onMouseEnter={() => setShowNotificationTooltip(true)}
              onMouseLeave={() => setShowNotificationTooltip(false)}
              ref={notificationRef}
              >
                 <Bell
                  size={28}
                  className="text-white cursor-pointer transition-transform duration-300 hover:scale-110 hover:text-[#f69938]"
                  onClick={() => setShowNotifications(!showNotifications)}
                />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
                {/* Tooltip */}
                {showNotificationTooltip && !showNotifications && (
                  <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                    Notifications
                  </div>
                )}
    
                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-4 w-[350px] max-h-[500px] z-50">
                    <NotificationsComponent  
                    fetchNotifications={fetchNotificationsFromAdmin}
                    markAsRead={handleMarkAsRead}
                    clearNotifications={handleClearNotifications}
                    />
                  </div>
                )}
              </div>
              <div className="relative ">
                <button
                  onClick={toggleUserDropdown}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white focus:outline-none transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-black shadow-lg shadow-orange-500/30" style={{backgroundColor: '#f69938'}}>
                    <User size={16} />
                  </div>
                  <span className="hidden md:block">Admin User</span>
                  <ChevronDown size={16} />
                </button>
                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg border border-gray-700 py-1 z-50"
                    >
                      <button 
                        onClick={handleLogout}
                        className="w-full block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors text-left"
                      >
                        <div className="flex items-center">
                          <LogOut size={16} className="mr-2" />
                          <span>Logout</span>
                        </div>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-900">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout