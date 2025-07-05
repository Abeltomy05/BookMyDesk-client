// ClientNavbar.tsx
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Bell, User, Settings, LogOut, Menu, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { IClient } from "@/types/user.type"; 

interface ClientNavbarProps {
  onMenuClick: () => void;
  onLogout: () => void;
  user: IClient | null;
  notificationCount?: number;
  backgroundClass?: string;
}

const ClientNavbar: React.FC<ClientNavbarProps> = ({
  onMenuClick,
  onLogout,
  user,
  notificationCount = 0,
  backgroundClass = "bg-black"
}) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showNotificationTooltip, setShowNotificationTooltip] = useState(false);
  const [showAccountTooltip, setShowAccountTooltip] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const locationName = user?.location?.displayName.split(',').slice(0,1) 
  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 ${backgroundClass} h-[70px] flex items-center justify-between shadow-lg z-[1000] px-6 md:px-12`}>
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="mr-8 -ml-4 text-white hover:text-[#f69938] transition-transform duration-300 hover:scale-110 cursor-pointer"
          >
            <Menu size={30} />
          </button>
          <div>
            <img
              src="https://res.cloudinary.com/dnivctodr/image/upload/v1748161273/BMS-logo_hcz5ww.png"
              alt="BookMyDesk Logo"
              className="h-12 object-contain cursor-pointer"
              onClick={() => navigate("/home")}
            />
          </div>
        </div>

        <div className="flex items-center space-x-5">
          <div className="flex flex-col justify-center items-center text-center text-white -space-y-1">
            <h3 className="text-lg font-semibold text-white">
              {user?.username?.toUpperCase()}
            </h3>
            <div 
            className="flex items-center gap-1 text-gray-200 cursor-pointer"
            onClick={()=>navigate("/profile")}
            >
              <MapPin size={15} />
              <h4 className="text-sm">{locationName ? locationName : "Add Location"}</h4><br />
    
            </div>
          </div>

          {/* Notification Icon */}
          <div
            className="relative"
            onMouseEnter={() => setShowNotificationTooltip(true)}
            onMouseLeave={() => setShowNotificationTooltip(false)}
          >
            <Bell
              size={24}
              className="text-white cursor-pointer transition-transform duration-300 hover:scale-110 hover:text-[#f69938]"
            />
            {/* Tooltip */}
            {showNotificationTooltip && (
              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                Notifications
              </div>
            )}
          </div>

          {/* Avatar & Dropdown */}
          <div
            className="relative"
            ref={dropdownRef}
            onMouseEnter={() => setShowAccountTooltip(true)}
            onMouseLeave={() => !isDropdownOpen && setShowAccountTooltip(false)}
          >
            <div
              className="cursor-pointer transition-all duration-200 ease-in-out hover:scale-110 relative"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <img
                src={user?.avatar || "https://res.cloudinary.com/dnivctodr/image/upload/v1748161444/default-user_rbydkc.png"}
                alt="User avatar"
                className="w-auto h-10 object-cover rounded-full border-3 border-[#f69938]"
              />
            </div>

            {showAccountTooltip && !isDropdownOpen && (
              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                Account
              </div>
            )}

            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-lg shadow-xl py-2 z-20">
                <div className="px-4 py-3 border-b border-gray-300">
                  <p className="text-sm font-bold text-gray-900 truncate">{user?.email}</p>
                </div>
                <div className="py-1">
                  <a href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#f69938]">
                    <User size={16} className="mr-3" />
                    <span>Profile</span>
                  </a>
                  <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#f69938]">
                    <Settings size={16} className="mr-3" />
                    <span>Settings</span>
                  </a>
                </div>
                <div className="border-t border-gray-300 py-1">
                  <button
                    onClick={onLogout}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    <LogOut size={16} className="mr-3" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer for layout */}
      <div className="h-[70px]"></div>
    </>
  );
};

export default ClientNavbar;
