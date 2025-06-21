import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { vendorService } from "@/services/vendorServices"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { uploadFileToUploadThing } from "@/utils/uploadThing/FileUploader"

const IdProofUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [isDragOver, setIsDragOver] = useState<boolean>(false)

  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const processFile = (selectedFile: File) => {
    setFile(selectedFile)

    // Create preview for image files
    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreview(event.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)
    } else {
      setPreview(null)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)

    const droppedFiles = e.dataTransfer.files
    if (droppedFiles.length > 0) {
      const droppedFile = droppedFiles[0]
      
      // Check file type
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf']
      if (allowedTypes.includes(droppedFile.type)) {
        // Check file size (10MB limit)
        if (droppedFile.size <= 10 * 1024 * 1024) {
          processFile(droppedFile)
        } else {
          alert('File size must be less than 10MB')
        }
      } else {
        alert('Please upload a PNG, JPG, or PDF file')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setIsLoading(true);
    try {
        let cloudinaryUrl = '';
        if (file) {
            cloudinaryUrl = await uploadFileToUploadThing(file);
        }
      const response = await vendorService.uploadIdProof(cloudinaryUrl);
      if(response.success){
        toast.success("Document uploaded successfully!. Please wait for verification.")
        navigate("/vendor/login")
        setFile(null)
        setPreview(null)
      }else{
        toast.error("Failed to upload document. Please try again.")
        console.error("Upload failed:", response.message)
      }
    } catch (error) {
      toast.error("Error uploading document. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left side - Image */}
      <motion.div
        className="w-full md:w-3/5 flex items-center justify-center"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.img
          src="https://res.cloudinary.com/dnivctodr/image/upload/v1748162030/desk3_w1jkqb.jpg"
          alt="ID Verification"
          className="w-full h-full object-cover"
          initial={{ scale: 0.9 }}
          animate={{ scale: isVisible ? 1 : 0.9 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        />
      </motion.div>

      {/* Right side - Form (40% width) */}
      <motion.div
  className="w-full md:w-2/5 flex items-center justify-center p-8 bg-white"
  initial={{ opacity: 0, x: 50 }}
  animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 50 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
>
  <div className="w-full max-w-md">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Upload Document</h1>
      <p className="text-gray-600 mb-8">Complete your registration by uploading your ID proof</p>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">ID Document</label>
          <div
            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-all duration-300 ${
              isDragOver
                ? "bg-[#f69938]/10 scale-105"
                : "border-gray-300 hover:border-[#f69938]"
            }`}
            style={isDragOver ? { borderColor: "#f69938" } : undefined}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="space-y-1 text-center">
              {preview ? (
                <div className="relative">
                  <img
                    src={preview || "/placeholder.svg"}
                    alt="Document preview"
                    className="mx-auto h-32 w-auto rounded-md"
                  />
                  <div className="mt-2 text-sm text-gray-600">{file?.name}</div>
                </div>
              ) : (
                <>
                  <motion.svg
                    className={`mx-auto h-12 w-12 transition-colors duration-300`}
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                    animate={{ scale: isDragOver ? 1.1 : 1 }}
                    transition={{ duration: 0.2 }}
                    style={{ color: isDragOver ? "#f69938" : "#9ca3af" }} // gray-400 hex
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-[#f69938] hover:text-[#db8500] focus:outline-none custom-focus-ring"
                        >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  {isDragOver && (
                    <motion.p
                      className="text-sm font-medium"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ color: "#f69938" }}
                    >
                      Drop your file here!
                    </motion.p>
                  )}
                </>
              )}
              <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={!file || isLoading}
            onClick={handleSubmit}
             className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                !file || isLoading
                ? "bg-[#f69938]/50 cursor-not-allowed"
                : "bg-[#f69938] hover:bg-[#db8500]"
            } focus:outline-none custom-focus-ring`}
            >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                Processing...
              </>
            ) : (
              "Complete Registration"
            )}
          </button>
        </div>
      </div>
    </motion.div>
  </div>
</motion.div>

    </div>
  )
}

export default IdProofUpload