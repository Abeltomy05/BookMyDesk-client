import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { Eye, EyeOff, Lock, Upload } from "lucide-react"
import FloatingLabelInput from "@/components/ui/Floating-label"
import { validateVendorField, validateVendorSignupForm } from "@/utils/validations/auth-schema.validation"
import type {VendorFormData,VendorFormErrors,VendorTouchedFields} from '@/utils/validations/auth-schema.validation'
import toast from "react-hot-toast"
import { vendorService } from "@/services/vendorServices"
import { useNavigate } from "react-router-dom"
import { uploadFileToUploadThing } from "@/utils/uploadThing/FileUploader" 
import Loading from "@/components/Loadings/Loading"

const VendorSignup = () => {
  const [formData, setFormData] = useState<VendorFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    companyName: "",
    companyAddress: "",
    idProof: null,
  })

  const navigate = useNavigate()
  const [errors, setErrors] = useState<VendorFormErrors>({})
  const [touched, setTouched] = useState<VendorTouchedFields>({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
    phone: false,
    companyName: false,
    companyAddress: false,
    idProof: false,
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isVisible, setIsVisible] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false)
  const [otpValues, setOtpValues] = useState<string[]>(["", "", "", ""])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isOTPLoading, setIsOTPLoading] = useState<boolean>(false)
  const [selectedFileName, setSelectedFileName] = useState<string>("")
  const [isFileUploading, setIsFileUploading] = useState<boolean>(false)

 const [timeLeft, setTimeLeft] = useState<number>(60) 
 const [timerActive, setTimerActive] = useState<boolean>(false)
  
 const otpInputRefs: React.RefObject<HTMLInputElement | null>[] = Array(4).fill(0).map(() => useRef<HTMLInputElement>(null))
 const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
  return () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
}, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const fieldName = name as keyof VendorFormData
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (touched[fieldName]) {
      const fieldError = validateVendorField(fieldName, value)
      
      setErrors(prev => ({
        ...prev,
        [name]: fieldError,
      }))
      
      if (fieldName === "password") {
        const confirmError = validateVendorField("confirmPassword", formData.confirmPassword)
        setErrors(prev => ({
          ...prev,
          confirmPassword: confirmError,
        }))
      }
    }
  }

 const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    
    if (!file) {
      setFormData(prev => ({
        ...prev,
        idProof: null
      }))
      setSelectedFileName("")
      return
    }

    // Validate file before uploading
    const fieldError = validateVendorField("idProof", file)
    if (fieldError) {
      setErrors(prev => ({
        ...prev,
        idProof: fieldError
      }))
      toast.error(fieldError)
      return
    }

    setSelectedFileName(file.name)
    setIsFileUploading(true)
    
    try {
      const uploadedFileUrl = await uploadFileToUploadThing(file)
      
      setFormData(prev => ({
        ...prev,
        idProof: uploadedFileUrl 
      }))
      
      toast.success("File uploaded successfully!")
      
      setErrors(prev => ({
        ...prev,
        idProof: undefined
      }))
      
    } catch (error) {
      console.error("File upload error:", error)
      toast.error("Failed to upload file. Please try again.")
      setSelectedFileName("")
      setFormData(prev => ({
        ...prev,
        idProof: null
      }))
    } finally {
      setIsFileUploading(false)
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target
    const fieldName = name as keyof VendorFormData

    setTouched(prev => ({
      ...prev,
      [name]: true,
    }))

    const fieldError = validateVendorField(fieldName, formData[fieldName])
    setErrors(prev => ({
      ...prev,
      [name]: fieldError,
    }))
  }

   const handleFileBlur = () => {
    setTouched(prev => ({
      ...prev,
      idProof: true
    }))
    
    const fieldError = validateVendorField("idProof", formData.idProof)
    setErrors(prev => ({
      ...prev,
      idProof: fieldError
    }))
  }


  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateVendorSignupForm(formData, setErrors, setTouched, validateVendorField)
   if (isValid) {
     setIsLoading(true);
      try {
        const response = await vendorService.sendOtp(formData.email)
        
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


const resendOtp = async () => {
    setIsOTPLoading(true)
    try {
      const response = await vendorService.sendOtp(formData.email)
      
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

  const verifyOtp = async()=>{
      const otpString = otpValues.join("")
    
    if (otpString.length !== 4) {
      toast.error("Please enter a valid OTP")
      return
    }

    setIsLoading(true)
    try {
      const response = await vendorService.verifyOtp(formData.email, otpString)
      
      if (response.success) {
        toast.success("OTP verified successfully!")
         await completeSignup()
         setShowOtpModal(false)
      } else {
        toast.error(response.message || "The OTP you entered is incorrect or has expired. Please try again or request a new OTP.")
      }
    } catch (error) {
      toast.error("The OTP you entered is incorrect or has expired. Please try again or request a new OTP.")
    } finally {
      setIsLoading(false)
    }
  }
 
 const completeSignup = async () => {
    setIsLoading(true)
    try {

       if (!formData.idProof || typeof formData.idProof !== 'string') {
        toast.error('Please upload a valid ID proof document');
        return;
      }

       const signupPayload = {
            username: formData.username,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            companyName: formData.companyName,
            companyAddress: formData.companyAddress,
            role: 'vendor',
            idProof: formData.idProof, 
        };
      const response = await vendorService.signup(signupPayload)
      console.log(response);
      if (response.success) {
        toast.success("Account created successfully!")
        setFormData({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            phone: "",
            companyName: "",
            companyAddress: "",
            idProof: null
        })
        navigate("/vendor/login");
      } else {
        toast.error(response.message || "Failed to create account")
      }
    } catch (error) {
      toast.error("Failed to create account. Please try again.")
    } finally {
      setIsLoading(false)
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

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
      if (e.key === "Backspace" && !otpValues[index] && index > 0) {
        otpInputRefs[index - 1].current?.focus()
      }
    }

     const triggerFileInput = () => {
    if (isFileUploading) return // Prevent file selection while uploading
    fileInputRef.current?.click()
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

const formatTime = useCallback((seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}, []);
   
  useEffect(() => {
    if (showOtpModal && otpInputRefs[0].current) {
      otpInputRefs[0].current.focus()
    }
  }, [showOtpModal])

     const handleGoogleRedirect = async()=>{
         vendorService.handleGoogleLogin();
     }


  return (
    <div className="flex flex-col md:flex-row min-h-screen overflow-hidden relative">

        {/* OTP Modal */}
        {showOtpModal && (
       <div className="fixed inset-0 bg-black/60 backdrop-blur-md backdrop-saturate-150 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm mx-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center justify-center w-full">
                <div className="rounded-full bg-black p-2 mr-2">
                  <Lock size={18} className="text-white" />
                </div>
              </div>
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
                  className="w-10 h-10 text-center border border-gray-300 rounded-md bg-gray-100 text-gray-800"
                  aria-label={`OTP digit ${index + 1}`}
                  aria-describedby="otp-instructions"
                />
              ))}
            </div>
            
            <div className="text-center text-xs text-gray-500 mb-4">
              {timeLeft > 0 ? (
                formatTime(timeLeft)
              ) : (
                <button 
                  onClick={resendOtp}
                  disabled={isOTPLoading}
                  className="text-[#f69938] hover:text-[#de851e] font-medium"
                >
                  {isOTPLoading ? "Resending..." : "Resend OTP"}
                </button>
              )}
            </div>
            
            <button
              onClick={verifyOtp}
              disabled={isLoading}
              className="w-full py-3 bg-[#f69938] text-white rounded-md hover:bg-[#de851e] transition-colors"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        </div>
      )}


      <div
        className={`w-full md:w-2/5 bg-white p-8  flex items-center justify-center transition-opacity duration-1000 ease-in-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold mb-2">Vendor Registration</h1>
            <p className="text-gray-600">Create your vendor account to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FloatingLabelInput
                id="username"
                name="username"
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.username ? errors.username : undefined}
              />

              <FloatingLabelInput
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email ? errors.email : undefined}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <FloatingLabelInput
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password ? errors.password : undefined}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="relative">
                <FloatingLabelInput
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.confirmPassword ? errors.confirmPassword : undefined}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FloatingLabelInput
                id="phone"
                name="phone"
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.phone ? errors.phone : undefined}
              />

              <FloatingLabelInput
                id="companyName"
                name="companyName"
                type="text"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.companyName ? errors.companyName : undefined}
              />
            </div>

            <FloatingLabelInput
              id="companyAddress"
              name="companyAddress"
              type="text"
              placeholder="Company Address"
              value={formData.companyAddress}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.companyAddress ? errors.companyAddress : undefined}
            />

            <div className="relative">
             <div
                onClick={triggerFileInput}
                className={`border border-gray-300 rounded-lg p-3 cursor-pointer flex items-center justify-between transition-colors ${
                  isFileUploading 
                    ? 'bg-gray-200 cursor-not-allowed' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <span className={`text-sm ${
                  isFileUploading 
                    ? 'text-gray-400' 
                    : selectedFileName 
                      ? 'text-gray-800' 
                      : 'text-gray-500'
                }`}>
                  {isFileUploading 
                    ? "Uploading..." 
                    : selectedFileName || "Upload ID Proof (JPG, PNG, PDF, DOC, DOCX)"
                  }
                </span>
                <Upload size={16} className={`${isFileUploading ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                id="idProof"
                name="idProof"
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                className="hidden"
                onChange={handleFileChange}
                onBlur={handleFileBlur}
                disabled={isFileUploading}
              />
              {touched.idProof && errors.idProof && (
                <p className="text-red-500 text-xs mt-1">{errors.idProof}</p>
              )}
            </div>

            <button
              disabled={isLoading || isFileUploading}
              type="submit"
              className="w-full py-2 px-4 bg-[#f69938] text-white rounded-lg hover:bg-[#e58828] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#f69938] focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : isFileUploading ? "Uploading File..." : "Create Account"}
            </button>

            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleRedirect}
              type="button"
              className="w-full flex items-center justify-center py-3 px-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#f69938] focus:ring-opacity-50"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign up with Google
            </button>

            <div className="text-center mt-6">
              <p className="text-gray-600">
                Already have an account?{" "}
                <a href="/vendor/login" className="text-[#f69938] hover:underline">
                  Log in
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Image*/}
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
    </div>
  )
}

export default VendorSignup