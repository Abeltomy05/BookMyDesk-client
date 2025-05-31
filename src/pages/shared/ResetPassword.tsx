import type React from "react"
import { useState } from "react"
import FloatingLabelInput from "@/components/ui/Floating-label"
import { validateResetPasswordForm, type ResetPasswordValidationErrors } from "@/utils/validations/auth-schema.validation"
import { useParams,useNavigate  } from "react-router-dom"
import { clientService } from "@/services/clientServices"
import toast from "react-hot-toast"

const ResetPasswordForm: React.FC = () => {
  const {token} = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ResetPasswordValidationErrors>({
    password: "",
    confirmPassword: "",
  })

  const validateForm = () => {
    const formData = {
        password,
        confirmPassword,
    }
    const validationErrors = validateResetPasswordForm(formData);

    setErrors(validationErrors)
     return Object.keys(validationErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      setIsSubmitting(true)
      
      try {
        const response = await clientService.resetPassword(token as string, password)
        
        if (response.success) {
           toast.success("Password reset successful!")
          setTimeout(() => {
            if(response.data === "client"){
              navigate("/login")
            }else if(response.data === "vendor"){
              navigate("/vendor/login")
            }
          }, 1500)
        } else {
          toast.error(response.message || "Failed to reset password. Please try again.")
        }
      } catch (error) {
        toast.error("An unexpected error occurred. Please try again later.")
        console.error("Password reset error:", error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
         <div className="hidden md:block md:w-[60%]">
            <div className="h-full w-full bg-gray-100">
                <img
                src="https://res.cloudinary.com/dnivctodr/image/upload/v1748162030/desk3_w1jkqb.jpg"
                alt="Reset password illustration"
                className="h-full w-full object-cover"
                />
           </div>
        </div>

    <div className="flex w-full items-center justify-center px-6 md:w-[40%] md:px-10 lg:px-16">
        <div className="w-full max-w-md space-y-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Reset Your Password</h1>
        <p className="text-gray-600">Please enter your new password below</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FloatingLabelInput
          id="password"
          name="password"
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        <FloatingLabelInput
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
        />

        <button
          type="submit"
          className="w-full py-3 px-4 bg-[#f69938] text-white rounded-lg hover:bg-[#e58828] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#f69938] focus:ring-opacity-50"
        >
          Reset Password
        </button>
      </form>
      </div>
    </div>
    </div>
  )
}

export default ResetPasswordForm
