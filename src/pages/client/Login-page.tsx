import type React from "react"
import ReusableLogin from "@/components/ReusableComponents/ReusableLogin"

const ClientLogin: React.FC = () => {
  const config = {
    title: "Welcome Back",
    subtitle: "Sign in to access your account",
    imageUrl: "https://res.cloudinary.com/dnivctodr/image/upload/v1748586258/login_omj1od.jpg",
    imageAlt: "Workspace illustration",
    showGoogleLogin: true,
    showForgotPassword: true,
    signupUrl: "/signup",
    signupText: "New to BookMyDesk?",
    forgotPasswordUrl: "/forgot-password/client",
    useVendorStyle: false
  }

  return <ReusableLogin userType="client" config={config} />
}

export default ClientLogin