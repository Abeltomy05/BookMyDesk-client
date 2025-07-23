import Footer from '@/components/HomeComponents/Footer';
import PageNavbar from '@/components/Navbars & Sidebars/ClientNavbar';
import Sidebar from '@/components/Navbars & Sidebars/ClientSidebar';
import { clientService } from '@/services/clientServices';
import socketService from '@/services/socketService/socketService';
import { clientLogout } from '@/store/slices/client.slice';
import type { RootState } from '@/store/store';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

interface ClientLayoutProps {
   children: React.ReactNode;
   backgroundClass?: string;
   activeMenuItem?: string;
}


const ClientLayout: React.FC<ClientLayoutProps> = ({
  children,
  backgroundClass,
  activeMenuItem = "home"
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const client = useSelector((state: RootState) => state.client.client);
  const dispatch  = useDispatch();

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
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activeItem={activeMenuItem}/>
      <main>{children}</main>
      <Footer/>
    </div>
  );
};

export default ClientLayout;
