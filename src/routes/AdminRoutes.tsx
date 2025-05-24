
import AdminLayout from '@/pages/admin/AdminLayout'
import AdminLoginPage from '@/pages/admin/AdminLogin'
import Dashboard from '@/pages/admin/sub-pages/Dashboard'
import UserManagement from '@/pages/admin/sub-pages/UserManagement'
import VendorManagement from '@/pages/admin/sub-pages/VendorManagement'
import { ProtectedRoute } from '@/utils/protected/ProtectedRoute'
import { NoAuthRoute } from '@/utils/protected/PublicRoute'
import { Route, Routes } from 'react-router-dom'

const AdminRoutes = () => {
  return (
    <Routes>

         <Route path="/login" element={<NoAuthRoute element={<AdminLoginPage/>}/>}/>


         <Route path="/home" element={<ProtectedRoute allowedRoles={["admin"]}  element={<AdminLayout><Dashboard /></AdminLayout>} />}/>
         <Route path="/users" element={<ProtectedRoute allowedRoles={["admin"]}  element={<AdminLayout><UserManagement /></AdminLayout>} />}/>
          <Route path="/vendors" element={<ProtectedRoute allowedRoles={["admin"]}  element={<AdminLayout><VendorManagement /></AdminLayout>} />}/>
    </Routes>
  )
}

export default AdminRoutes