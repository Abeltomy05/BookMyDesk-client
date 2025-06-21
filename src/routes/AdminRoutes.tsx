
import AdminLayout from '@/pages/admin/AdminLayout'
import AdminLoginPage from '@/pages/admin/AdminLogin'
import Dashboard from '@/pages/admin/sub-pages/Dashboard'
import VendorManagement from '@/pages/admin/sub-pages/VendorManagement'
import { ProtectedRoute } from '@/utils/protected/ProtectedRoute'
import { NoAuthRoute } from '@/utils/protected/PublicRoute'
import { Route, Routes } from 'react-router-dom'
import ClientManagement from '@/pages/admin/sub-pages/ClientManagement'
import VendorVerification from '@/pages/admin/sub-pages/VendorVerification'
import BuildingVerification from '@/pages/admin/sub-pages/BuildingVerification'

const AdminRoutes = () => {
  return (
    <Routes>

         <Route path="/login" element={<NoAuthRoute element={<AdminLoginPage/>}/>}/>


         <Route path="/home" element={<ProtectedRoute allowedRoles={["admin"]}  element={<AdminLayout><Dashboard /></AdminLayout>} />}/>
         <Route path="/users" element={<ProtectedRoute allowedRoles={["admin"]}  element={<AdminLayout><ClientManagement /></AdminLayout>} />}/>
          <Route path="/vendors" element={<ProtectedRoute allowedRoles={["admin"]}  element={<AdminLayout><VendorManagement /></AdminLayout>} />}/>
          <Route path="/vendor-verification" element={<ProtectedRoute allowedRoles={["admin"]}  element={<AdminLayout><VendorVerification /></AdminLayout>} />}/>
          <Route path="/buildings" element={<ProtectedRoute allowedRoles={["admin"]}  element={<AdminLayout><BuildingVerification /></AdminLayout>} />}/>
    </Routes>
  )
}

export default AdminRoutes