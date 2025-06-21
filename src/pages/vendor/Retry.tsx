import type React from "react"
import { useState, useEffect } from "react"
import { Upload,Loader2 } from "lucide-react"
import FloatingLabelInput from "@/components/ui/Floating-label"
import Loading from "@/components/Loadings/Loading"
import {type VendorRetryFormData, type VendorRetryFormErrors, validateVendorRetryField } from "@/utils/validations/retry-vendor.validation"
import { useParams } from "react-router-dom"
import toast from "react-hot-toast"
import { vendorService } from "@/services/vendorServices"
import { uploadImageCloudinary } from "@/utils/cloudinary/cloudinary"
import { uploadFileToUploadThing } from "@/utils/uploadThing/FileUploader"


const VendorRetryForm: React.FC= () => {
  const {token} = useParams();
  const [email,setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadedIdProofUrl, setUploadedIdProofUrl] = useState<string | null>(null)
  const [formData, setFormData] = useState<VendorRetryFormData>({
    phoneNumber: "",
    companyName: "",
    companyAddress: "",
    idProof: null,
  })
  const [errors, setErrors] = useState<VendorRetryFormErrors>({})

  useEffect(() => {
      if (!token) {
        toast.error("No token provided")
        setLoading(false)
        return
      }
    const fetchVendorDetails = async () => {
      try {
        setLoading(true)
        const response = await vendorService.getRetrydata(token)

        if(!response.success) {
          toast.error("Invalid or expired token")
        }

        setEmail(response.data.email || "");
        setUploadedIdProofUrl(response.data.idProof || null)
        setFormData({
          phoneNumber: response.data.phoneNumber || "",
          companyName: response.data.companyName || "",
          companyAddress: response.data.companyAddress || "",
          idProof: null,
        })
      } catch (err) {
         toast.error("Failed to load vendor details")
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchVendorDetails()
    } else {
       toast.error("No token provided")
       setLoading(false)
    }
  }, [token])


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name in errors) {
    setErrors((prev) => ({ ...prev, [name]: undefined }))
   }
  }

const handleFileChange = (file: File | null) => {
  setUploadedIdProofUrl(null) 
  setFormData((prev) => ({ ...prev, idProof: file }))
}

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    handleFileChange(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      handleFileChange(file)
    }
  }

 const validateForm = (): boolean => {
  const validationErrors = validateVendorRetryField(formData)
  setErrors(validationErrors)
  return Object.keys(validationErrors).length === 0
}


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSubmitting(true)
    try {
         let cloudinaryUrl = '';
        if (formData.idProof) {
            cloudinaryUrl = await uploadFileToUploadThing(formData.idProof);
        }
      if (!token) {
        toast.error("No token found in URL")
        return
        }
      const body = {
        email,
        phone: formData.phoneNumber,
        companyName: formData.companyName,
        companyAddress: formData.companyAddress,
        idProof: cloudinaryUrl
      };

      const response = await vendorService.retryRegistration(body)

      if (response.success) {
        toast.success(response.message || "Retry application submitted successfully!")
        setFormData({
            phoneNumber: "",
            companyName: "",
            companyAddress: "",
            idProof: null,
        })
      }else{
         toast.error("Failed to submit retry application")
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit application")
    } finally {
      setSubmitting(false)
    }
  }


  return (
    <div className="min-h-screen bg-gray-50">
      {loading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="w-75 h-75">
            <Loading />
          </div>
        </div>
      )}
      <div className="flex min-h-screen">
        {/* Left side - Image */}
        <div className="w-3/5">
          <img
            src="https://res.cloudinary.com/dnivctodr/image/upload/v1748162013/desk1_s2jcu9.jpg"
            alt="Vendor Registration"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right side - Form */}
        <div className="w-2/5 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Retry Application</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Phone Number */}
              <FloatingLabelInput
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="Phone Number *"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                error={errors.phoneNumber}
              />

              {/* Company Name */}
              <FloatingLabelInput
                id="companyName"
                name="companyName"
                type="text"
                placeholder="Company Name *"
                value={formData.companyName}
                onChange={handleInputChange}
                error={errors.companyName}
              />

              {/* Company Address */}
              <div className="relative">
                <div className="relative">
                  <textarea
                    id="companyAddress"
                    name="companyAddress"
                    value={formData.companyAddress}
                    onChange={handleInputChange}
                    rows={3}
                    className={`
                      block w-full px-4 py-3 text-gray-700 bg-white border rounded-lg
                      transition-all duration-300 ease-in-out
                      focus:outline-none
                      ${errors.companyAddress ? "border-red-500" : formData.companyAddress ? "border-[#f69938]" : "border-gray-300"}
                      ${formData.companyAddress ? "pt-6 pb-2" : "py-4"}
                    `}
                    placeholder={formData.companyAddress ? "" : "Company Address *"}
                  />
                  {formData.companyAddress && (
                    <span
                      className={`
                        absolute text-xs font-medium px-1 left-3 -top-[0.5px] bg-white
                        transform -translate-y-1/2 pointer-events-none
                        ${errors.companyAddress ? "text-red-500" : "text-[#f69938]"}
                      `}
                    >
                      Company Address *
                    </span>
                  )}
                </div>
                {errors.companyAddress && <p className="mt-1 text-sm text-red-500">{errors.companyAddress}</p>}
              </div>

              {/* ID Proof Upload */}
              <div>
                <label htmlFor="idProof" className="block text-sm font-medium text-gray-700 mb-2">
                  ID Proof *
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    isDragOver
                      ? "border-[#f69938] bg-orange-50"
                      : errors.idProof
                        ? "border-red-500"
                        : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="idProof"
                    name="idProof"
                    onChange={handleFileInputChange}
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <Upload className={`mx-auto h-12 w-12 mb-4 ${isDragOver ? "text-[#f69938]" : "text-gray-400"}`} />
                    <p className="text-sm text-gray-600 z-0">
                      {formData.idProof ? (
                        formData.idProof.name
                      ) : uploadedIdProofUrl ? (
                        <a
                          href={uploadedIdProofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#f69938] underline pointer-events-auto z-20 relative"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View previously uploaded ID Proof
                        </a>
                      ) : (
                        "Upload a government issued ID Proof"
                      )}
                    </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Drag and drop or click to upload • JPEG, PNG, or PDF (max 5MB)
                  </p>
                </div>
                {errors.idProof && <p className="mt-1 text-sm text-red-500">{errors.idProof}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#f69938] text-white py-2 px-4 rounded-md hover:bg-[#e5873a] focus:outline-none focus:ring-2 focus:ring-[#f69938] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Submitting...</span>
                  </div>
                ) : (
                  "Retry"
                )}
              </button>
            </form>
             <p className="mt-4 text-center text-xs text-gray-600">
              Go back to login?{" "}
              <a href='/vendor/login' className="font-medium text-[#f69938] hover:underline transition-colors duration-150">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VendorRetryForm
