import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { clientLogout } from "@/store/slices/client.slice";
import { Bell,User, Settings, LogOut, Menu, MapPin, User2} from "lucide-react"
import logo from "@/assets/BMS-logo.png"
import defaultUser from "@/assets/default-user.png"
import Sidebar from "./Sidebar";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { clientService } from "@/services/clientServices";
import toast from "react-hot-toast";

const Navbar: React.FC = () => {
    const user = useSelector((state:RootState)=>state.client.client) 
    const dispatch = useDispatch();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showNotificationTooltip, setShowNotificationTooltip] = useState(false);
    const [showAccountTooltip, setShowAccountTooltip] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);


    const handleLogout = async()=>{
      try {
          const response = await clientService.logout();
            if(response.success){
              toast.success("Logout successful!");
              dispatch(clientLogout());
            }else{
              toast.error(response.message || "Logout Error");
            }
      } catch (error) {
        toast.error("Logout Error")
      } 
    }

    const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
     }

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

     useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 750) {
        setIsSticky(true)
      } else {
        setIsSticky(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
    }, [])

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
  }, [dropdownRef]);

 return (
    <>

     <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

       <nav
      className={`${
        isSticky
          ? "fixed top-0 left-0 right-0 bg-black h-[70px] flex items-center shadow-lg transition-all duration-300"
          : "absolute top-1 left-0 right-0"
      } z-50 flex justify-between items-start px-6 md:px-12 transition-all duration-300`}
    >
      <div className="flex items-center">
        <button
           onClick={toggleSidebar}
           className={`mr-8 ${
            isSticky ? "mt-3" : "mt-1"
          } -ml-4 text-white hover:text-[#f69938] transition-transform duration-300 hover:scale-110`}
        >
          <Menu size={30} />
        </button>
        <div className={isSticky ? "mt-3" : "mt-2"}>
          <img
            src={logo}
            alt="BookMyDesk Logo"
            className={`${isSticky ? "h-12" : "h-18"} object-contain transition-all duration-300`}
          />
        </div>
      </div>

      <div className={`flex items-center space-x-5 mt-4`}>
      <div className="flex flex-col justify-center items-center text-center text-white -space-y-1">
        <h3 className="text-lg font-semibold text-white">
          {user?.username.toUpperCase()}
        </h3>
        
        <div className="flex items-center gap-1 text-gray-200">
          <MapPin size={15} />
          <h4 className="text-sm">Location</h4>
        </div>
      </div>
        <div
          className="relative"
          onMouseEnter={() => setShowNotificationTooltip(true)}
          onMouseLeave={() => setShowNotificationTooltip(false)}
        >
          <Bell
            size={24}
            className="text-white cursor-pointer transition-transform duration-300 hover:scale-110 hover:text-[#f69938]"
          />
          {/* <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-2 h-2"></span> */}

          {/* Notification Tooltip */}
          {showNotificationTooltip && (
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
              Notifications
            </div>
          )}
        </div>

        <div
          className="relative"
          ref={dropdownRef}
          onMouseEnter={() => setShowAccountTooltip(true)}
          onMouseLeave={() => !isDropdownOpen && setShowAccountTooltip(false)}
        >
          <div
            className="cursor-pointer transition-all duration-200 ease-in-out hover:scale-110 relative"
            onClick={toggleDropdown}
          >
            <img
              src={ user && user?.avatar ? user.avatar : defaultUser}
              alt="User avatar"
              className="w-auto h-10 object-cover rounded-full border-3 border-[#f69938] hover:shadow-lg transform"
            />
          </div>

          {/* Account Tooltip */}
          {showAccountTooltip && !isDropdownOpen && (
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
              Account
            </div>
          )}

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-lg shadow-xl py-2 z-20 transform transition-all duration-200 ease-in-out">
              <div className="px-4 py-3 border-b border-gray-300">
                <p className="text-sm font-bold text-gray-900 truncate">{user?.email}</p>
              </div>

              <div className="py-1">
                <a
                  href="#"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#f69938] transition-colors duration-150"
                >
                  <User size={16} className="mr-3" />
                  <span>Profile</span>
                </a>
                <a
                  href="#"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#f69938] transition-colors duration-150"
                >
                  <Settings size={16} className="mr-3" />
                  <span>Settings</span>
                </a>
              </div>

              <div className="border-t border-gray-300 py-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors duration-150"
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
    </>

  );
}

export default Navbar
