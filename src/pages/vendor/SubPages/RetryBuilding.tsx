import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, RotateCcw, CheckCircle } from 'lucide-react'
import { BasicInfoStep } from '@/components/View&EditBuildingComps/BasicInfoTab' 
import { DescriptionAmenitiesStep } from '@/components/View&EditBuildingComps/DescriptionAmenitiesTab' 
import { SpaceDetailsStep } from '@/components/View&EditBuildingComps/SpaceDetailsTab'
import type { Building } from "@/types/view&editBuilding"
import { useNavigate, useParams } from 'react-router-dom'
import { vendorService } from '@/services/vendorServices'
import { uploadImageCloudinary } from '@/utils/cloudinary/cloudinary'
import toast from 'react-hot-toast'

const STEPS = [
  {
    id: 1,
    title: 'Basic Information',
    description: 'Update your building details',
    component: BasicInfoStep
  },
  {
    id: 2,
    title: 'Description & Amenities',
    description: 'Enhance your building profile',
    component: DescriptionAmenitiesStep
  },
  {
    id: 3,
    title: 'Space Details',
    description: 'Configure your spaces',
    component: SpaceDetailsStep
  }
]

export function BuildingReregister() {
  const { token } = useParams<{ token: string }>();
  const [currentStep, setCurrentStep] = useState(1)
  const [building, setBuilding] = useState<Building | null>(null)
  const [isBasicInfoValid, setIsBasicInfoValid] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

 useEffect(() => {
    const fetchBuildingData = async () => {
      if (!token) {
        setError('No token provided')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const response = await vendorService.getBuildingByToken(token)
        console.log(response.data)
        const { building, spaces } = response.data
        if (!building) {
            throw new Error("No building data found")
        }

        const fullBuilding: Building = {
            ...building,
            spaces: spaces || [],
        } as Building 

        setBuilding(fullBuilding)
        setError(null)
      } catch (err) {
        console.error('Error fetching building data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load building data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBuildingData()
  }, [token])

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepClick = (stepNumber: number) => {
    if (stepNumber <= currentStep || (stepNumber === 2 && isBasicInfoValid)) {
      setCurrentStep(stepNumber)
    }
  }

  const handleReapply = async (e: React.FormEvent) => {
     e.preventDefault()
     if (!building) return;
     setIsSubmitting(true);
    try {
         let uploadedImageUrls: string[] = []
          if (building.imageFiles && building.imageFiles.length > 0) {
        for (const file of building.imageFiles) {
            const cloudinaryUrl = await uploadImageCloudinary(file)
            uploadedImageUrls.push(cloudinaryUrl)
        }
        }

         const existingImageUrls = building.images
         .flat() 
         .filter(img => 
        typeof img === 'string' && !img.startsWith('data:')
        )
        const finalImages = [...existingImageUrls, ...uploadedImageUrls]
        const { imageFiles, ...buildingData } = building

        const finalBuildingData = {
        ...buildingData,
        _id:building._id as string,
        images: finalImages
        }

         const response = await vendorService.retryBuilding(finalBuildingData);

         if(response.success){
           toast.success(response.message || "Building Re-Registered Successfully!")
         }else{
           toast.error(response.message || "Failed to update building. Please try again.")
         }

    } catch (error) {
         console.error("Failed to update building", error)
         toast.error("Failed to update building. Please try again.")
    } finally {
    setIsSubmitting(false)
  }
  }

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return isBasicInfoValid
      case 2:
        return true 
      case 3:
        return building?.spaces && building.spaces.length > 0
      default:
        return false
    }
  }

  const getCurrentStepComponent = () => {
    if (!building) return null

    const CurrentComponent = STEPS[currentStep - 1].component
    
    switch (currentStep) {
      case 1:
        return (
          <CurrentComponent
            building={building}
            setBuilding={setBuilding}
            onValidationChange={setIsBasicInfoValid}
          />
        )
      case 2:
        return (
          <CurrentComponent
            building={building}
            setBuilding={setBuilding}
          />
        )
      case 3:
        return (
          <CurrentComponent
            building={building}
            setBuilding={setBuilding}
          />
        )
      default:
        return null
    }
  }

   if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f69938] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading building data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
          <button
            onClick={() => navigate('/buildings')}
            className="bg-[#f69938] text-white px-6 py-3 rounded-xl hover:bg-[#e5862f] transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (!building) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f69938]"></div>
      </div>
    )
  }

 return (
    <div className="min-h-screen bg-gray-50">

      {/* Progress Steps */}
      <div className="bg-white border-b mt-15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex items-center">
                  <button
                    onClick={() => handleStepClick(step.id)}
                    disabled={step.id > currentStep + 1 || (step.id === 2 && !isBasicInfoValid)}
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                      step.id === currentStep
                        ? 'border-[#f69938] bg-[#f69938] text-white'
                        : step.id < currentStep
                        ? 'border-green-500 bg-green-500 text-white cursor-pointer hover:scale-105'
                        : 'border-gray-300 bg-white text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {step.id < currentStep ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-semibold">{step.id}</span>
                    )}
                  </button>
                  <div className="ml-3">
                    <div className={`text-sm font-semibold ${
                      step.id === currentStep ? 'text-[#f69938]' : 
                      step.id < currentStep ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500">{step.description}</div>
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    step.id < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {getCurrentStepComponent()}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="bg-white border-t mt-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="text-sm text-gray-500">
              Step {currentStep} of {STEPS.length}
            </div>

            {currentStep < STEPS.length ? (
              <button
                onClick={handleNext}
                disabled={!canProceedToNext()}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl ${
                  canProceedToNext()
                    ? 'bg-[#f69938] text-white hover:bg-[#e5862f]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                }`}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleReapply}
                disabled={isSubmitting || !canProceedToNext()}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl ${
                  isSubmitting || !canProceedToNext()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Reapplying...
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4" />
                    Re-apply
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuildingReregister