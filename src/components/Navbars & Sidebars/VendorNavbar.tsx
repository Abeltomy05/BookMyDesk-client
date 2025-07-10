import { vendorService } from '@/services/vendorServices';
import { motion } from 'framer-motion';
import { Bell, Menu } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import NotificationsComponent from '../ReusableComponents/NotificationTab';

interface VendorNavbarProps {
  onMenuClick: () => void;
  logoUrl?: string;
  className?: string;
  backgroundClass?: string; 
}

const VendorNavbar: React.FC<VendorNavbarProps> = ({
  onMenuClick,
  logoUrl = "https://res.cloudinary.com/dnivctodr/image/upload/v1748161273/BMS-logo_hcz5ww.png",
  className = "",
  backgroundClass
}) => {
  const [showNotificationTooltip, setShowNotificationTooltip] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const limit = 3;

  const fetchNotificationsFromVendor = async (page: number, filter: "unread" | "all") => {
  const response = await vendorService.getNotifications(page, limit, filter);
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
const handleMarkAsRead = async (id: string) => {
  const response = await vendorService.markAsRead(id);
  return response;
};

  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
      setShowNotifications(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
     className={`absolute top-0 left-0 w-full z-50 transition-all duration-300 
      ${backgroundClass ?? 'bg-transparent'} 
      ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center cursor-pointer"
            onClick={() => navigate('/vendor/home')}
          >
            <img src={logoUrl} alt="BookMyDesk Logo" className="h-16" />
          </motion.div>

          {/* Right Icons */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-4"
          >
            {/* Notification Icon */}
            <div
              className="relative"
              ref={notificationRef}
              onMouseEnter={() => setShowNotificationTooltip(true)}
              onMouseLeave={() => setShowNotificationTooltip(false)}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell
                  size={24}
                  className="text-white transition-transform duration-300 hover:text-[#f69938]"
                />
              </motion.div>

              {showNotificationTooltip && !showNotifications && (
                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                  Notifications
                </div>
              )}

  {showNotifications && (
    <div className="absolute right-0 mt-4 w-[350px] max-h-[500px] z-50">
      <NotificationsComponent 
      fetchNotifications={fetchNotificationsFromVendor} 
      markAsRead={handleMarkAsRead} 
      />
    </div>
  )}
</div>

            {/* Menu Icon */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onMenuClick}
              className="p-2 rounded-full text-white hover:text-black hover:bg-gray-100 transition-colors duration-200"
            >
              <Menu className="w-6 h-6" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );

};

export default VendorNavbar;