import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogOut } from 'lucide-react';


interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sidebarItems?: Array<{
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
  }>;
  onLogout: () => void;
  title?: string;
}
const VendorSidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  sidebarItems = [], 
  onLogout,
  title = "Menu" 
}) => {
  // Animation variants
  const overlayVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 }
  };

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '100%' }
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            className="fixed inset-0 bg-grey bg-opacity-40 z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50"
          >
            <div className="flex flex-col h-full">
              {/* Sidebar Header */}
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-between p-6 border-b border-gray-200"
              >
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </motion.div>

              {/* Sidebar Content */}
              <div className="flex-1 py-6">
                <nav className="space-y-2 px-6">
                  {sidebarItems.map((item, index) => (
                    <motion.a
                      key={index}
                      whileHover={{ 
                        x: 10,
                        backgroundColor: "rgba(246, 153, 56, 0.1)",
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.98 }}
                      href={item.href}
                      className="flex items-center px-4 py-3 text-gray-700 hover:text-[#f69938] rounded-lg transition-all duration-200 group"
                    >
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <item.icon className="w-5 h-5 mr-3" />
                      </motion.div>
                      <span className="font-medium">{item.label}</span>
                    </motion.a>
                  ))}
                </nav>
              </div>

              {/* Sidebar Footer */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="border-t border-gray-200 p-6"
              >
                <motion.button 
                  whileHover={{ 
                    x: 10,
                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onLogout}
                  className="flex items-center w-full px-4 py-3 text-red-600 rounded-lg transition-all duration-200 group"
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                  </motion.div>
                  <span className="font-medium">Logout</span>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VendorSidebar;