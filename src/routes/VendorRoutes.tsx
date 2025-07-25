import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom"
const NotFoundPage = lazy(() => import("@/pages/shared/NotFoundPage"));
const VendorProfile = lazy(() => import("@/pages/vendor/SubPages/ProfilePage"));
const IdProofUpload = lazy(() => import("@/pages/vendor/UploadDoc"));
const VendorDashboard = lazy(() => import("@/pages/vendor/SubPages/VendorHome"));
import VendorLogin from "@/pages/vendor/VendorLogin"
import VendorSignup from "@/pages/vendor/VendorSignup"
import { ProtectedRoute } from "@/utils/protected/ProtectedRoute"
import { NoAuthRoute } from "@/utils/protected/PublicRoute"
const VendorRetryForm = lazy(() => import("@/pages/vendor/Retry"));
const BuildingManagement = lazy(() => import("@/pages/vendor/SubPages/ManageBuildings"));
const RegisterBuilding = lazy(() => import("@/pages/vendor/SubPages/RegisterBuilding"));
const BuildingDetailsEdit = lazy(() => import("@/pages/vendor/SubPages/View&EndBuildings"));
const VendorManageBookings = lazy(() => import("@/pages/vendor/SubPages/ManageBookings"));
const VendorWalletPage = lazy(() => import("@/pages/vendor/SubPages/VendorWallet"));
const OfferPage = lazy(() => import("@/pages/vendor/SubPages/OfferManagement"));
const BuildingChatPage = lazy(() => import("@/pages/vendor/SubPages/BuildingChatPage"));
import VendorLayout from "@/pages/vendor/VendorLayout"
import Loading from "@/components/Loadings/Loading";


const VendorRoutes = () => {
  return (
     <Suspense fallback={
         <div className="min-h-screen flex items-center justify-center">
              <Loading/>
         </div>}> 
        <Routes>
            <Route path="/signup" element={<NoAuthRoute element={<VendorSignup/>}/>}/>
            <Route path="/login" element={<NoAuthRoute element={<VendorLogin/>}/>}/>
            <Route path="/upload-doc" element={<NoAuthRoute element={<IdProofUpload/>}/>}/>
            <Route path="/retry/:token" element={<NoAuthRoute  element={<VendorRetryForm/>} />}/>

            <Route
              element={
                <ProtectedRoute allowedRoles={["vendor"]} element={<VendorLayout />} />
              }
            >
                  <Route path="/home" element={<VendorDashboard />} />
                  <Route path="/profile" element={<VendorProfile />} />
                  <Route path="/manage-buildings" element={<BuildingManagement />} />
                  <Route path="/register-building" element={<RegisterBuilding />} />
                  <Route path="/edit-building/:buildingId" element={<BuildingDetailsEdit />} />
                  <Route path="/bookings" element={<VendorManageBookings />} />
                  <Route path="/wallet" element={<VendorWalletPage />} />
                  <Route path="/offer" element={<OfferPage />} />
                  <Route path="/chat/:buildingId" element={<BuildingChatPage />} />
            </Route>

            <Route path="/*" element={<NotFoundPage/>}/>
        </Routes>
    </Suspense> 
  )
}

export default VendorRoutes