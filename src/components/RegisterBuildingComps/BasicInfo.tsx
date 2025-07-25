import type React from "react"
import { Upload, Clock, MapPin, AlertCircle } from "lucide-react"
import type { UpdatedBasicInfo } from "@/types/building-form.type"
import { validateBasicInfo, getFieldError, hasFieldError, type ValidationErrors } from "@/utils/validations/basic-info-register-building.validation"
import { useEffect, useState } from "react"
import { LocationInput } from "../ReusableComponents/LocationInput"

interface BasicInfoStepProps {
  data: UpdatedBasicInfo
  onChange: (data: UpdatedBasicInfo) => void
  onValidationChange?: (isValid: boolean) => void
}

export function BasicInfoStep({ data, onChange, onValidationChange  }: BasicInfoStepProps) {
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})


    useEffect(() => {
    const validationResult = validateBasicInfo({
      ...data,
      location: data.location?.displayName || ''
    })
    setErrors(validationResult.errors)
    onValidationChange?.(validationResult.isValid)
  }, [data, onValidationChange])

  
  const handleInputChange = (field: keyof UpdatedBasicInfo, value: any) => {
    onChange({ ...data, [field]: value })
    setTouched(prev => ({ ...prev, [field]: true }))
  }

 const handleOpeningHoursChange = (period: "weekdays" | "weekends", field: string, value: any) => {
    onChange({
      ...data,
      openingHours: {
        ...data.openingHours,
        [period]: {
          ...data.openingHours[period],
          [field]: value,
        },
      },
    })
     setTouched(prev => ({ ...prev, [`openingHours.${period}.${field}`]: true }))
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    onChange({ ...data, photos: [...data.photos, ...files] })
  }

  const removePhoto = (index: number) => {
    const newPhotos = data.photos.filter((_, i) => i !== index)
    onChange({ ...data, photos: newPhotos })
  }

  const handleBlur = (fieldPath: string) => {
    setTouched(prev => ({ ...prev, [fieldPath]: true }))
  }

   const shouldShowError = (fieldPath: string): boolean => {
    return touched[fieldPath] && hasFieldError(errors, fieldPath)
  }

   const getErrorMessage = (fieldPath: string): string | undefined => {
    return shouldShowError(fieldPath) ? getFieldError(errors, fieldPath) : undefined
  }



 return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
        <p className="text-gray-600">Tell us about your building</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Building Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Building Name *</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              onBlur={() => handleBlur("name")}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                shouldShowError("name")
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-[#f69938]"
              }`}
              placeholder="Enter building name"
            />
            {getErrorMessage("name") && (
              <div className="mt-1 flex items-center text-sm text-red-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                {getErrorMessage("name")}
              </div>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Location *
            </label>
            <LocationInput
              value={data.location}
              onChange={(location) => handleInputChange("location", location)}
              onBlur={() => handleBlur("location")}
              error={shouldShowError("location") ? "Location is required" : undefined}
              placeholder="Search for your building location..."
            />
          </div>


          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Building Photos</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#f69938] transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="inline-flex items-center px-4 py-2 bg-[#f69938] text-white rounded-md hover:bg-[#e5873a] cursor-pointer transition-colors"
              >
                Choose Files
              </label>
            </div>

            {data.photos.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {data.photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Building photo ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Opening Hours */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Opening Hours
            </h3>

            {/* Weekdays */}
            <div className="bg-gray-50 p-4 rounded-lg mt-2">
              <h4 className="font-medium text-gray-700 mb-3">Monday - Friday</h4>
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  id="weekdays-24-7"
                  checked={data.openingHours.weekdays.is24Hour}
                  onChange={(e) => handleOpeningHoursChange("weekdays", "is24Hour", e.target.checked)}
                  className="w-4 h-4 text-[#f69938] border-gray-300 rounded focus:ring-[#f69938]"
                />
                <label htmlFor="weekdays-24-7" className="ml-2 text-sm text-gray-700">
                  24/7 Open
                </label>
              </div>
              {!data.openingHours.weekdays.is24Hour && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Open Time</label>
                      <input
                        type="time"
                        value={data.openingHours.weekdays.openTime}
                        onChange={(e) => handleOpeningHoursChange("weekdays", "openTime", e.target.value)}
                        onBlur={() => handleBlur("openingHours.weekdays.openTime")}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 ${
                          shouldShowError("openingHours.weekdays.openTime")
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-[#f69938]"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Close Time</label>
                      <input
                        type="time"
                        value={data.openingHours.weekdays.closeTime}
                        onChange={(e) => handleOpeningHoursChange("weekdays", "closeTime", e.target.value)}
                        onBlur={() => handleBlur("openingHours.weekdays.closeTime")}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 ${
                          shouldShowError("openingHours.weekdays.closeTime")
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-[#f69938]"
                        }`}
                      />
                    </div>
                  </div>
                  {/* Show validation errors for weekdays */}
                  {getErrorMessage("openingHours.weekdays.openTime") && (
                    <div className="flex items-center text-sm text-red-600">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {getErrorMessage("openingHours.weekdays.openTime")}
                    </div>
                  )}
                  {getErrorMessage("openingHours.weekdays.closeTime") && (
                    <div className="flex items-center text-sm text-red-600">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {getErrorMessage("openingHours.weekdays.closeTime")}
                    </div>
                  )}
                  {getErrorMessage("openingHours.weekdays.timeRange") && (
                    <div className="flex items-center text-sm text-red-600">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {getErrorMessage("openingHours.weekdays.timeRange")}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Weekends */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-3">Saturday - Sunday</h4>
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  id="weekends-24-7"
                  checked={data.openingHours.weekends.is24Hour}
                  onChange={(e) => handleOpeningHoursChange("weekends", "is24Hour", e.target.checked)}
                  className="w-4 h-4 text-[#f69938] border-gray-300 rounded focus:ring-[#f69938]"
                />
                <label htmlFor="weekends-24-7" className="ml-2 text-sm text-gray-700">
                  24/7 Open
                </label>
              </div>
              {!data.openingHours.weekends.is24Hour && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Open Time</label>
                      <input
                        type="time"
                        value={data.openingHours.weekends.openTime}
                        onChange={(e) => handleOpeningHoursChange("weekends", "openTime", e.target.value)}
                        onBlur={() => handleBlur("openingHours.weekends.openTime")}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 ${
                          shouldShowError("openingHours.weekends.openTime")
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-[#f69938]"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Close Time</label>
                      <input
                        type="time"
                        value={data.openingHours.weekends.closeTime}
                        onChange={(e) => handleOpeningHoursChange("weekends", "closeTime", e.target.value)}
                        onBlur={() => handleBlur("openingHours.weekends.closeTime")}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 ${
                          shouldShowError("openingHours.weekends.closeTime")
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-[#f69938]"
                        }`}
                      />
                    </div>
                  </div>
                  {/* Show validation errors for weekends */}
                  {getErrorMessage("openingHours.weekends.openTime") && (
                    <div className="flex items-center text-sm text-red-600">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {getErrorMessage("openingHours.weekends.openTime")}
                    </div>
                  )}
                  {getErrorMessage("openingHours.weekends.closeTime") && (
                    <div className="flex items-center text-sm text-red-600">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {getErrorMessage("openingHours.weekends.closeTime")}
                    </div>
                  )}
                  {getErrorMessage("openingHours.weekends.timeRange") && (
                    <div className="flex items-center text-sm text-red-600">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {getErrorMessage("openingHours.weekends.timeRange")}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
