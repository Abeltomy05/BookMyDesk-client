import type React from "react"
import ReusableLogin from "@/components/ReusableComponents/ReusableLogin"

const AdminLogin: React.FC = () => {
  const config = {
    title: "Welcome Back Admin",
    subtitle: "Sign in to access your admin account",
    imageUrl: "https://res.cloudinary.com/dnivctodr/image/upload/v1748161118/admin_wyzn1x.jpg",
    imageAlt: "Workspace illustration",
    showGoogleLogin: false,
    showForgotPassword: false,
    useVendorStyle: false
  }

  return <ReusableLogin userType="admin" config={config} />
}

export default AdminLogin