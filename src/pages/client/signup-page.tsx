import type React from "react"
import { useState, type FormEvent, useEffect, useRef } from "react"
import { User, Mail, Phone, Lock, Eye, EyeOff, X } from "lucide-react"
import { toast } from "react-hot-toast"
import { clientService } from "@/services/clientServices"
import type { FormData,  ValidationErrors } from "@/utils/validations/auth-schema.validation"
import { validateSignupForm } from "@/utils/validations/auth-schema.validation"
import { useNavigate } from "react-router-dom"

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false)
  const [otpValues, setOtpValues] = useState<string[]>(["", "", "", ""])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isOTPLoading, setIsOTPLoading] = useState<boolean>(false)
  const [isAnimated, setIsAnimated] = useState<boolean>(false);
  

  const [timeLeft, setTimeLeft] = useState<number>(60) 
  const [timerActive, setTimerActive] = useState<boolean>(false)

  const otpInputRefs: React.RefObject<HTMLInputElement | null>[] = Array(4).fill(0).map(() => useRef<HTMLInputElement>(null))


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
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const validateForm = (): boolean => {
    const validationErrors = validateSignupForm(formData)
    setErrors(validationErrors)
    return Object.keys(validationErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      setIsLoading(true)
      try {
        const response = await clientService.sendOtp(formData.email)
        
        if (response.success) {
          setShowOtpModal(true)
          setTimeLeft(60)
          setTimerActive(true)
          toast.success("OTP sent to your email")
        } else {
          toast.error(response.message || "Email already exists")
        }
      } catch (error) {
        toast.error("Something went wrong. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
  }


  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return

    const newOtpValues = [...otpValues]
    newOtpValues[index] = value
    setOtpValues(newOtpValues)

    // Auto-focus next input
    if (value && index < otpValues.length - 1) {
      otpInputRefs[index + 1].current?.focus()
    }
  }

    const completeSignup = async () => {
    setIsLoading(true)
    try {
      const signupData = {
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: "client"
      }
      
      const response = await clientService.signup(signupData)
      
      if (response.success) {
        toast.success("Account created successfully!")
        setFormData({
          username: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
        })
        navigate("/login")
      } else {
        toast.error(response.message || "Failed to create account")
      }
    } catch (error) {
      toast.error("Failed to create account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }



  const verifyOtp = async () => {
    const otpString = otpValues.join("")
    
    if (otpString.length !== 4) {
      toast.error("Please enter a valid OTP")
      return
    }

    setIsLoading(true)
    try {
      const response = await clientService.verifyOtp(formData.email, otpString)
      
      if (response.success) {
        toast.success("OTP verified successfully!")
        setShowOtpModal(false)
         await completeSignup()
      } else {
        toast.error(response.message || "The OTP you entered is incorrect or has expired. Please try again or request a new OTP.")
      }
    } catch (error) {
      toast.error("The OTP you entered is incorrect or has expired. Please try again or request a new OTP.")
    } finally {
      setIsLoading(false)
    }
  }


  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      otpInputRefs[index - 1].current?.focus()
    }
  }


  // const closeOtpModal = () => {
  //   setShowOtpModal(false)
  //   setOtpValues(["", "", "", "", ""])
  //   setTimerActive(false)
  // }

  const resendOtp = async () => {
    setIsOTPLoading(true)
    try {
      const response = await clientService.sendOtp(formData.email)
      
      if (response.success) {
        setTimeLeft(60) 
        setTimerActive(true) 
        toast.success("OTP resent to your email")
      } else {
        toast.error(response.message || "Failed to resend OTP")
      }
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.")
    } finally {
      setIsOTPLoading(false)
    }
  }

    useEffect(() => {
      let interval: number | undefined;
      
      if (timerActive && timeLeft > 0) {
        interval = window.setInterval(() => {
          setTimeLeft((prevTime) => prevTime - 1)
        }, 1000)
      } else if (timeLeft === 0) {
        setTimerActive(false)
      }
      
      return () => {
        if (interval) clearInterval(interval)
      }
    }, [timerActive, timeLeft])

     const formatTime = (seconds: number): string => {
     const mins = Math.floor(seconds / 60)
     const secs = seconds % 60
     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      }

  useEffect(() => {
    if (showOtpModal && otpInputRefs[0].current) {
      otpInputRefs[0].current.focus()
    }
  }, [showOtpModal])

   const handleGoogleRedirect = async()=>{
       clientService.handleGoogleLogin();
   } 

  return (
    <div className="flex flex-col-reverse md:flex-row h-screen overflow-hidden relative">
      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md backdrop-saturate-150 z-50 flex items-center justify-center">
          <div className={`bg-white rounded-lg shadow-lg p-6 w-full max-w-sm mx-4 transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${
            showOtpModal ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center justify-center w-full">
                <div className="rounded-full bg-black p-2 mr-2">
                  <Lock size={18} className="text-white" />
                </div>
              </div>
              {/* <button 
                onClick={closeOtpModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button> */}
            </div>
            
            <h3 className="text-center text-blue-800 font-bold mb-1">VERIFY YOUR ACCOUNT</h3>
            
            <div className="flex justify-center space-x-2 my-6">
              {otpValues.map((digit, index) => (
                <input
                  key={index}
                  ref={otpInputRefs[index]}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-10 h-10 text-center border border-gray-300 rounded-md bg-gray-100 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-150"                />
              ))}
            </div>
            
            <div className="text-center text-xs text-gray-500 mb-4">
              {timeLeft > 0 ? (
                formatTime(timeLeft)
              ) : (
                <button 
                  onClick={resendOtp}
                  disabled={isOTPLoading}
                 className="text-[#f69938] hover:text-[#de851e] font-medium transition-colors duration-150"
                >
                  {isOTPLoading ? "Resending..." : "Resend OTP"}
                </button>
              )}
            </div>
            
            <button
              onClick={verifyOtp}
              disabled={isLoading}
              className="w-full py-3 bg-[#f69938] text-white rounded-md hover:bg-[#de851e] focus:outline-none focus:ring-2 focus:ring-[#de851e]/50 focus:ring-offset-2 transition-all duration-150 disabled:opacity-70 disabled:cursor-not-allowed active:transform active:scale-[0.99]"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        </div>
      )}

      {/* Signup Form Section */}
        <div className={`w-full md:w-2/5 flex flex-col justify-center overflow-y-auto px-4 md:px-6 py-6 md:py-0 transition-all duration-600 ease-[cubic-bezier(0.25,0.8,0.25,1)] delay-150 ${
            isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>    
        <div className="w-full max-w-md mx-auto">
        <div className={`text-center mb-6 transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] delay-300 ${
            isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}>    
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Sign Up</h1>
            <p className="mt-1 text-xs md:text-sm text-gray-600">
              Join our platform to connect with flexible workspaces.
            </p>
          </div>

           <div className={`space-y-4 transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] delay-450 ${
            isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}>
            <div className="space-y-3">
              {/* Username Input */}
              <div className="space-y-1">
                <label htmlFor="username" className="block text-xs md:text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <User size={16} />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter username"
                    className={`w-full rounded-md border ${
                      errors.username ? "border-red-500" : "border-gray-300"
                    } py-2 pl-10 pr-3 text-xs md:text-sm focus:border-blue-500 focus:outline-none`}
                    aria-invalid={errors.username ? "true" : "false"}
                  />
                </div>
                {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username}</p>}
              </div>

              {/* Email Input */}
              <div className="space-y-1">
                <label htmlFor="email" className="block text-xs md:text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Mail size={16} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    className={`w-full rounded-md border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } py-2 pl-10 pr-3 text-xs md:text-sm focus:border-blue-500 focus:outline-none`}
                    aria-invalid={errors.email ? "true" : "false"}
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              {/* Phone Input */}
              <div className="space-y-1">
                <label htmlFor="phone" className="block text-xs md:text-sm font-medium text-gray-700">
                  Phone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Phone size={16} />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className={`w-full rounded-md border ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    } py-2 pl-10 pr-3 text-xs md:text-sm focus:border-blue-500 focus:outline-none`}
                    aria-invalid={errors.phone ? "true" : "false"}
                    inputMode="numeric"
                    maxLength={10}
                  />
                </div>
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label htmlFor="password" className="block text-xs md:text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Lock size={16} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create password"
                    className={`w-full rounded-md border ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    } py-2 pl-10 pr-10 text-xs md:text-sm focus:border-blue-500 focus:outline-none`}
                    aria-invalid={errors.password ? "true" : "false"}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="block text-xs md:text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Lock size={16} />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    className={`w-full rounded-md border ${
                      errors.confirmPassword ? "border-red-500" : "border-gray-300"
                    } py-2 pl-10 pr-10 text-xs md:text-sm focus:border-blue-500 focus:outline-none`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Sign Up Button */}
            <div className="pt-2">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full rounded-md bg-[#f69938] py-2 px-4 text-xs md:text-sm font-medium text-white hover:bg-[#de851e] focus:outline-none focus:ring-2 focus:ring-[#de851e] focus:ring-offset-2 disabled:opacity-70"
              >
                {isLoading ? "Processing..." : "Sign Up"}
              </button>
            </div>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300"></span>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Google Sign Up Button */}
            <button
             onClick={handleGoogleRedirect}
              type="button"
              className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500/20 transition-all duration-150 active:transform active:scale-[0.99]"
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
              Sign up with Google
            </button>

            {/* Login Link */}
            <p className="mt-4 text-center text-xs text-gray-600">
              Already have an account?{" "}
              <a href='/login' className="font-medium text-[#f69938] hover:underline transition-colors duration-150">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Image Section */}
        <div className={`w-full h-32 md:h-full md:w-3/5 bg-gray-100 transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${
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
    </div>
  )
}

export default SignupPage