import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { Eye, EyeOff, Lock, Upload } from "lucide-react"
import FloatingLabelInput from "@/components/ui/Floating-label"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { uploadFileToUploadThing } from "@/utils/uploadThing/FileUploader"
import type { SignupConfig, BaseFormData, FormField } from "@/types/signup.type"

interface ReusableSignupProps {
  config: SignupConfig;
}

const ReusableSignup: React.FC<ReusableSignupProps> = ({ config }) => {
  const navigate = useNavigate()
  
  // Initialize form data based on config fields
  const initializeFormData = () => {
    const initialData: any = {}
    config.fields.forEach(field => {
      initialData[field.name] = field.isFile ? null : ""
    })
    return initialData
  }

  const [formData, setFormData] = useState(initializeFormData())
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>(() => {
    const initialTouched: Record<string, boolean> = {}
    config.fields.forEach(field => {
      initialTouched[field.name] = false
    })
    return initialTouched
  })

  // Password visibility states
  const [passwordVisibility, setPasswordVisibility] = useState<Record<string, boolean>>({})
  
  // Common states
  const [isVisible, setIsVisible] = useState(false)
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false)
  const [otpValues, setOtpValues] = useState<string[]>(["", "", "", ""])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isOTPLoading, setIsOTPLoading] = useState<boolean>(false)
  const [timeLeft, setTimeLeft] = useState<number>(60)
  const [timerActive, setTimerActive] = useState<boolean>(false)
  
  // File upload states (only for vendor)
  const [selectedFileName, setSelectedFileName] = useState<string>("")
  const [isFileUploading, setIsFileUploading] = useState<boolean>(false)

  // Refs
  const otpInputRefs: React.RefObject<HTMLInputElement | null>[] = Array(4).fill(0).map(() => useRef<HTMLInputElement>(null))
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }))

    if (touched[name]) {
      const fieldError = config.validation.validateField(name, value)
      setErrors(prev => ({
        ...prev,
        [name]: fieldError || "",
      }))
      
      // Handle password confirmation validation
      if (name === "password" && formData.confirmPassword) {
        const confirmError = config.validation.validateField("confirmPassword", formData.confirmPassword)
        setErrors(prev => ({
          ...prev,
          confirmPassword: confirmError || "",
        }))
      }
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    const fieldName = e.target.name
    
    if (!file) {
      setFormData((prev: any) => ({
        ...prev,
        [fieldName]: null
      }))
      setSelectedFileName("")
      return
    }

    // Validate file before uploading
    const fieldError = config.validation.validateField(fieldName, file)
    if (fieldError) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: fieldError
      }))
      toast.error(fieldError)
      return
    }

    setSelectedFileName(file.name)
    setIsFileUploading(true)
    
    try {
      const uploadedFileUrl = await uploadFileToUploadThing(file)
      
      setFormData((prev: any) => ({
        ...prev,
        [fieldName]: uploadedFileUrl 
      }))
      
      toast.success("File uploaded successfully!")
      
      setErrors(prev => ({
        ...prev,
        [fieldName]: ""
      }))
      
    } catch (error) {
      console.error("File upload error:", error)
      toast.error("Failed to upload file. Please try again.")
      setSelectedFileName("")
      setFormData((prev: any) => ({
        ...prev,
        [fieldName]: null
      }))
    } finally {
      setIsFileUploading(false)
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target

    setTouched(prev => ({
      ...prev,
      [name]: true,
    }))

    const fieldError = config.validation.validateField(name, formData[name])
    setErrors(prev => ({
      ...prev,
      [name]: fieldError || "",
    }))
  }

  const handleFileBlur = (fieldName: string) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }))
    
    const fieldError = config.validation.validateField(fieldName, formData[fieldName])
    setErrors(prev => ({
      ...prev,
      [fieldName]: fieldError || ""
    }))
  }

  const togglePasswordVisibility = (fieldName: string) => {
    setPasswordVisibility(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const isValid = config.validation.validateForm(formData, setErrors, setTouched, config.validation.validateField)
    
    if (isValid) {
      setIsLoading(true)
      try {
        const response = await config.service.sendOtp(formData.email)
        
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
      const response = await config.service.sendOtp(formData.email)
      
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

  const verifyOtp = async () => {
    const otpString = otpValues.join("")
    
    if (otpString.length !== 4) {
      toast.error("Please enter a valid OTP")
      return
    }

    setIsLoading(true)
    try {
      const response = await config.service.verifyOtp(formData.email, otpString)
      
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
      // Prepare signup payload based on user type
      const signupPayload = {
        ...formData,
        role: config.userType,
      }

      // Remove confirmPassword from payload
      delete signupPayload.confirmPassword

      const response = await config.service.signup(signupPayload)
      
      if (response.success) {
        toast.success("Account created successfully!")
        setFormData(initializeFormData())
        navigate(config.loginRoute)
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
    if (isFileUploading) return
    fileInputRef.current?.click()
  }

  useEffect(() => {
    let interval: number | undefined
    
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
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [])

  useEffect(() => {
    if (showOtpModal && otpInputRefs[0].current) {
      otpInputRefs[0].current.focus()
    }
  }, [showOtpModal])

  const renderFormField = (field: FormField) => {
    if (field.isFile) {
      return (
        <div key={field.name} className={field.gridSpan === 'full' ? 'col-span-full' : ''}>
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
                : selectedFileName || field.placeholder
              }
            </span>
            <Upload size={16} className={`${isFileUploading ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          <input
            ref={fileInputRef}
            type="file"
            id={field.name}
            name={field.name}
            accept={field.accept}
            className="hidden"
            onChange={handleFileChange}
            onBlur={() => handleFileBlur(field.name)}
            disabled={isFileUploading}
          />
          {touched[field.name] && errors[field.name] && (
            <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
          )}
        </div>
      )
    }

    if (field.isPassword) {
      return (
        <div key={field.name} className={field.gridSpan === 'full' ? 'col-span-full' : 'relative'}>
          <FloatingLabelInput
            id={field.name}
            name={field.name}
            type={passwordVisibility[field.name] ? "text" : "password"}
            placeholder={field.placeholder}
            value={formData[field.name]}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched[field.name] ? errors[field.name] : undefined}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            onClick={() => togglePasswordVisibility(field.name)}
          >
            {passwordVisibility[field.name] ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      )
    }

    return (
      <div key={field.name} className={field.gridSpan === 'full' ? 'col-span-full' : ''}>
        <FloatingLabelInput
          id={field.name}
          name={field.name}
          type={field.type}
          placeholder={field.placeholder}
          value={formData[field.name]}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched[field.name] ? errors[field.name] : undefined}
        />
      </div>
    )
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
        className={`w-full md:w-2/5 bg-white p-8 flex items-center justify-center transition-opacity duration-1000 ease-in-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold mb-2">{config.title}</h1>
            <p className="text-gray-600">{config.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {config.fields.map(renderFormField)}
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
              onClick={config.service.handleGoogleLogin}
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
                <a href={config.loginRoute} className="text-[#f69938] hover:underline">
                  Log in
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Image */}
      <div
        className={`w-full md:w-3/5 bg-gray-100 transition-opacity duration-1000 ease-in-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="h-full w-full relative">
          <img 
            src={config.image.src} 
            alt={config.image.alt} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-white p-8">
            <h2 className="text-6xl font-bold mb-4 text-center">{config.image.overlayTitle}</h2>
            <p className="text-xl max-w-lg text-center">
              {config.image.overlaySubtitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReusableSignup
