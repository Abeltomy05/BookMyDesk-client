import Footer from '@/components/HomeComponents/Footer';
import PageNavbar from '@/components/Navbars & Sidebars/ClientNavbar';
import Sidebar from '@/components/Navbars & Sidebars/ClientSidebar';
import { clientService } from '@/services/clientServices';
import { clientLogout } from '@/store/slices/client.slice';
import type { RootState } from '@/store/store';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

interface ClientLayoutProps {
   children: React.ReactNode;
  notificationCount?: number;
  backgroundClass?: string;
}


const ClientLayout: React.FC<ClientLayoutProps> = ({
  children,
  notificationCount = 0,
  backgroundClass
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const client = useSelector((state: RootState) => state.client.client);
  const dispatch  = useDispatch();

    const handleLogout = async () => {
        try {
            const response = await clientService.logout();
            if (response.success) {
                toast.success("Logout successful!");
                dispatch(clientLogout());
            } else {
                toast.error(response.message || "Logout Error");
            }
        } catch (error) {
            toast.error("Logout Error")
        }
    }

  return (
    <div className="min-h-screen">
      <PageNavbar
        onMenuClick={() => setSidebarOpen(true)}
        onLogout={handleLogout}
        user={client}
        notificationCount={notificationCount}
        backgroundClass={backgroundClass}
      />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main>{children}</main>
      <Footer/>
    </div>
  );
};

export default ClientLayout;
