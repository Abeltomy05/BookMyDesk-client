import { motion } from 'framer-motion';
import { Bell, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VendorNavbarProps {
  onMenuClick: () => void;
  notificationCount?: number;
  logoUrl?: string;
  className?: string;
  backgroundClass?: string; 
}

const VendorNavbar: React.FC<VendorNavbarProps> = ({
  onMenuClick,
  notificationCount = 0,
  logoUrl = "https://res.cloudinary.com/dnivctodr/image/upload/v1748161273/BMS-logo_hcz5ww.png",
  className = "",
  backgroundClass
}) => {

  const navigate = useNavigate();

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
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-full text-white hover:text-black hover:bg-gray-100 transition-colors duration-200"
            >
              <Bell className="w-6 h-6" />
              {notificationCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                >
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    {notificationCount}
                  </motion.span>
                </motion.span>
              )}
            </motion.button>

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