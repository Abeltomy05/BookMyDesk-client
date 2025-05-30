import NotFoundPage from "@/pages/shared/NotFoundPage"
import IdProofUpload from "@/pages/vendor/UploadDoc"
import VendorDashboard from "@/pages/vendor/VendorHome"
import VendorLogin from "@/pages/vendor/VendorLogin"
import VendorSignup from "@/pages/vendor/VendorSignup"
import { ProtectedRoute } from "@/utils/protected/ProtectedRoute"
import { NoAuthRoute } from "@/utils/protected/PublicRoute"
import { Route, Routes } from "react-router-dom"


const VendorRoutes = () => {
  return (
    <Routes>
        <Route path="/signup" element={<NoAuthRoute element={<VendorSignup/>}/>}/>
        <Route path="/login" element={<NoAuthRoute element={<VendorLogin/>}/>}/>
        <Route path="/upload-doc" element={<NoAuthRoute element={<IdProofUpload/>}/>}/>

        <Route path="/home" element={<ProtectedRoute allowedRoles={["vendor"]} element={<VendorDashboard/>} />}/>

        <Route path="/*" element={<NotFoundPage/>}/>
    </Routes>
  )
}

export default VendorRoutes