import { ChevronDown, ChevronUp, Plus, Trash2, DollarSign, X } from "lucide-react"
import type { PricingPlans, SpaceType } from "@/types/building-form.type"

interface PricingPlansStepProps {
  data: PricingPlans
  onChange: (data: PricingPlans) => void
}

export function PricingPlansStep({ data, onChange }: PricingPlansStepProps) {
  const toggleSpaceType = (id: string) => {
    const updatedSpaceTypes = data.spaceTypes.map((space) =>
      space._id === id ? { ...space, isExpanded: !space.isExpanded } : space,
    )
    onChange({ ...data, spaceTypes: updatedSpaceTypes })
  }

  const updateSpaceType = (id: string, field: keyof SpaceType, value: any) => {
    const updatedSpaceTypes = data.spaceTypes.map((space) => (space._id === id ? { ...space, [field]: value } : space))
    onChange({ ...data, spaceTypes: updatedSpaceTypes })
  }

  const addNewSpaceType = () => {
    const newSpaceType: SpaceType = {
      _id: Date.now().toString(),
      name: "",
      totalSeats: 0,
      pricePerDay: 0,
      amenities: [],
      isExpanded: true,
    }
    onChange({ ...data, spaceTypes: [...data.spaceTypes, newSpaceType] })
  }

  const removeSpaceType = (id: string) => {
    const updatedSpaceTypes = data.spaceTypes.filter((space) => space._id !== id)
    onChange({ ...data, spaceTypes: updatedSpaceTypes })
  }

  const addAmenity = (spaceId: string) => {
    const updatedSpaceTypes = data.spaceTypes.map((space) => {
      if (space._id === spaceId) {
        const amenities = Array.isArray(space.amenities) ? space.amenities : []
        return { ...space, amenities: [...amenities, ""] }
      }
      return space
    })
    onChange({ ...data, spaceTypes: updatedSpaceTypes })
  }

  const updateAmenity = (spaceId: string, amenityIndex: number, value: string) => {
    const updatedSpaceTypes = data.spaceTypes.map((space) => {
      if (space._id === spaceId) {
        const amenities = Array.isArray(space.amenities) ? [...space.amenities] : []
        amenities[amenityIndex] = value
        return { ...space, amenities }
      }
      return space
    })
    onChange({ ...data, spaceTypes: updatedSpaceTypes })
  }

  const removeAmenity = (spaceId: string, amenityIndex: number) => {
    const updatedSpaceTypes = data.spaceTypes.map((space) => {
      if (space._id === spaceId) {
        const amenities = Array.isArray(space.amenities) ? [...space.amenities] : []
        amenities.splice(amenityIndex, 1)
        return { ...space, amenities }
      }
      return space
    })
    onChange({ ...data, spaceTypes: updatedSpaceTypes })
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <div className="w-8 h-8 bg-[#f69938] rounded-full flex items-center justify-center mx-auto mb-2">
          <DollarSign className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Pricing and Plans</h2>
        <p className="text-gray-600 text-sm">Configure your workspace types and pricing</p>
      </div>

      <div className="space-y-3">
        {data.spaceTypes.map((spaceType) => (
          <div key={spaceType._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Header */}
            <div
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSpaceType(spaceType._id)}
            >
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={spaceType.name}
                  onChange={(e) => {
                    e.stopPropagation()
                    updateSpaceType(spaceType._id, "name", e.target.value)
                  }}
                  className="text-base font-semibold bg-transparent border-none outline-none focus:bg-white focus:border focus:border-[#f69938] focus:rounded px-2 py-1"
                  placeholder="Enter desk name"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeSpaceType(spaceType._id)
                  }}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center space-x-2">
                {spaceType.isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>

            {/* Expanded Content */}
            {spaceType.isExpanded && (
              <div className="p-3 border-t border-gray-200 bg-gray-50 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Total Number of Seats */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Number</label>
                    <input
                      type="number"
                      value={spaceType.totalSeats || ""}
                      onChange={(e) =>
                        updateSpaceType(spaceType._id, "totalSeats", Number.parseInt(e.target.value) || 0)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f69938] focus:border-transparent text-sm"
                      placeholder="Enter seats"
                      min="0"
                    />
                  </div>

                  {/* 1 Day Plan Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price per Day</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={spaceType.pricePerDay || ""}
                        onChange={(e) =>
                          updateSpaceType(spaceType._id, "pricePerDay", Number.parseFloat(e.target.value) || 0)
                        }
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f69938] focus:border-transparent text-sm"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                  <div className="flex flex-wrap gap-2 items-center">
                    {Array.isArray(spaceType.amenities) && spaceType.amenities.map((amenity, index) => (
                      <div key={index} className="relative">
                        <input
                          type="text"
                          value={amenity}
                          onChange={(e) => updateAmenity(spaceType._id, index, e.target.value)}
                          className="w-24 px-2 py-1 pr-6 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#f69938] focus:border-transparent"
                          placeholder="Amenity"
                        />
                        <button
                          onClick={() => removeAmenity(spaceType._id, index)}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 text-xs"
                        >
                          <X className="w-2 h-2" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addAmenity(spaceType._id)}
                      className="w-8 h-8 border border-dashed border-gray-400 rounded flex items-center justify-center text-gray-500 hover:border-[#f69938] hover:text-[#f69938] transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add New Space Type Button */}
        <button
          onClick={addNewSpaceType}
          className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#f69938] hover:text-[#f69938] transition-colors flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span className="font-medium text-sm">Add a new desk</span>
        </button>
      </div>
    </div>
  )
}