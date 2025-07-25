import React, { useEffect, useRef } from "react";
import { Home, ShoppingBag, Calendar, Wallet, MessageSquare, X } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeItem?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeItem = "home" }) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

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

 const getMenuItemClasses = (itemKey: string) => {
    const baseClasses = "flex items-center px-4 py-3 transition-colors duration-200 rounded-r-full mb-1";
    const activeClasses = "text-white bg-[#f69938]";
    const inactiveClasses = "text-gray-400 hover:text-white hover:bg-gray-800";
    
    return `${baseClasses} ${activeItem === itemKey ? activeClasses : inactiveClasses}`;
  };

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
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200"
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
                className={getMenuItemClasses("home")}
              >
                <Home className="mr-3" size={20} />
                <span>Home</span>
              </a>
            </li>
            <li>
              <a
                href="/buildings"
                className={getMenuItemClasses("buildings")}
              >
                <ShoppingBag className="mr-3" size={20} />
                <span>Buildings</span>
              </a>
            </li>
            <li>
              <a
                href="/bookings"
                className={getMenuItemClasses("bookings")}
              >
                <Calendar className="mr-3" size={20} />
                <span>My Bookings</span>
              </a>
            </li>
            <li>
              <a
                href="/wallet"
                className={getMenuItemClasses("wallet")}
              >
                <Wallet className="mr-3" size={20} />
                <span>Wallet</span>
              </a>
            </li>
            <li>
              <a
                href="/chat"
                className={getMenuItemClasses("chat")}
              >
                <MessageSquare className="mr-3" size={20} />
                <span>Chat</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;