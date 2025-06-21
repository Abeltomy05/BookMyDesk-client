import type React from "react"
import { useState, useEffect } from "react"
import { Clock, MapPin, Mail, Phone, AlertCircle } from "lucide-react"
import { LocationInput } from "@/components/ReusableComponents/LocationInput"
import type { Building } from "@/types/view&editBuilding"
import { validateBasicInfo,  type ValidationErrors } from "@/utils/validations/edit-building/basic-info.validation"

interface OpeningHours {
  is24Hour: boolean
  openTime: string
  closeTime: string
}

interface BasicInfoStepProps {
  building: Building
  setBuilding: React.Dispatch<React.SetStateAction<Building | null>>
  onValidationChange?: (isValid: boolean) => void 
}

export function BasicInfoStep({ building, setBuilding, onValidationChange }: BasicInfoStepProps) {
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const updateBuilding = (field: keyof Building, value: any) => {
    setBuilding((prev) => {
      if (!prev) return prev; 
      return {
        ...prev,
        [field]: value,
      };
    });
    

    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const updateOpeningHours = (period: "weekdays" | "weekends", field: keyof OpeningHours, value: any) => {
    setBuilding((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        openingHours: {
          ...prev.openingHours,
          [period]: {
            ...prev.openingHours[period],
            [field]: value,
          },
        },
      };
    });
    
    setTouched(prev => ({ ...prev, [`${period}OpeningHours`]: true }))
  }

  const handlePhoneChange = (value: string) => {
     const cleanValue = value.replace(/\D/g, '').slice(0, 10)
    updateBuilding("phone", cleanValue)
  }

  const handleFieldBlur = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }))
  }

  useEffect(() => {
    if (building) {
      const validation = validateBasicInfo(building)
      setValidationErrors(validation.errors)
      
      if (onValidationChange) {
        onValidationChange(validation.isValid)
      }
    }
  }, [building, onValidationChange])

  const getFieldError = (fieldName: string) => {
    return touched[fieldName] ? validationErrors[fieldName as keyof ValidationErrors] : undefined
  }

  const ErrorMessage = ({ error }: { error?: string }) => {
    if (!error) return null
    return (
      <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
        <AlertCircle className="w-4 h-4" />
        <span>{error}</span>
      </div>
    )
  }

  const inputClassName = (fieldName: string) => {
    const hasError = getFieldError(fieldName)
    return `w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-lg ${
      hasError 
        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
        : 'border-gray-300 focus:ring-[#f69938] focus:border-transparent'
    }`
  }

  const timeInputClassName = (fieldName: string) => {
    const hasError = getFieldError(fieldName)
    return `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
      hasError 
        ? 'border-red-300 focus:ring-red-500' 
        : 'border-gray-300 focus:ring-[#f69938]'
    }`
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
        <p className="text-gray-600">Enter the fundamental details about your building</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Building Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={building.buildingName || ''}
              onChange={(e) => updateBuilding("buildingName", e.target.value)}
              onBlur={() => handleFieldBlur("buildingName")}
              className={inputClassName("buildingName")}
              placeholder="Enter building name"
            />
            <ErrorMessage error={getFieldError("buildingName")} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <MapPin className="w-4 h-4 inline mr-2" />
              Location <span className="text-red-500">*</span>
            </label>
            <LocationInput
              value={building.location || null}
              onChange={(location) => updateBuilding("location", location)}
              placeholder="Search for building location..."
              onBlur={() => handleFieldBlur("location")}
              className={getFieldError("location") ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
            />
            <ErrorMessage error={getFieldError("location")} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Mail className="w-4 h-4 inline mr-2" />
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={building.email || ''}
                onChange={(e) => updateBuilding("email", e.target.value)}
                onBlur={() => handleFieldBlur("email")}
                className={inputClassName("email").replace('text-lg', '')}
                placeholder="contact@building.com"
              />
              <ErrorMessage error={getFieldError("email")} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={building.phone || ''}
                onChange={(e) => handlePhoneChange(e.target.value)}
                onBlur={() => handleFieldBlur("phone")}
                className={inputClassName("phone").replace('text-lg', '')}
                placeholder="phone number"
                maxLength={14} // (XXX) XXX-XXXX format
              />
              <ErrorMessage error={getFieldError("phone")} />
            </div>
          </div>
        </div>

        {/* Right Column - Opening Hours */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#f69938]" />
            Opening Hours <span className="text-red-500">*</span>
          </h3>
          <div className="space-y-6">
            {["weekdays", "weekends"].map((period) => {
              const periodKey = `${period}OpeningHours` as keyof ValidationErrors
              const hasError = getFieldError(periodKey)
              
              return (
                <div key={period} className={`bg-gray-50 rounded-xl p-6 border ${
                  hasError ? 'border-red-300' : 'border-gray-200'
                }`}>
                  <h4 className="font-bold text-gray-800 mb-4 capitalize text-base">
                    {period} <span className="text-red-500">*</span>
                  </h4>
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={building.openingHours?.[period as keyof typeof building.openingHours]?.is24Hour || false}
                        onChange={(e) => {
                          updateOpeningHours(period as "weekdays" | "weekends", "is24Hour", e.target.checked)
                        }}
                        className="mr-3 w-4 h-4 text-[#f69938] focus:ring-[#f69938] rounded"
                      />
                      <span className="font-medium text-gray-700">24 Hour Open</span>
                    </label>
                    {!building.openingHours?.[period as keyof typeof building.openingHours]?.is24Hour && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Open Time <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="time"
                            value={building.openingHours?.[period as keyof typeof building.openingHours]?.openTime || ''}
                            onChange={(e) =>
                              updateOpeningHours(period as "weekdays" | "weekends", "openTime", e.target.value)
                            }
                            onBlur={() => handleFieldBlur(periodKey)}
                            className={timeInputClassName(periodKey)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Close Time <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="time"
                            value={building.openingHours?.[period as keyof typeof building.openingHours]?.closeTime || ''}
                            onChange={(e) =>
                              updateOpeningHours(period as "weekdays" | "weekends", "closeTime", e.target.value)
                            }
                            onBlur={() => handleFieldBlur(periodKey)}
                            className={timeInputClassName(periodKey)}
                          />
                        </div>
                      </div>
                    )}
                    <ErrorMessage error={getFieldError(periodKey)} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}