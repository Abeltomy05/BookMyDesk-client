import VendorNavbar from '@/components/Navbars & Sidebars/VendorNavbar';
import VendorSidebar from '@/components/Navbars & Sidebars/VendorSidebar';
import { sidebarItems } from '@/utils/constants/vendorSideBarItems';
import React, { useState } from 'react';

interface VendorLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
  notificationCount?: number;
  title?: string;
  backgroundClass?: string;
}


const VendorLayout: React.FC<VendorLayoutProps> = ({
  children,
  onLogout,
  notificationCount = 0,
  title = 'Menu',
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <VendorNavbar
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        notificationCount={notificationCount}
      />
      <VendorSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sidebarItems={sidebarItems}
        onLogout={onLogout}
        title={title}
      />
      <main>{children}</main>
    </div>
  );
};

export default VendorLayout;
