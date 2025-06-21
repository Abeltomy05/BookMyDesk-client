import type React from "react"
import { useState, type FormEvent } from "react"
import { motion } from "framer-motion"
import { clientService } from "@/services/clientServices"
import toast from "react-hot-toast"
import { useNavigate, useParams } from "react-router-dom"

const ForgotPasswordPage: React.FC = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)
    try {
     const response = await clientService.forgotPassword(email);

       if (response.success) {
        setIsSubmitted(true)
        toast.success("Password reset link sent to your email.")
      } else {
        toast.error(response.message || "Failed to send reset link. Please try again.")
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNavigateLogin = ()=>{
      if(role === "client"){
         console.log(role)
           navigate("/login")
      }else if(role === "vendor"){
        console.log(role)
          navigate("/vendor/login")
      }
  }
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* image */}
      <div className="hidden md:block md:w-[60%]">
        <div className="h-full w-full bg-gray-100">
          <img
            src="https://res.cloudinary.com/dnivctodr/image/upload/v1748162013/desk1_s2jcu9.jpg"
            alt="Reset password illustration"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Form */}
      <div className="flex w-full items-center justify-center px-6 md:w-[40%] md:px-10 lg:px-16">
        <div className="w-full max-w-md space-y-8 py-12">
          {!isSubmitted ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Forgot your password?</h1>
                <p className="mt-3 text-gray-600">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-[#f69938] focus:outline-none focus:ring-2 focus:ring-[#f69938] focus:ring-opacity-50 ${
                        error ? "border-red-500" : ""
                      }`}
                      placeholder="Enter your email"
                    />
                    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative flex w-full justify-center rounded-md bg-[#f69938] px-4 py-3 text-sm font-medium text-white hover:bg-[#e58828] focus:outline-none focus:ring-2 focus:ring-[#f69938] focus:ring-offset-2 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg
                          className="mr-2 h-4 w-4 animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center">
                <a onClick={handleNavigateLogin} className="text-sm font-medium text-[#f69938] hover:text-[#e58828]">
                  Back to login
                </a>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="mt-4 text-2xl font-bold text-gray-900">Check your email</h2>
              <p className="mt-2 text-gray-600">
                We've sent a password reset link to <span className="font-medium">{email}</span>
              </p>
              <p className="mt-4 text-sm text-gray-500">
                Didn't receive the email? Check your spam folder or{" "}
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="font-medium text-[#f69938] hover:text-[#e58828]"
                >
                  try again
                </button>
              </p>
              <div className="mt-6">
                <a href="/login" className="text-sm font-medium text-[#f69938] hover:text-[#e58828]">
                  Back to login
                </a>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
