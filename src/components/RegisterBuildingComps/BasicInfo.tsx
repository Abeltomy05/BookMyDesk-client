import type React from "react"
import { Upload, Clock, MapPin } from "lucide-react"
import type { BasicInfo } from "@/types/building-form.type"

interface BasicInfoStepProps {
  data: BasicInfo
  onChange: (data: BasicInfo) => void
}

export function BasicInfoStep({ data, onChange }: BasicInfoStepProps) {
  const handleInputChange = (field: keyof BasicInfo, value: any) => {
    onChange({ ...data, [field]: value })
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
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    onChange({ ...data, photos: [...data.photos, ...files] })
  }

  const removePhoto = (index: number) => {
    const newPhotos = data.photos.filter((_, i) => i !== index)
    onChange({ ...data, photos: newPhotos })
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        {/* <Building className="w-8 h-8 text-[#f69938] mx-auto mb-2" /> */}
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f69938] focus:border-transparent"
              placeholder="Enter building name"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Location *
            </label>
            <input
              type="text"
              value={data.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f69938] focus:border-transparent"
              placeholder="Enter full address"
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
                      ×
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
                  checked={data.openingHours.weekdays.is24_7}
                  onChange={(e) => handleOpeningHoursChange("weekdays", "is24_7", e.target.checked)}
                  className="w-4 h-4 text-[#f69938] border-gray-300 rounded focus:ring-[#f69938]"
                />
                <label htmlFor="weekdays-24-7" className="ml-2 text-sm text-gray-700">
                  24/7 Open
                </label>
              </div>
              {!data.openingHours.weekdays.is24_7 && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Open Time</label>
                    <input
                      type="time"
                      value={data.openingHours.weekdays.openTime}
                      onChange={(e) => handleOpeningHoursChange("weekdays", "openTime", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f69938]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Close Time</label>
                    <input
                      type="time"
                      value={data.openingHours.weekdays.closeTime}
                      onChange={(e) => handleOpeningHoursChange("weekdays", "closeTime", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f69938]"
                    />
                  </div>
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
                  checked={data.openingHours.weekends.is24_7}
                  onChange={(e) => handleOpeningHoursChange("weekends", "is24_7", e.target.checked)}
                  className="w-4 h-4 text-[#f69938] border-gray-300 rounded focus:ring-[#f69938]"
                />
                <label htmlFor="weekends-24-7" className="ml-2 text-sm text-gray-700">
                  24/7 Open
                </label>
              </div>
              {!data.openingHours.weekends.is24_7 && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Open Time</label>
                    <input
                      type="time"
                      value={data.openingHours.weekends.openTime}
                      onChange={(e) => handleOpeningHoursChange("weekends", "openTime", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f69938]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Close Time</label>
                    <input
                      type="time"
                      value={data.openingHours.weekends.closeTime}
                      onChange={(e) => handleOpeningHoursChange("weekends", "closeTime", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f69938]"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
