import { User, Mail, Phone, Lock, Building, MapPin, Upload } from "lucide-react"
import { vendorService } from "@/services/vendorServices"
import { validateVendorField, validateVendorSignupForm } from "@/utils/validations/auth-schema.validation"
import type { SignupConfig } from "@/types/signup.type"

export const vendorSignupConfig: SignupConfig = {
  title: "Vendor Registration",
  subtitle: "Create your vendor account to get started",
  userType: "vendor",
  fields: [
    {
      name: "username",
      type: "text",
      placeholder: "Username",
      icon: User,
      gridSpan: "half",
      required: true,
    },
    {
      name: "email",
      type: "email",
      placeholder: "Email",
      icon: Mail,
      gridSpan: "half",
      required: true,
    },
    {
      name: "password",
      type: "password",
      placeholder: "Password",
      icon: Lock,
      isPassword: true,
      gridSpan: "half",
      required: true,
    },
    {
      name: "confirmPassword",
      type: "password",
      placeholder: "Confirm Password",
      icon: Lock,
      isPassword: true,
      gridSpan: "half",
      required: true,
    },
    {
      name: "phone",
      type: "tel",
      placeholder: "Phone Number",
      icon: Phone,
      gridSpan: "half",
      required: true,
    },
    {
      name: "companyName",
      type: "text",
      placeholder: "Company Name",
      icon: Building,
      gridSpan: "half",
      required: true,
    },
    {
      name: "companyAddress",
      type: "text",
      placeholder: "Company Address",
      icon: MapPin,
      gridSpan: "full",
      required: true,
    },
    {
      name: "idProof",
      type: "file",
      placeholder: "Upload ID Proof (JPG, PNG, PDF, DOC, DOCX)",
      icon: Upload,
      isFile: true,
      accept: ".jpg,.jpeg,.png,.pdf,.doc,.docx",
      gridSpan: "full",
      required: true,
    },
  ],
  image: {
    src: "https://res.cloudinary.com/dnivctodr/image/upload/v1748162344/vendor_mjprxu.jpg",
    alt: "Vendor Signup",
    overlayTitle: "Grow Your Business With Us",
    overlaySubtitle: "Join our platform to reach more customers and increase your sales. We provide the tools you need to succeed.",
  },
  service: {
    sendOtp: vendorService.sendOtp,
    verifyOtp: vendorService.verifyOtp,
    signup: vendorService.signup,
    handleGoogleLogin: vendorService.handleGoogleLogin,
  },
  validation: {
    validateForm: validateVendorSignupForm,
    validateField: validateVendorField,
  },
  loginRoute: "/vendor/login",
}