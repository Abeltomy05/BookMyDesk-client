import NotFoundPage from "@/pages/shared/NotFoundPage"
import VendorProfile from "@/pages/vendor/SubPages/ProfilePage"
import IdProofUpload from "@/pages/vendor/UploadDoc"
import VendorDashboard from "@/pages/vendor/SubPages/VendorHome"
import VendorLogin from "@/pages/vendor/VendorLogin"
import VendorSignup from "@/pages/vendor/VendorSignup"
import { ProtectedRoute } from "@/utils/protected/ProtectedRoute"
import { NoAuthRoute } from "@/utils/protected/PublicRoute"
import { Route, Routes } from "react-router-dom"
import VendorRetryForm from "@/pages/vendor/Retry"
import BuildingManagement from "@/pages/vendor/SubPages/ManageBuildings"
import RegisterBuilding from "@/pages/vendor/SubPages/RegisterBuilding"
import BuildingDetailsEdit from "@/pages/vendor/SubPages/View&EndBuildings"
import VendorManageBookings from "@/pages/vendor/SubPages/ManageBookings"


const VendorRoutes = () => {
  return (
    <Routes>
        <Route path="/signup" element={<NoAuthRoute element={<VendorSignup/>}/>}/>
        <Route path="/login" element={<NoAuthRoute element={<VendorLogin/>}/>}/>
        <Route path="/upload-doc" element={<NoAuthRoute element={<IdProofUpload/>}/>}/>
        <Route path="/retry/:token" element={<NoAuthRoute  element={<VendorRetryForm/>} />}/>

        <Route path="/home" element={<ProtectedRoute allowedRoles={["vendor"]} element={<VendorDashboard/>} />}/>
        <Route path="/profile" element={<ProtectedRoute allowedRoles={["vendor"]} element={<VendorProfile/>} />}/>
        <Route path="/manage-buildings" element={<ProtectedRoute allowedRoles={["vendor"]} element={<BuildingManagement/>} />}/>
        <Route path="/register-building" element={<ProtectedRoute allowedRoles={["vendor"]} element={<RegisterBuilding/>} />}/>
        <Route path="/edit-building/:buildingId" element={<ProtectedRoute allowedRoles={["vendor"]} element={<BuildingDetailsEdit/>} />}/>
        <Route path="/bookings" element={<ProtectedRoute allowedRoles={["vendor"]} element={<VendorManageBookings/>} />}/>
        

        <Route path="/*" element={<NotFoundPage/>}/>
    </Routes>
  )
}

export default VendorRoutes