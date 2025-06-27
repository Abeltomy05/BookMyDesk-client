import React, { useEffect, useRef } from "react";
import { Home, ShoppingBag, Calendar, FileText, Wallet, MessageSquare, Settings, X } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the sidebar to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Prevent body scrolling when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-64 bg-black text-white z-51 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <div className="flex items-center ml-5">
            <img
              src="https://res.cloudinary.com/dnivctodr/image/upload/v1748161273/BMS-logo_hcz5ww.png"
              alt="BookMyDesk"
              className="h-15"
            />
            {/* <span className="ml-2 text-xl font-bold">Trimly</span> */}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200 "
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Menu */}
        <nav className="mt-3">
          <ul>
            <li>
              <a
                href="/home"
                className="flex items-center px-4 py-3 text-white bg-[#f69938] rounded-r-full mb-1"
              >
                <Home className="mr-3" size={20} />
                <span>Home</span>
              </a>
            </li>
            <li>
              <a
                href="/buildings"
                className="flex items-center px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors duration-200 rounded-r-full mb-1"
              >
                <ShoppingBag className="mr-3" size={20} />
                <span>Buildings</span>
              </a>
            </li>
            <li>
              <a
                href="/bookings"
                className="flex items-center px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors duration-200 rounded-r-full mb-1"
              >
                <Calendar className="mr-3" size={20} />
                <span>My Bookings</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors duration-200 rounded-r-full mb-1"
              >
                <FileText className="mr-3" size={20} />
                <span>Feed</span>
              </a>
            </li>
            <li>
              <a
                href="/wallet"
                className="flex items-center px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors duration-200 rounded-r-full mb-1"
              >
                <Wallet className="mr-3" size={20} />
                <span>Wallet</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors duration-200 rounded-r-full mb-1"
              >
                <MessageSquare className="mr-3" size={20} />
                <span>Chat</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors duration-200 rounded-r-full mb-1"
              >
                <Settings className="mr-3" size={20} />
                <span>Settings</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;