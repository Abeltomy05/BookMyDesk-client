import type React from "react"
import { useState, useEffect, type FormEvent } from "react"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { toast } from "react-hot-toast"
import { validateLoginForm } from "@/utils/validations/auth-schema.validation"
import { useDispatch } from "react-redux"
import Loading from "@/components/Loadings/Loading"
import { adminLogin } from "@/store/slices/admin.slice";
import { adminService } from "@/services/adminService"

const AdminLoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const dispatch = useDispatch()
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
       const data = {...formData,role:"admin"};
       const response = await adminService.login(data);
        if(response.success){
          toast.success("Login successful!")
          setFormData({
            email: "",
            password: "",
          })
          setTimeout(()=>{
            dispatch(adminLogin(response.data))
             setIsLoading(false)
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
            src="https://res.cloudinary.com/dnivctodr/image/upload/v1748161118/admin_wyzn1x.jpg"
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
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome Back Admin</h1>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to access your admin account
            </p>
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
                  tabIndex={-1}
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

          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminLoginPage