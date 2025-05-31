import type React from "react"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom";
import { FcGoogle } from "react-icons/fc"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch } from "react-redux"
import { validateLoginForm } from "@/utils/validations/auth-schema.validation"
import toast from "react-hot-toast"
import { vendorService } from "@/services/vendorServices"
import { vendorLogin } from "@/store/slices/vendor.slice"
import { useNavigate } from "react-router-dom"
import Loading from "@/components/Loadings/Loading";

const VendorLogin: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
    const [errors, setErrors] = useState<{
      email?: string;
      password?: string;
    }>({})


      useEffect(() => {
        setIsVisible(true);
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

    // Clear error when user starts typing
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      setIsLoading(true)

      try {
       const data = {...formData,role:"vendor"};
       const response = await vendorService.login(data);
        if(response.success){
          toast.success("Login successful!")
          setFormData({
            email: "",
            password: "",
          })
          setTimeout(()=>{
            dispatch(vendorLogin(response.data))
             setIsLoading(false)
          },2000)
        }else{
           toast.error(response.message || "Invalid email or password");
            setIsLoading(false);
        }
      } catch (error:any) {
         const message = error?.response?.data?.message || "An unexpected error occurred";
         toast.error(message);
         setIsLoading(false);
      }
    }
  }

  const handleGoogleRedirect = async()=>{
      vendorService.handleGoogleLogin();
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

    const handleForgotPageNavigate = ()=>{
      navigate('/forgot-password/vendor');
  }

return (
    <div className={`flex flex-col md:flex-row h-screen opacity-0 transition-opacity duration-1000 ease-in ${isVisible ? "opacity-100" : ""}`}>

      {isLoading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="w-75 h-75">
            <Loading/>
          </div>
        </div>
      )}


      {/* Left side - Image (60%) */}
     <div
        className={`w-full md:w-3/5 bg-gray-100 transition-opacity duration-1000 ease-in-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="h-full w-full relative">
          <img src="https://res.cloudinary.com/dnivctodr/image/upload/v1748162344/vendor_mjprxu.jpg" alt="Vendor Signup" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-white p-8">
            <h2 className="text-6xl font-bold mb-4 text-center">Grow Your Business With Us</h2>
            <p className="text-xl max-w-lg text-center">
              Join our platform to reach more customers and increase your sales. We provide the tools you need to
              succeed.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Login Form (40%) */}
      <div className="w-full md:w-2/5 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-800">Vendor Login</h1>
            <p className="text-gray-600 mt-2">Access your vendor dashboard</p>
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
                  {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <a onClick={handleForgotPageNavigate} className="text-sm font-medium text-[#f69938] hover:text-[#e58828]">
                Forgot password?
              </a>
            </div>

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
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Google Login Button */}
            <button
              type="button"
              onClick={handleGoogleRedirect}
              className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition duration-300 flex items-center justify-center"
            >
              <FcGoogle size={20} className="mr-2" />
              Login with Google
            </button>

            {/* Sign Up Link */}
            <div className="text-center mt-8">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <a href="/vendor/signup" className="text-[#f69938] font-medium hover:text-[#e58828]">
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorLogin
