import type React from "react"
import { useEffect, useState, type FormEvent } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import { toast } from "react-hot-toast"
import { useDispatch } from "react-redux"
import { validateLoginForm } from "@/utils/validations/auth-schema.validation"
import Loading from "@/components/Loadings/Loading"
import { requestPermission } from "@/utils/firebase/firebaseNotification"

// Services
import { vendorService } from "@/services/vendorServices"
import { clientService } from "@/services/clientServices"
import { adminService, type LoginData } from "@/services/adminService"

// Actions
import { vendorLogin } from "@/store/slices/vendor.slice"
import { clientLogin } from "@/store/slices/client.slice"
import { adminLogin } from "@/store/slices/admin.slice"
import socketService from "@/services/socketService"

// Types
export type UserType = 'vendor' | 'client' | 'admin'

interface LoginConfig {
  title: string
  subtitle: string
  imageUrl: string
  imageAlt: string
  overlayTitle?: string
  overlaySubtitle?: string
  showGoogleLogin: boolean
  showForgotPassword: boolean
  signupUrl?: string
  signupText?: string
  forgotPasswordUrl?: string
  useVendorStyle?: boolean 
}

interface ReusableLoginProps {
  userType: UserType
  config: LoginConfig
}

const ReusableLogin: React.FC<ReusableLoginProps> = ({ userType, config }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isAnimated, setIsAnimated] = useState<boolean>(false)
  const [isVisible, setIsVisible] = useState(false) 
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({})

  const services = {
    vendor: vendorService,
    client: clientService,
    admin: adminService
  }

  const loginActions = {
    vendor: vendorLogin,
    client: clientLogin,
    admin: adminLogin
  }

  useEffect(() => {
    if (config.useVendorStyle) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => {
        setIsAnimated(true)
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [config.useVendorStyle])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const errorMessage = params.get("error")

    if (errorMessage) {
      toast.error(decodeURIComponent(errorMessage))
      params.delete("error")
      const newSearch = params.toString()
      const newUrl = newSearch ? `${location.pathname}?${newSearch}` : location.pathname

      navigate(newUrl, { replace: true })
    }
  }, [location.search, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      })
    }
  }

  const validateForm = (): boolean => {
    const validationErrors = validateLoginForm(formData)
    setErrors(validationErrors)
    return Object.keys(validationErrors).length === 0
  }


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      setIsLoading(true)

      try {
        const fcmToken = await requestPermission()
        const data: LoginData = { ...formData, role: userType }
         if (fcmToken) {
            // localStorage.setItem('fcm_token', fcmToken);
            data.fcmToken = fcmToken; 
          }
        const service = services[userType]
        const response = await service.login(data)
        console.log(response.data)
        
        if (response.success) {
          toast.success("Login successful!")

          setFormData({
            email: "",
            password: "",
          })
          
          setTimeout(() => {
            const loginAction = loginActions[userType]
            dispatch(loginAction(response.data))

            setIsLoading(false)
          }, 1000)
        } else {
          toast.error(response.message || "Invalid email or password")
          setIsLoading(false)
        }
      } catch (error: any) {
        const message = error?.response?.data?.message || "An unexpected error occurred"
        toast.error(message)
        setIsLoading(false)
      }
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

    const handleGoogleRedirect = async () => {
    if (config.showGoogleLogin) {
        const service = services[userType]
        if ('handleGoogleLogin' in service && typeof service.handleGoogleLogin === 'function') {
        service.handleGoogleLogin()
        }
    }
    }

  const handleForgotPageNavigate = () => {
    if (config.forgotPasswordUrl) {
      navigate(config.forgotPasswordUrl)
    }
  }

  if (config.useVendorStyle) {
    return (
      <div className={`flex flex-col md:flex-row h-screen opacity-0 transition-opacity duration-1000 ease-in ${isVisible ? "opacity-100" : ""}`}>
        
        {isLoading && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="w-75 h-75">
              <Loading/>
            </div>
          </div>
        )}

        {/* Left side - Image  */}
        <div className={`w-full md:w-3/5 bg-gray-100 transition-opacity duration-1000 ease-in-out ${isVisible ? "opacity-100" : "opacity-0"}`}>
          <div className="h-full w-full relative">
            <img src={config.imageUrl} alt={config.imageAlt} className="w-full h-full object-cover" />
            {config.overlayTitle && (
              <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-white p-8">
                <h2 className="text-6xl font-bold mb-4 text-center">{config.overlayTitle}</h2>
                {config.overlaySubtitle && (
                  <p className="text-xl max-w-lg text-center">{config.overlaySubtitle}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right side - Login Form (40%) */}
        <div className="w-full md:w-2/5 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-gray-800">{config.title}</h1>
              <p className="text-gray-600 mt-2">{config.subtitle}</p>
            </div>

            <div className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-[#e58828] focus:border-transparent`}
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-[#e58828] focus:border-transparent`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Forgot Password Link */}
              {config.showForgotPassword && config.forgotPasswordUrl && (
                <div className="text-right">
                  <a onClick={handleForgotPageNavigate} className="text-sm font-medium text-[#f69938] hover:text-[#e58828] cursor-pointer">
                    Forgot password?
                  </a>
                </div>
              )}

              {/* Login Button */}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-[#f69938] hover:bg-[#e58828] text-white py-3 rounded-lg font-medium transition duration-300 flex items-center justify-center"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : null}
                {isLoading ? "Logging in..." : "Login"}
              </button>

              {/* Divider */}
              {config.showGoogleLogin && (
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>
              )}

              {/* Google Login Button */}
              {config.showGoogleLogin && (
                <button
                  type="button"
                  onClick={handleGoogleRedirect}
                  className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition duration-300 flex items-center justify-center"
                >
                  <FcGoogle size={20} className="mr-2" />
                  Login with Google
                </button>
              )}

              {/* Sign Up Link */}
              {config.signupUrl && config.signupText && (
                <div className="text-center mt-8">
                  <p className="text-gray-600">
                    {config.signupText}{" "}
                    <a href={config.signupUrl} className="text-[#f69938] font-medium hover:text-[#e58828]">
                      Sign up
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default Style Layout (Client/Admin)
  return (
    <div className="relative flex flex-row h-screen overflow-hidden">
      
      {isLoading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="w-75 h-75">
            <Loading/>
          </div>
        </div>
      )}

      {/* Image Section (Left) - 60% */}
      <div className={`hidden md:block md:w-3/5 bg-gray-100 transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${
        isAnimated ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
      }`}>
        <div className="h-full overflow-hidden">
          <img
            src={config.imageUrl}
            alt={config.imageAlt}
            className={`h-full w-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${
              isAnimated ? 'scale-100' : 'scale-110'
            }`}
          />
        </div>
      </div>

      {/* Login Form Section (Right) - 40% */}
      <div className={`w-full md:w-2/5 flex flex-col justify-center px-4 md:px-8 py-6 md:py-0 transition-all duration-600 ease-[cubic-bezier(0.25,0.8,0.25,1)] delay-150 ${
        isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <div className="w-full max-w-md mx-auto">
          <div className={`text-center mb-8 transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] delay-300 ${
            isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{config.title}</h1>
            <p className="mt-2 text-sm text-gray-600">{config.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className={`space-y-6 transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] delay-450 ${
            isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}>
            
            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`w-full rounded-md border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } py-2.5 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200`}
                  aria-invalid={errors.email ? "true" : "false"}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                {config.showForgotPassword && config.forgotPasswordUrl && (
                  <a onClick={handleForgotPageNavigate} className="text-xs text-gray-600 hover:text-gray-800 cursor-pointer">
                    Forgot password?
                  </a>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full rounded-md border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } py-2.5 pl-10 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200`}
                  aria-invalid={errors.password ? "true" : "false"}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors duration-150"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            {/* Login Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md bg-[#f69938] py-2.5 px-4 text-sm font-medium text-white hover:bg-[#de851e] focus:outline-none focus:ring-2 focus:ring-[#de851e]/50 focus:ring-offset-2 transition-all duration-150 disabled:opacity-70 disabled:cursor-not-allowed active:transform active:scale-[0.99]"
              >
                {isLoading ? "Signing in..." : "Login"}
              </button>
            </div>

            {/* Divider */}
            {config.showGoogleLogin && (
              <div className="relative py-3">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300"></span>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
              </div>
            )}

            {/* Google Login Button */}
            {config.showGoogleLogin && (
              <button
                type="button"
                onClick={handleGoogleRedirect}
                className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white py-2.5 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none transition-colors duration-200"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  aria-hidden="true"
                  focusable="false"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 488 512"
                >
                  <path
                    fill="currentColor"
                    d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                  ></path>
                </svg>
                Sign in with Google
              </button>
            )}

            {/* Register Link */}
            {config.signupUrl && config.signupText && (
              <div className="mt-6 text-center text-sm">
                <p className="text-gray-600">
                  {config.signupText}{" "}
                  <a href={config.signupUrl} className="font-medium text-[#f69938] hover:underline">
                    Register first
                  </a>
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default ReusableLogin