import { Phone, Mail, Car, Bike, TreePine, Waves, Dumbbell, Coffee, Wifi, Wind } from "lucide-react"
import type { Facilities, ContactInfo } from "@/types/building-form.type"  

interface FacilitiesContactStepProps {
  facilities: Facilities
  contactInfo: ContactInfo
  onFacilitiesChange: (facilities: Facilities) => void
  onContactChange: (contactInfo: ContactInfo) => void
}

export function FacilitiesContactStep({
  facilities,
  contactInfo,
  onFacilitiesChange,
  onContactChange,
}: FacilitiesContactStepProps) {
  const facilityOptions = [
    { key: "bicycleParking", label: "Bicycle Parking", icon: Bike },
    { key: "normalParking", label: "Parking Lot", icon: Car },
    { key: "garden", label: "Garden", icon: TreePine },
    { key: "swimmingPool", label: "Pool", icon: Waves },
    { key: "gym", label: "Gym", icon: Dumbbell },
    { key: "cafeteria", label: "Cafeteria", icon: Coffee },
    { key: "wifi", label: "WiFi", icon: Wifi },
    { key: "airConditioning", label: "AC", icon: Wind },
  ]

  const handleFacilityChange = (key: keyof Facilities, checked: boolean) => {
    onFacilitiesChange({ ...facilities, [key]: checked })
  }

  const handleContactChange = (field: keyof ContactInfo, value: string) => {
    onContactChange({ ...contactInfo, [field]: value })
  }

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
        {facilityOptions.map(({ key, label, icon: Icon }) => (
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
        ))}
      </div>
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
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f69938] focus:border-transparent text-sm"
        placeholder="Enter phone number"
      />
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
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f69938] focus:border-transparent text-sm"
        placeholder="Enter email address"
      />
    </div>
  </div>
    </div>
  </div>
</div>

  )
}