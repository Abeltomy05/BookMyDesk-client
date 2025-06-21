import VendorNavbar from '@/components/Navbars & Sidebars/VendorNavbar';
import VendorSidebar from '@/components/Navbars & Sidebars/VendorSidebar';
import { vendorService } from '@/services/vendorServices';
import { vendorLogout } from '@/store/slices/vendor.slice';
import { sidebarItems } from '@/utils/constants/vendorSideBarItems';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

interface VendorLayoutProps {
  children: React.ReactNode;
  notificationCount?: number;
  title?: string;
  backgroundClass?: string;
}


const VendorLayout: React.FC<VendorLayoutProps> = ({
  children,
  notificationCount = 0,
  title = 'Menu',
  backgroundClass
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch  = useDispatch();

    const handleLogout = async()=>{
      try {
          const response = await vendorService.logout();
            if(response.success){
              toast.success("Logout successful!");
              dispatch(vendorLogout());
            }else{
              toast.error(response.message || "Logout Error");
            }
      } catch (error) {
        toast.error("Logout Error")
   }
 }

  return (
    <div className="min-h-screen">
      <VendorNavbar
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        notificationCount={notificationCount}
        backgroundClass={backgroundClass}
      />
      <VendorSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sidebarItems={sidebarItems}
        onLogout={handleLogout}
        title={title}
      />
      <main>{children}</main>
    </div>
  );
};

export default VendorLayout;
