import type React from "react"
import { useState, useEffect } from "react"
import { Plus, X, Users, DollarSign, AlertCircle } from "lucide-react"
import type { Building, Space } from "@/types/view&editBuilding"
import { 
  validateSpaceField, 
  validateAllSpaceFields, 
  hasValidationErrors,
  type SpaceValidationErrors 
} from "@/utils/validations/edit-building/space-details.validation"

interface SpaceDetailsStepProps {
  building: Building
  setBuilding: React.Dispatch<React.SetStateAction<Building | null>>
}

export function SpaceDetailsStep({ building, setBuilding }: SpaceDetailsStepProps) {
  const [newSpace, setNewSpace] = useState({
    name: "",
    capacity: 0,
    pricePerDay: 0,
    amenities: [] as string[],
  })
  const [newSpaceAmenity, setNewSpaceAmenity] = useState("")
  const [showAddSpace, setShowAddSpace] = useState(false)
  
  // Validation states
  const [newSpaceErrors, setNewSpaceErrors] = useState<SpaceValidationErrors>({})
  const [spaceErrors, setSpaceErrors] = useState<Record<string, SpaceValidationErrors>>({})

  const getSpaceData = (space: any): Space => {
    const spaceData = space._doc || space
    return {
      _id: spaceData._id || space._id,
      name: spaceData.name || space.name,
      capacity: spaceData.capacity || space.capacity,
      pricePerDay: spaceData.pricePerDay || space.pricePerDay,
      amenities: spaceData.amenities || space.amenities || [],
      isAvailable: spaceData.isAvailable !== undefined ? spaceData.isAvailable : space.isAvailable,
      buildingId: spaceData.buildingId || space.buildingId
    }
  }
  
  const spaces = (building?.spaces || []).map(getSpaceData)

  // Validate new space fields on change
  const handleNewSpaceChange = (field: keyof typeof newSpace, value: any) => {
    setNewSpace(prev => ({ ...prev, [field]: value }))
    
    // Validate the specific field
    if (field === 'name' || field === 'capacity' || field === 'pricePerDay') {
      const error = validateSpaceField(field, value, spaces)
      setNewSpaceErrors(prev => ({ ...prev, [field]: error }))
    }
  }

  const updateSpace = (spaceId: string, field: keyof Space, value: any) => {
    setBuilding((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        spaces: (prev.spaces || []).map((space) =>
          space._id === spaceId ? { ...space, [field]: value } : space
        ),
      };
    });

    // Validate the specific field for existing space
    if (field === 'name' || field === 'capacity' || field === 'pricePerDay') {
      const otherSpaces = spaces.filter(s => s._id !== spaceId)
      const error = validateSpaceField(field, value, otherSpaces, spaceId)
      setSpaceErrors(prev => ({
        ...prev,
        [spaceId]: { ...prev[spaceId], [field]: error }
      }))
    }
  };

  const addSpace = () => {
    // Validate all fields before adding
    const errors = validateAllSpaceFields(newSpace, spaces)
    setNewSpaceErrors(errors)
    
    if (!hasValidationErrors(errors) && newSpace.name && newSpace.capacity > 0 && newSpace.pricePerDay > 0) {
      const space: Space = {
        _id: Date.now().toString(),
        ...newSpace,
        isAvailable: true,
      };

      setBuilding((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          spaces: [...(prev.spaces || []), space],
        };
      });

      setNewSpace({ name: "", capacity: 0, pricePerDay: 0, amenities: [] });
      setNewSpaceErrors({});
      setShowAddSpace(false);
    }
  };

  const removeSpace = (spaceId: string) => {
    setBuilding((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        spaces: (prev.spaces || []).filter((space) => space._id !== spaceId),
      };
    });
    
    // Remove validation errors for deleted space
    setSpaceErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[spaceId]
      return newErrors
    })
  };

  const addSpaceAmenity = (spaceId: string) => {
    if (newSpaceAmenity.trim()) {
      updateSpace(spaceId, "amenities", [
        ...(spaces.find((s) => s._id === spaceId)?.amenities || []),
        newSpaceAmenity.trim(),
      ])
      setNewSpaceAmenity("")
    }
  }

  const removeSpaceAmenity = (spaceId: string, amenityIndex: number) => {
    const space = spaces.find((s) => s._id === spaceId)
    if (space) {
      updateSpace(
        spaceId,
        "amenities",
        space.amenities.filter((_, i) => i !== amenityIndex),
      )
    }
  }

  const addNewSpaceAmenity = () => {
    if (newSpaceAmenity.trim()) {
      setNewSpace((prev) => ({
        ...prev,
        amenities: [...prev.amenities, newSpaceAmenity.trim()],
      }))
      setNewSpaceAmenity("")
    }
  }

  const removeNewSpaceAmenity = (index: number) => {
    setNewSpace((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
    }))
  }

  // Helper component for displaying validation errors
  const ValidationError = ({ error }: { error?: string }) => {
    if (!error) return null
    return (
      <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
        <AlertCircle className="w-3 h-3" />
        <span>{error}</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Space Details</h2>
          <p className="text-gray-600">Configure your available spaces and their pricing</p>
        </div>
        <button
          onClick={() => setShowAddSpace(true)}
          className="bg-[#f69938] text-white px-6 py-3 rounded-xl hover:bg-[#e5862f] transition-all duration-200 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl"
        >
          <Plus className="w-4 h-4" />
          Add New Space
        </button>
      </div>

      {/* Add New Space Form */}
      {showAddSpace && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
          <h3 className="font-bold text-gray-800 mb-6 text-xl flex items-center gap-2">
            <Plus className="w-5 h-5 text-[#f69938]" />
            Add New Space
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Space Name</label>
              <input
                type="text"
                placeholder="e.g., Conference Room A"
                value={newSpace.name}
                onChange={(e) => handleNewSpaceChange('name', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                  newSpaceErrors.name 
                    ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                    : 'border-gray-300 focus:ring-[#f69938]'
                }`}
              />
              <ValidationError error={newSpaceErrors.name} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Capacity
              </label>
              <input
                type="number"
                placeholder="Enter capacity"
                value={newSpace.capacity || ""}
                onChange={(e) => handleNewSpaceChange('capacity', Number.parseInt(e.target.value) || 0)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                  newSpaceErrors.capacity 
                    ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                    : 'border-gray-300 focus:ring-[#f69938]'
                }`}
              />
              <ValidationError error={newSpaceErrors.capacity} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="inline-block w-4 h-4 mr-1">₹</span>
                Price per Day
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="Enter price"
                value={newSpace.pricePerDay || ""}
                onChange={(e) => handleNewSpaceChange('pricePerDay', Number.parseFloat(e.target.value) || 0)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                  newSpaceErrors.pricePerDay 
                    ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                    : 'border-gray-300 focus:ring-[#f69938]'
                }`}
              />
              <ValidationError error={newSpaceErrors.pricePerDay} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Amenities</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {newSpace.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="bg-[#f69938] text-white px-3 py-1 rounded-full text-sm flex items-center gap-2 shadow-md"
                  >
                    {amenity}
                    <button
                      onClick={() => removeNewSpaceAmenity(index)}
                      className="hover:bg-[#e5862f] rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newSpaceAmenity}
                  onChange={(e) => setNewSpaceAmenity(e.target.value)}
                  placeholder="Add amenity (e.g., WiFi, Projector)"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f69938] transition-all duration-200"
                  onKeyPress={(e) => e.key === "Enter" && addNewSpaceAmenity()}
                />
                <button
                  onClick={addNewSpaceAmenity}
                  className="bg-[#f69938] hover:bg-[#e5862f] text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex gap-4 mt-8">
            <button
              onClick={addSpace}
              disabled={hasValidationErrors(newSpaceErrors)}
              className={`px-8 py-3 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl ${
                hasValidationErrors(newSpaceErrors)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#f69938] text-white hover:bg-[#e5862f]'
              }`}
            >
              Add Space
            </button>
            <button
              onClick={() => {
                setShowAddSpace(false)
                setNewSpaceErrors({})
                setNewSpace({ name: "", capacity: 0, pricePerDay: 0, amenities: [] })
              }}
              className="bg-gray-300 text-gray-700 px-8 py-3 rounded-xl hover:bg-gray-400 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Existing Spaces */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {spaces.map((space) => (
          <div
            key={space._id}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 mr-2">
                  <input
                    type="text"
                    value={space.name}
                    onChange={(e) => updateSpace(space._id, "name", e.target.value)}
                    className={`font-bold text-lg text-gray-800 bg-transparent border-b-2 transition-all duration-200 w-full ${
                      spaceErrors[space._id]?.name
                        ? 'border-red-300 text-red-600'
                        : 'border-transparent hover:border-gray-300 focus:border-[#f69938]'
                    } focus:outline-none`}
                  />
                  <ValidationError error={spaceErrors[space._id]?.name} />
                </div>
                <button
                  onClick={() => removeSpace(space._id)}
                  className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={space.isAvailable}
                    onChange={(e) => updateSpace(space._id, "isAvailable", e.target.checked)}
                    className="mr-2 w-4 h-4 text-[#f69938] focus:ring-[#f69938] rounded"
                  />
                  <span className={`font-medium ${space.isAvailable ? "text-emerald-600" : "text-red-600"}`}>
                    {space.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    Capacity
                  </label>
                  <input
                    type="number"
                    value={space.capacity}
                    onChange={(e) => updateSpace(space._id, "capacity", Number.parseInt(e.target.value) || 0)}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                      spaceErrors[space._id]?.capacity
                        ? 'border-red-300 focus:ring-red-500 bg-red-50'
                        : 'border-gray-300 focus:ring-[#f69938]'
                    }`}
                  />
                  <ValidationError error={spaceErrors[space._id]?.capacity} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    Price/Day
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={space.pricePerDay}
                    onChange={(e) => updateSpace(space._id, "pricePerDay", Number.parseFloat(e.target.value) || 0)}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                      spaceErrors[space._id]?.pricePerDay
                        ? 'border-red-300 focus:ring-red-500 bg-red-50'
                        : 'border-gray-300 focus:ring-[#f69938]'
                    }`}
                  />
                  <ValidationError error={spaceErrors[space._id]?.pricePerDay} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Amenities</label>
                <div className="flex flex-wrap gap-1 mb-3">
                  {(space.amenities || []).map((amenity, index) => (
                    <span
                      key={index}
                      className="bg-[#f69938] text-white px-2 py-1 rounded-full text-xs flex items-center gap-1 shadow-sm"
                    >
                      {amenity}
                      <button
                        onClick={() => removeSpaceAmenity(space._id, index)}
                        className="hover:bg-[#e5862f] rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSpaceAmenity}
                    onChange={(e) => setNewSpaceAmenity(e.target.value)}
                    placeholder="Add amenity"
                    className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#f69938]"
                    onKeyPress={(e) => e.key === "Enter" && addSpaceAmenity(space._id)}
                  />
                  <button
                    onClick={() => addSpaceAmenity(space._id)}
                    className="bg-[#f69938] hover:bg-[#e5862f] text-white px-3 py-1 rounded-lg text-xs transition-all duration-200"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {spaces.length === 0 && !showAddSpace && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No spaces added yet</h3>
          <p className="text-gray-500 mb-4">Add your first space to get started</p>
          <button
            onClick={() => setShowAddSpace(true)}
            className="bg-[#f69938] text-white px-6 py-3 rounded-xl hover:bg-[#e5862f] transition-all duration-200 font-medium"
          >
            Add Your First Space
          </button>
          </div>
      )}
    </div>
  )
}