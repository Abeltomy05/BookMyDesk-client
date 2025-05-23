
import AdminHome from '@/pages/admin/AdminHome'
import AdminLoginPage from '@/pages/admin/AdminLogin'
import { ProtectedRoute } from '@/utils/protected/ProtectedRoute'
import { NoAuthRoute } from '@/utils/protected/PublicRoute'
import { Route, Routes } from 'react-router-dom'

const AdminRoutes = () => {
  return (
    <Routes>

         <Route path="/login" element={<NoAuthRoute element={<AdminLoginPage/>}/>}/>

         <Route path="/home" element={<ProtectedRoute allowedRoles={["admin"]} element={<AdminHome/>} />}/>

    </Routes>
  )
}

export default AdminRoutes