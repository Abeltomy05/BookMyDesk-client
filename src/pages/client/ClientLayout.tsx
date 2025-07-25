import Footer from '@/components/HomeComponents/Footer';
import PageNavbar from '@/components/Navbars & Sidebars/ClientNavbar';
import Sidebar from '@/components/Navbars & Sidebars/ClientSidebar';
import { clientService } from '@/services/clientServices';
import socketService from '@/services/socketService/socketService';
import { clientLogout } from '@/store/slices/client.slice';
import type { RootState } from '@/store/store';
import React, {  useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Outlet, useLocation  } from 'react-router-dom';

interface ClientLayoutProps {
   backgroundClass?: string;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({
  backgroundClass,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const client = useSelector((state: RootState) => state.client.client);
  const dispatch  = useDispatch();
  const location = useLocation();

  useEffect(() => {
  console.log("ClientLayout mounted");
}, []);

const activeItem = useMemo(() => {
    if (location.pathname.includes("/home")) return "home";
    if (location.pathname.includes("/profile")) return "profile";
    if (location.pathname.includes("/buildings")) return "buildings";
    if (location.pathname.includes("/building-details")) return "buildings";
    if (location.pathname.includes("/book-space")) return "bookings";
    if (location.pathname.includes("/bookings")) return "bookings";
    if (location.pathname.includes("/wallet")) return "wallet";
    if (location.pathname.includes("/chat")) return "chat";
    if (location.pathname.includes("/nearby")) return "buildings"; 
    return "home";
  }, [location.pathname]);

    const handleLogout = async () => {
        try {
            const response = await clientService.logout();
            if (response.success) {
                toast.success("Logout successful!");
                socketService.disconnect();
                dispatch(clientLogout());
            } else {
                toast.error(response.message || "Logout Error");
            }
        } catch (error) {
            socketService.disconnect();
            toast.error("Logout Error")
        }
    }

  return (
    <div className="min-h-screen">
      <PageNavbar
        onMenuClick={() => setSidebarOpen(true)}
        onLogout={handleLogout}
        user={client}
        backgroundClass={backgroundClass}
      />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activeItem={activeItem}/>
      <main><Outlet /></main>
      <Footer/>
    </div>
  );
};

export default ClientLayout;
