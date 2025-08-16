import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Bell, User, LogOut, Menu, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { IClient } from "@/types/user.type"; 
import NotificationsComponent from "../ReusableComponents/NotificationTab";
import toast from "react-hot-toast";
import { clientService } from "@/services/clientServices";
import socketService from "@/services/socketService/socketService";
import { fetchedRef } from "@/utils/helpers/socketState";

interface ClientNavbarProps {
  onMenuClick: () => void;
  onLogout: () => void;
  user: IClient | null;
  backgroundClass?: string;
}

const ClientNavbar: React.FC<ClientNavbarProps> = ({
  onMenuClick,
  onLogout,
  user,
  backgroundClass = "bg-black"
}) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showNotificationTooltip, setShowNotificationTooltip] = useState(false);
  const [showAccountTooltip, setShowAccountTooltip] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const limit = 3;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }

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
  console.log("Navbar mounted");
  if (!user?._id || fetchedRef.current) return;
  fetchedRef.current = true;

  socketService.connect(user._id, "client");
  socketService.getSocket()?.emit("requestOnlineUsers");

  socketService.onNotification((payload) => {
     if (payload?.type !== "chat") {
    setUnreadCount((prev) => prev + 1);
     }
  });

  const fetchInitialUnreadCount = async () => {
    try {
      console.log("Fetching notifications...");
      const response = await clientService.getNotifications(1, limit, "unread");
      if (response.success && response.data?.unreadCount) {
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error("Failed to fetch initial unread count", error);
    }
  };

  fetchInitialUnreadCount();

  return () => {
    socketService.removeAllListeners();
    socketService.disconnect();
    fetchedRef.current = false;
  };
}, [user?._id]);

  const fetchNotificationsFromClient = async (page: number, filter: "unread" | "all") => {
  const response = await clientService.getNotifications(page, limit, filter);

  if (!response.success || !response.data) {
    toast.error("Failed to fetch notifications");
    return {
      items: [],
      totalCount: 0,
      unreadCount: 0,
      hasMore: false,
    };
  }
  setUnreadCount(response.data.unreadCount);
  return {
    items: response.data.items || [],
    totalCount: response.data.totalCount || 0,
    unreadCount: response.data.unreadCount || 0,
    hasMore: response.data.hasMore || false,
  };
};

const handleMarkAsRead = async (id: string | undefined): Promise<{ success: boolean }> => {
 try {
    const response = await clientService.markAsRead(id);

    if (response?.success) {
      if (id) {
      setUnreadCount((prev) => prev - 1);
      }else{
        setUnreadCount(0);
      }
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
    const response = await clientService.clearNotifications();

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
}

  const locationName = user?.location?.displayName?.split(',')[0];
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
              <h4 className="text-sm">{locationName || "Add Location"}</h4><br />
    
            </div>
          </div>

          {/* Notification Icon */}
          <div
            className="relative"
            onMouseEnter={() => setShowNotificationTooltip(true)}
            onMouseLeave={() => setShowNotificationTooltip(false)}
            ref={notificationRef}
          >
             <Bell
                size={24}
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
                fetchNotifications={fetchNotificationsFromClient}
                markAsRead={handleMarkAsRead}
                clearNotifications={handleClearNotifications}
                />
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
                src={
                    user?.avatar
                      ? user.avatar.startsWith("http")
                        ? user.avatar
                        : `${import.meta.env.VITE_CLOUDINARY_SAVE_URL}${user.avatar}`
                      : "https://res.cloudinary.com/dnivctodr/image/upload/v1748161444/default-user_rbydkc.png"
                  }                alt="User avatar"
                className="w-10 h-10 object-cover rounded-full border-3 border-[#f69938]"
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
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
