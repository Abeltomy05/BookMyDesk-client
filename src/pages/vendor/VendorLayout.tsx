import VendorNavbar from '@/components/Navbars & Sidebars/VendorNavbar';
import VendorSidebar from '@/components/Navbars & Sidebars/VendorSidebar';
import notificationSocketService from '@/services/socketService/notificationSocketService';
import socketService from '@/services/socketService/socketService';
import { vendorService } from '@/services/vendorServices';
import { vendorLogout } from '@/store/slices/vendor.slice';
import type { RootState } from '@/store/store';
import { sidebarItems } from '@/utils/constants/vendorSideBarItems';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';

interface VendorLayoutProps {
  title?: string;
}


const VendorLayout: React.FC<VendorLayoutProps> = ({
  title = 'Menu',
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const vendor = useSelector((state: RootState) => state.vendor.vendor);
  const dispatch  = useDispatch();
   const location = useLocation();

   const isHomePage = location.pathname === '/vendor/home';
   const navbarBgClass = isHomePage ? 'bg-transparent' : 'bg-black';

    const handleLogout = async()=>{
      try {
          const response = await vendorService.logout();
            if(response.success){
              toast.success("Logout successful!");
              socketService.disconnect();
              notificationSocketService.disconnect();
              dispatch(vendorLogout());
            }else{
              toast.error(response.message || "Logout Error");
            }
      } catch (error) {
        socketService.disconnect();
        toast.error("Logout Error")
   }
 }

  return (
    <div className="min-h-screen">
      <VendorNavbar
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        backgroundClass={navbarBgClass}
        user={vendor}
      />
      <VendorSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sidebarItems={sidebarItems}
        onLogout={handleLogout}
        title={title}
      />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default VendorLayout;
