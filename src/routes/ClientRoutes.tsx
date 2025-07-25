import { lazy, Suspense } from "react";
const ClientProfile = lazy(() => import("@/pages/client/SubPages/ClientProfile"));
const Home = lazy(() => import("@/pages/client/SubPages/home-page"));
import LoginPage from "@/pages/client/Login-page";
import SignupPage from "@/pages/client/signup-page";
import AuthCallback from "@/pages/shared/AuthCheck";
const ForgotPasswordPage = lazy(() => import("@/pages/shared/ForgotPassword"));
import LandingPage from "@/pages/shared/LandingPage";
const NotFoundPage = lazy(() => import("@/pages/shared/NotFoundPage"));
const ResetPasswordForm = lazy(() => import("@/pages/shared/ResetPassword"));
import { ProtectedRoute } from "@/utils/protected/ProtectedRoute";
import { NoAuthRoute } from "@/utils/protected/PublicRoute";
import { Route, Routes } from "react-router-dom";
const BuildingsListing = lazy(() => import("@/pages/client/SubPages/BuildingListing"));
const BuildingDetailsPage = lazy(() => import("@/pages/client/SubPages/BuildingDetails"));
const SpaceBookingPage = lazy(() => import("@/pages/client/SubPages/BookSlot"));
const ClientBookings = lazy(() => import("@/pages/client/SubPages/Bookings"));
const BookingDetailsPage = lazy(() => import("@/pages/client/SubPages/ClientBookingDetails"));
const ClientWalletPage = lazy(() => import("@/pages/client/SubPages/ClientWallet"));
const ClientChatPage = lazy(() => import("@/pages/client/SubPages/ClientChatPage"));
const NearbySpaces = lazy(() => import("@/pages/client/SubPages/NearBy"));
import ClientLayout from "@/pages/client/ClientLayout";
import Loading from "@/components/Loadings/Loading";


const ClientRoutes = () => {
  return (
    <Suspense fallback={
         <div className="min-h-screen flex items-center justify-center">
              <Loading/>
         </div>}>
         
          <Routes>
              <Route path="/" element={<LandingPage/>}/>

              <Route path="/signup" element={<NoAuthRoute element={<SignupPage/>}/>}/>
              <Route path="/login" element={<NoAuthRoute element={<LoginPage/>}/>}/>
              <Route path="/forgot-password/:role" element={<NoAuthRoute element={<ForgotPasswordPage/>}/>}/>
              <Route path="/reset-password/:token" element={<NoAuthRoute element={<ResetPasswordForm/>}/>}/>
              <Route path="/auth-check/:role" element={<AuthCallback/>}/>
              
              <Route
              path="/"
              element={<ProtectedRoute allowedRoles={["client"]} element={<ClientLayout />} />}
              >
                <Route path="home" element={<Home />} />
                <Route path="profile" element={<ClientProfile />} />
                <Route path="buildings" element={<BuildingsListing />} />
                <Route path="building-details/:buildingId" element={<BuildingDetailsPage />} />
                <Route path="book-space/:spaceId" element={<SpaceBookingPage />} />
                <Route path="bookings" element={<ClientBookings />} />
                <Route path="booking-details/:bookingId" element={<BookingDetailsPage />} />
                <Route path="wallet" element={<ClientWalletPage />} />
                <Route path="chat" element={<ClientChatPage />} />
                <Route path="nearby" element={<NearbySpaces />} />
              </Route>

              <Route path="/*" element={<NotFoundPage/>}/>
          </Routes>
    </Suspense>
  )
}

export default ClientRoutes