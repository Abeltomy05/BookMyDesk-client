import type React from "react"
import ReusableLogin from "@/components/ReusableComponents/ReusableLogin"

const VendorLogin: React.FC = () => {
  const config = {
    title: "Vendor Login",
    subtitle: "Access your vendor dashboard",
    imageUrl: "https://res.cloudinary.com/dnivctodr/image/upload/v1748162344/vendor_mjprxu.jpg",
    imageAlt: "Vendor Signup",
    overlayTitle: "Grow Your Business With Us",
    overlaySubtitle: "Join our platform to reach more customers and increase your sales. We provide the tools you need to succeed.",
    showGoogleLogin: true,
    showForgotPassword: true,
    signupUrl: "/vendor/signup",
    signupText: "Don't have an account?",
    forgotPasswordUrl: "/forgot-password/vendor",
    useVendorStyle: true
  }

  return <ReusableLogin userType="vendor" config={config} />
}

export default VendorLogin