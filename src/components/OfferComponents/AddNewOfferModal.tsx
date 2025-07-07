import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, AlertCircle } from 'lucide-react'
import { vendorService } from '@/services/vendorServices'
import { getFieldError, validateOfferForm, type ValidationError } from '@/utils/validations/offer.validation'

interface NewOfferForm {
  title: string
  description: string
  percentage: number
  startDate: string
  endDate: string
  buildingId: string
  spaceId: string
}
interface BuildingShort {
  _id: string
  buildingName: string
}
interface SpaceShort {
  _id: string
  name: string
}
interface AddOfferModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (formData: NewOfferForm) => Promise<void>
  loading?: boolean
  error?: string | null
}

const AddOfferModal: React.FC<AddOfferModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  error = null
}) => {
  const [formData, setFormData] = useState<NewOfferForm>({
    title: '',
    description: '',
    percentage: 0,
    startDate: '',
    endDate: '',
    buildingId: '',
    spaceId: ''
  })
  const [buildings, setBuildings] = useState<BuildingShort[]>([])
  const [availableSpaces, setAvailableSpaces] = useState<SpaceShort[]>([])
  const [buildingLoading, setBuildingLoading] = useState(false)
  const [spaceLoading, setSpaceLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  
  useEffect(() => {
    const fetchBuildings = async () => {
    setBuildingLoading(true)
    setLoadError(null)

    const res = await vendorService.fetchBuildingsForVendor()
    if (res.success) {
      setBuildings(res.data)
    } else {
      setLoadError(res.message || "Failed to load buildings.")
    }
    setBuildingLoading(false)
  }

    if (!isOpen) {
      resetForm()
      fetchBuildings()
    }
  }, [isOpen])

  const handleBuildingChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
  const buildingId = e.target.value
  setFormData(prev => ({ ...prev, buildingId, spaceId: '' }))
  setAvailableSpaces([])
  setTouched(prev => ({ ...prev, buildingId: true, spaceId: false }))

  if (buildingId) {
      setSpaceLoading(true)
     const res = await vendorService.fetchSpacesForBuildings(buildingId)
  if (res.success) {
    setAvailableSpaces(res.data)
  } else {
    setLoadError(res.message || "Failed to load spaces.")
  }
  setSpaceLoading(false)
 }
  validateForm({ ...formData, buildingId, spaceId: '' })
}

 const validateForm = (data: NewOfferForm) => {
    const validation = validateOfferForm(data)
    setValidationErrors(validation.errors)
    return validation.isValid
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      percentage: 0,
      startDate: '',
      endDate: '',
      buildingId: '',
      spaceId: ''
    })
    setAvailableSpaces([])
    setValidationErrors([])
    setTouched({})
  }

  const handleClose = () => {
    onClose()
    resetForm()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const updatedFormData = {
      ...formData,
      [name]: name === 'percentage' ? Number(value) : value
    }
    setFormData(updatedFormData)
    setTouched(prev => ({ ...prev, [name]: true }))
    validateForm(updatedFormData)
  }

  const handleBlur = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
     const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true
      return acc
    }, {} as Record<string, boolean>)
    setTouched(allTouched)

    const isValid = validateForm(formData)
    if (!isValid) {
      return
    }
     try {
      const adjustedEndDate = new Date(formData.endDate)
      adjustedEndDate.setHours(23, 59, 59, 999);

       const adjustedFormData = {
          ...formData,
          endDate: adjustedEndDate.toISOString(), 
        }


      await onSubmit(adjustedFormData)
      resetForm()
    } catch (error) {
    }
  }

 const getInputClassName = (fieldName: string, baseClassName: string) => {
    const hasError = touched[fieldName] && getFieldError(validationErrors, fieldName)
    return hasError 
      ? `${baseClassName} border-red-300 focus:ring-red-500 focus:border-red-500`
      : baseClassName
  }

 const hasErrors = validationErrors.length > 0 && Object.values(touched).some(Boolean) 

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl w-full max-w-5xl shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="p-8">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Add New Offer</h2>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              {(buildingLoading || spaceLoading) && (
                <p className="text-sm text-gray-500 mb-4">Loading...</p>
              )}

              {loadError && (
                <div className="bg-red-50 text-red-600 p-2 rounded mb-4">{loadError}</div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Row 1: Title and Percentage */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Offer Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('title')}
                      className={getInputClassName('title', 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f69938] focus:border-transparent')}
                      placeholder="Enter offer title"
                    />
                    {touched.title && getFieldError(validationErrors, 'title') && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError(validationErrors, 'title')}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="percentage" className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Percentage *
                    </label>
                    <input
                      type="number"
                      id="percentage"
                      name="percentage"
                      value={formData.percentage}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('percentage')}
                      className={getInputClassName('percentage', 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f69938] focus:border-transparent')}
                      placeholder="Enter discount %"
                    />
                    {touched.percentage && getFieldError(validationErrors, 'percentage') && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError(validationErrors, 'percentage')}</p>
                    )}
                  </div>
                </div>

                {/* Row 2: Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('description')}
                    rows={3}
                    className={getInputClassName('description', 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f69938] focus:border-transparent')}
                    placeholder="Enter offer description"
                  />
                  {touched.description && getFieldError(validationErrors, 'description') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError(validationErrors, 'description')}</p>
                  )}
                </div>

                {/* Row 3: Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('startDate')}
                      className={getInputClassName('startDate', 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f69938] focus:border-transparent')}
                    />
                    {touched.startDate && getFieldError(validationErrors, 'startDate') && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError(validationErrors, 'startDate')}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('endDate')}
                      className={getInputClassName('endDate', 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f69938] focus:border-transparent')}
                    />
                    {touched.endDate && getFieldError(validationErrors, 'endDate') && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError(validationErrors, 'endDate')}</p>
                    )}
                  </div>
                </div>

                {/* Row 4: Building and Space Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="buildingId" className="block text-sm font-medium text-gray-700 mb-2">
                      Select Building *
                    </label>
                    <select
                      id="buildingId"
                      name="buildingId"
                      value={formData.buildingId}
                      onChange={handleBuildingChange}
                      onBlur={() => handleBlur('buildingId')}
                      disabled={buildingLoading}
                      className={getInputClassName('buildingId', 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f69938] focus:border-transparent')}
                    >
                      <option value="">Select a building</option>
                      {buildings.map(building => (
                        <option key={building._id} value={building._id}>
                          {building.buildingName}
                        </option>
                      ))}
                    </select>
                    {touched.buildingId && getFieldError(validationErrors, 'buildingId') && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError(validationErrors, 'buildingId')}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="spaceId" className="block text-sm font-medium text-gray-700 mb-2">
                      Select Space *
                    </label>
                    <select
                      id="spaceId"
                      name="spaceId"
                      value={formData.spaceId}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('spaceId')}
                      disabled={!formData.buildingId || spaceLoading}
                      className={getInputClassName('spaceId', 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f69938] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed')}
                    >
                      <option value="">Select a space</option>
                      {availableSpaces.map(space => (
                        <option key={space._id} value={space._id}>
                          {space.name}
                        </option>
                      ))}
                    </select>
                    {touched.spaceId && getFieldError(validationErrors, 'spaceId') && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError(validationErrors, 'spaceId')}</p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                 <button
                  type="submit"
                  disabled={loading || hasErrors}
                  className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed
                    ${hasErrors
                      ? 'bg-red-400 hover:bg-red-500'
                      : 'bg-[#f69938] hover:bg-[#e8873a] text-white'}`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Create Offer
                    </>
                  )}
                </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AddOfferModal