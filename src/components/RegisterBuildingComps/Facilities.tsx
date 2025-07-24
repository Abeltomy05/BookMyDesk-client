import { Phone, Mail, Car, Bike, TreePine, Waves, Dumbbell, Coffee, Wifi, Wind, AlertCircle, Printer, Users, Video, Shield, Zap, BookOpen, Calendar, Headphones } from "lucide-react"
import type { Facilities, ContactInfo } from "@/types/building-form.type"
import { validateContactInfo, getContactFieldError, hasContactFieldError, type ContactValidationErrors } from "@/utils/validations/facilities-register-building.validation"
import { useEffect, useState } from "react"

interface FacilitiesContactStepProps {
  facilities: Facilities
  contactInfo: ContactInfo
  onFacilitiesChange: (facilities: Facilities) => void
  onContactChange: (contactInfo: ContactInfo) => void
  onValidationChange?: (isValid: boolean) => void
}

export function FacilitiesContactStep({
  facilities,
  contactInfo,
  onFacilitiesChange,
  onContactChange,
  onValidationChange,
}: FacilitiesContactStepProps) {
  const [errors, setErrors] = useState<ContactValidationErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [showAllFacilities, setShowAllFacilities] = useState(false)

  // Validation effect
  useEffect(() => {
    const validationResult = validateContactInfo(contactInfo)
    setErrors(validationResult.errors)
    onValidationChange?.(validationResult.isValid)
  }, [contactInfo, onValidationChange])

  const basicFacilityOptions = [
    { key: "Bicycle Parking", label: "Bicycle Parking", icon: Bike },
    { key: "Normal Parking", label: "Normal Parking", icon: Car },
    { key: "Garden", label: "Garden", icon: TreePine },
    { key: "Pool", label: "Pool", icon: Waves },
    { key: "Gym", label: "Gym", icon: Dumbbell },
    { key: "Cafeteria", label: "Cafeteria", icon: Coffee },
    { key: "WiFi", label: "WiFi", icon: Wifi },
    { key: "AC", label: "AC", icon: Wind },
  ]

  const additionalFacilityOptions = [
    { key: "Printing Services", label: "Printing Services", icon: Printer },
    { key: "Wheel Chair", label: "Wheel Chair", icon: Users },
    { key: "Video Conferencing", label: "Video Conferencing", icon: Video },
    { key: "Security", label: "Security", icon: Shield },
    { key: "Power Backup", label: "Power Backup", icon: Zap },
    { key: "Library", label: "Library", icon: BookOpen },
    { key: "Event Space", label: "Event Space", icon: Calendar },
    { key: "Phone Booth", label: "Phone Booth", icon: Headphones },
  ]

  const handleFacilityChange = (key: keyof Facilities, checked: boolean) => {
    onFacilitiesChange({ ...facilities, [key]: checked })
  }

  const handleContactChange = (field: keyof ContactInfo, value: string) => {
    onContactChange({ ...contactInfo, [field]: value })
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const handleBlur = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }))
  }

  const shouldShowError = (fieldName: keyof ContactValidationErrors): boolean => {
    return touched[fieldName] && hasContactFieldError(errors, fieldName)
  }

  const getErrorMessage = (fieldName: keyof ContactValidationErrors): string | undefined => {
    return shouldShowError(fieldName) ? getContactFieldError(errors, fieldName) : undefined
  }

  const renderFacilityOption = ({ key, label, icon: Icon }: { key: string; label: string; icon: any }) => (
    <div
      key={key}
      className={`p-2 border rounded-lg cursor-pointer transition-all text-center ${
        facilities[key as keyof Facilities]
          ? "border-[#f69938] bg-orange-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
      onClick={() => handleFacilityChange(key as keyof Facilities, !facilities[key as keyof Facilities])}
    >
      <Icon
        className={`w-5 h-5 mx-auto mb-1 ${
          facilities[key as keyof Facilities] ? "text-[#f69938]" : "text-gray-400"
        }`}
      />
      <span
        className={`text-xs font-medium block ${
          facilities[key as keyof Facilities] ? "text-[#f69938]" : "text-gray-600"
        }`}
      >
        {label}
      </span>
      <input
        type="checkbox"
        checked={facilities[key as keyof Facilities]}
        onChange={() => {}}
        className="mt-1 w-3 h-3 text-[#f69938] border-gray-300 rounded focus:ring-[#f69938]"
      />
    </div>
  )


  return (
    <div className="space-y-4">
      {/* Compact Header */}
      <div className="text-center mb-3">
        <div className="w-8 h-8 bg-[#f69938] rounded-full flex items-center justify-center mx-auto mb-2">
          <Coffee className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Facilities & Contact</h2>
        <p className="text-gray-600 text-sm">Select facilities and provide contact info</p>
      </div>

      {/* New Vertical Layout */}
      <div className="space-y-6">
        {/* Facilities Section */}
        <div>
          <h3 className="text-base font-medium text-gray-900 mb-3">Available Facilities</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {basicFacilityOptions.map(renderFacilityOption)}
          </div>

          {!showAllFacilities && (
            <div className="text-center mt-3">
              <button
                type="button"
                onClick={() => setShowAllFacilities(true)}
                className="text-[#f69938] hover:text-orange-600 text-sm font-medium underline focus:outline-none focus:ring-2 focus:ring-[#f69938] focus:ring-offset-2 rounded"
              >
                View More
              </button>
            </div>
          )}

           {showAllFacilities && (
            <div className="mt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {additionalFacilityOptions.map(renderFacilityOption)}
              </div>
              
              {/* Show Less Link */}
              <div className="text-center mt-3">
                <button
                  type="button"
                  onClick={() => setShowAllFacilities(false)}
                  className="text-gray-600 hover:text-gray-700 text-sm font-medium underline focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded"
                >
                  Show Less
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Contact Information Section */}
        <div>
          <h3 className="text-base font-medium text-gray-900 mb-3">Contact Information</h3>

          {/* Make inputs side by side */}
          <div className="flex gap-x-4">
            {/* Phone Input */}
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Phone className="w-3 h-3 inline mr-1" />
                Phone Number *
              </label>
              <input
                type="tel"
                value={contactInfo.phone}
                onChange={(e) => handleContactChange("phone", e.target.value)}
                onBlur={() => handleBlur("phone")}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:border-transparent text-sm ${
                  shouldShowError("phone")
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-[#f69938]"
                }`}
                placeholder="Enter phone number"
              />
              {getErrorMessage("phone") && (
                <div className="mt-1 flex items-center text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {getErrorMessage("phone")}
                </div>
              )}
            </div>

            {/* Email Input */}
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Mail className="w-3 h-3 inline mr-1" />
                Email Address *
              </label>
              <input
                type="email"
                value={contactInfo.email}
                onChange={(e) => handleContactChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:border-transparent text-sm ${
                  shouldShowError("email")
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-[#f69938]"
                }`}
                placeholder="Enter email address"
              />
              {getErrorMessage("email") && (
                <div className="mt-1 flex items-center text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {getErrorMessage("email")}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}