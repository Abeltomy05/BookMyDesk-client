import ClientProfile from "@/pages/client/SubPages/ClientProfile";
import Home from "@/pages/client/SubPages/home-page";
import LoginPage from "@/pages/client/Login-page";
import SignupPage from "@/pages/client/signup-page";
import AuthCallback from "@/pages/shared/AuthCheck";
import ForgotPasswordPage from "@/pages/shared/ForgotPassword";
import LandingPage from "@/pages/shared/LandingPage";
import NotFoundPage from "@/pages/shared/NotFoundPage";
import ResetPasswordForm from "@/pages/shared/ResetPassword";
import { ProtectedRoute } from "@/utils/protected/ProtectedRoute";
import { NoAuthRoute } from "@/utils/protected/PublicRoute";
import { Route, Routes } from "react-router-dom";
import BuildingsListing from "@/pages/client/SubPages/BuildingListing";
import BuildingDetailsPage from "@/pages/client/SubPages/BuildingDetails";
import SpaceBookingPage from "@/pages/client/SubPages/BookSlot";
import ClientBookings from "@/pages/client/SubPages/Bookings";
import BookingDetailsPage from "@/pages/client/SubPages/ClientBookingDetails";
import ClientWalletPage from "@/pages/client/SubPages/ClientWallet";
import ClientChatPage from "@/pages/client/SubPages/ClientChatPage";
import NearbySpaces from "@/pages/client/SubPages/NearBy";

const ClientRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<LandingPage/>}/>

        <Route path="/signup" element={<NoAuthRoute element={<SignupPage/>}/>}/>
        <Route path="/login" element={<NoAuthRoute element={<LoginPage/>}/>}/>
        <Route path="/forgot-password/:role" element={<NoAuthRoute element={<ForgotPasswordPage/>}/>}/>
        <Route path="/reset-password/:token" element={<NoAuthRoute element={<ResetPasswordForm/>}/>}/>
        <Route path="/auth-check/:role" element={<AuthCallback/>}/>
        
        <Route path="/home" element={<ProtectedRoute allowedRoles={["client"]} element={<Home/>} />}/>
        <Route path="/profile" element={<ProtectedRoute allowedRoles={["client"]} element={<ClientProfile/>} />}/>
        <Route path="/buildings" element={<ProtectedRoute allowedRoles={["client"]} element={<BuildingsListing/>} />}/>
        <Route path="/building-details/:buildingId" element={<ProtectedRoute allowedRoles={["client"]} element={<BuildingDetailsPage/>} />}/>
        <Route path="/book-space/:spaceId" element={<ProtectedRoute allowedRoles={["client"]} element={<SpaceBookingPage/>} />}/>
        <Route path="/bookings" element={<ProtectedRoute allowedRoles={["client"]} element={<ClientBookings/>} />}/>
        <Route path="/booking-details/:bookingId" element={<ProtectedRoute allowedRoles={["client"]} element={<BookingDetailsPage/>} />}/>
        <Route path="/wallet" element={<ProtectedRoute allowedRoles={["client"]} element={<ClientWalletPage/>} />}/>
        <Route path="/chat" element={<ProtectedRoute allowedRoles={["client"]} element={<ClientChatPage/>} />}/>
        <Route path="/nearby" element={<ProtectedRoute allowedRoles={["client"]} element={<NearbySpaces/>} />}/>


       

        <Route path="/*" element={<NotFoundPage/>}/>
    </Routes>
  )
}

export default ClientRoutes