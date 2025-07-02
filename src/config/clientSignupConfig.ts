import { User, Mail, Phone, Lock } from "lucide-react"
import { clientService } from "@/services/clientServices"
import {  validateClientField, validateClientSignupForm } from "@/utils/validations/auth-schema.validation"
import type { SignupConfig } from "@/types/signup.type"

export const clientSignupConfig: SignupConfig = {
  title: "Sign Up",
  subtitle: "Join our platform to connect with flexible workspaces.",
  userType: "client",
  fields: [
    {
      name: "username",
      type: "text",
      placeholder: "Enter username",
      icon: User,
      gridSpan: "full",
      required: true,
    },
    {
      name: "email",
      type: "email",
      placeholder: "Enter email",
      icon: Mail,
      gridSpan: "full",
      required: true,
    },
    {
      name: "phone",
      type: "tel",
      placeholder: "Enter phone number",
      icon: Phone,
      gridSpan: "full",
      required: true,
    },
    {
      name: "password",
      type: "password",
      placeholder: "Create password",
      icon: Lock,
      isPassword: true,
      gridSpan: "full",
      required: true,
    },
    {
      name: "confirmPassword",
      type: "password",
      placeholder: "Confirm password",
      icon: Lock,
      isPassword: true,
      gridSpan: "full",
      required: true,
    },
  ],
  image: {
    src: "https://res.cloudinary.com/dnivctodr/image/upload/v1748586258/login_omj1od.jpg",
    alt: "Workspace illustration",
    overlayTitle: "Welcome to Our Platform",
    overlaySubtitle: "Discover and book flexible workspaces that suit your needs.",
  },
  service: {
    sendOtp: clientService.sendOtp,
    verifyOtp: clientService.verifyOtp,
    signup: clientService.signup,
    handleGoogleLogin: clientService.handleGoogleLogin,
  },
    validation: {
    validateForm: validateClientSignupForm,
    validateField: validateClientField,
    },
  loginRoute: "/login",
}