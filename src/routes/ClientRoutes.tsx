import ClientProfile from "@/pages/client/ClientProfile";
import Home from "@/pages/client/home-page";
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


       

        <Route path="/*" element={<NotFoundPage/>}/>
    </Routes>
  )
}

export default ClientRoutes