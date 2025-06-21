import type React from "react"
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useState, type FormEvent } from "react"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { toast } from "react-hot-toast"
import { validateLoginForm } from "@/utils/validations/auth-schema.validation"
import { clientService } from "@/services/clientServices"
import { clientLogin } from "@/store/slices/client.slice"
import { useDispatch } from "react-redux"
import Loading from "@/components/Loadings/Loading"
import { useNavigate } from "react-router-dom"

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation();
  // const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAnimated, setIsAnimated] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({})

  useEffect(() => {
      const timer = setTimeout(() => {
        setIsAnimated(true);
      }, 50);
      return () => clearTimeout(timer);
    }, []);

  useEffect(() => {
  const params = new URLSearchParams(location.search);
  const errorMessage = params.get("error");

  if (errorMessage) {
    toast.error(decodeURIComponent(errorMessage));
     params.delete("error");
    const newSearch = params.toString();
    const newUrl = newSearch ? `${location.pathname}?${newSearch}` : location.pathname;

    navigate(newUrl, { replace: true });
  }
}, [location.search, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    // Clear errors when typing
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
       const data = {...formData,role:"client"};
       const response = await clientService.login(data);
        if(response.success){
          toast.success("Login successful!")
          setFormData({
            email: "",
            password: "",
          })
          setTimeout(()=>{
            dispatch(clientLogin(response.data))
             setIsLoading(false)
            // navigate("/home")
          },2000)
        }else{
           toast.error(response.message || "Invalid email or password");
            setIsLoading(false);
        }
      } catch (error) {
        toast.error("Invalid email or password")
         setIsLoading(false)
      };
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleGoogleRedirect = async()=>{
      clientService.handleGoogleLogin();
  }

  const handleForgotPageNavigate = ()=>{
      navigate('/forgot-password/client');
  }

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
            src="https://res.cloudinary.com/dnivctodr/image/upload/v1748586258/login_omj1od.jpg"
            alt="Workspace illustration"
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
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome Back</h1>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to access your account
            </p>
          </div>

           <form onSubmit={handleSubmit} className={`space-y-6 transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] delay-450 ${
            isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}>

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
                  } py-2.5 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none`}
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
                <a onClick={handleForgotPageNavigate} className="text-xs text-gray-600 hover:text-gray-800">
                  Forgot password?
                </a>
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
                  } py-2.5 pl-10 pr-10 text-sm focus:border-blue-500 focus:outline-none`}
                  aria-invalid={errors.password ? "true" : "false"}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 "
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
                className="w-full rounded-md bg-[#f69938] py-2.5 px-4 text-sm font-medium text-white hover:bg-[#de851e] focus:outline-none focus:ring-2 focus:ring-[#de851e] focus:ring-offset-2 transition-colors duration-200 disabled:opacity-70"
              >
                {isLoading ? "Signing in..." : "Login"}
              </button>
            </div>

            {/* Divider */}
            <div className="relative py-3">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300"></span>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Google Login Button */}
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

            {/* Register Link */}
            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">
                New to BookMyDesk?{" "}
                <a href="/signup" className="font-medium text-[#f69938] hover:underline">
                  Register first
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage