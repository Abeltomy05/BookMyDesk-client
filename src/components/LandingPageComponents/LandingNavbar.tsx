import type React from "react"
import { useEffect, useState } from "react"
import { Menu } from "lucide-react"
import Sidebar from "../Navbars & Sidebars/ClientSidebar"
import { useNavigate } from "react-router-dom"

const LandingNavbar: React.FC = () => {
  const [isSticky, setIsSticky] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const navigate = useNavigate()

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
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
              src="https://res.cloudinary.com/dnivctodr/image/upload/v1748161273/BMS-logo_hcz5ww.png"
              alt="BookMyDesk Logo"
              className={`${isSticky ? "h-12" : "h-18"} object-contain transition-all duration-300`}
            />
          </div>
        </div>

        <div className={`flex items-center space-x-4 mt-4`}>
          <button 
          className="px-4 py-2 text-white border border-white rounded-lg hover:bg-white hover:text-black transition-all duration-300"
          onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button 
          className="px-4 py-2 bg-[#f69938] text-white rounded-lg hover:bg-[#e58a2f] transition-all duration-300"
          onClick={() => navigate("/signup")}
          >
            Register
          </button>
        </div>
      </nav>
    </>
  )
}

export default LandingNavbar
