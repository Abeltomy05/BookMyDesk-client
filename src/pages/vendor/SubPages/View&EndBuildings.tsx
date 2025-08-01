import { useEffect, useState } from "react"
import { Edit3, Calendar, Info, ChevronRight, ChevronLeft, Check } from "lucide-react"
import { BasicInfoStep } from "@/components/View&EditBuildingComps/BasicInfoTab"
import { SpaceDetailsStep } from "@/components/View&EditBuildingComps/SpaceDetailsTab"
import { DescriptionAmenitiesStep } from "@/components/View&EditBuildingComps/DescriptionAmenitiesTab"
import type { Building } from "@/types/view&editBuilding"
import { uploadImageCloudinary } from "@/utils/cloudinary/cloudinary"
import { vendorService } from "@/services/vendorServices"
import { useParams } from "react-router-dom"
import Loading from "@/components/Loadings/Loading"
import toast from "react-hot-toast"


const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-emerald-100 text-emerald-700 border-emerald-200"
    case "pending":
      return "bg-amber-100 text-amber-700 border-amber-200"
    case "archived":
      return "bg-slate-100 text-slate-700 border-slate-200"
    case "rejected":
      return "bg-red-100 text-red-700 border-red-200"
    default:
      return "bg-gray-100 text-gray-700 border-gray-200"
  }
}

export default function BuildingDetailsWizard() {
  const {buildingId} = useParams();
  const [building, setBuilding] = useState<Building | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
  const fetchBuilding = async () => {
    try {
      if (!buildingId) return;
      const response = await vendorService.getBuildingDetails(buildingId);
      console.log("Fetched building details",response.data)
      setBuilding({
        ...response.data,
        spaces:response.data.spaces ?? [],
      }); 
    } catch (error) {
      console.error("Failed to fetch building data:", error);
    }
  };

  fetchBuilding();
}, [buildingId]);

  const steps = [
    {
      id: 0,
      title: "Basic Information",
      icon: Info,
      description: "Building details and contact information",
    },
    {
      id: 1,
      title: "Space Details",
      icon: Edit3,
      description: "Configure available spaces and pricing",
    },
    {
      id: 2,
      title: "Description & Amenities",
      icon: Calendar,
      description: "Add description, amenities and images",
    },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault()
     if (!building) return;
     setIsLoading(true);
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
        id:buildingId as string,
        images: finalImages
        }

         const response = await vendorService.editBuildingData(finalBuildingData);

         if(response.success){
           toast.success("Building updated successfully!")
         }else{
           toast.error(response.message || "Failed to update building. Please try again.")
         }

    } catch (error) {
         console.error("Failed to update building", error)
         toast.error("Failed to update building. Please try again.")
    } finally {
    setIsLoading(false)
  }
  }

  const isLastStep = currentStep === steps.length - 1
  const isFirstStep = currentStep === 0

  if (!building) {
    return (
        <div className="min-h-screen flex items-center justify-center text-gray-600">
          <Loading/>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-4 pt-16">
        <div className="max-w-10xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 mb-2">
            <div className="bg-gradient-to-r from-[#5e4832] to-[#4a3628] px-6 py-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2">
                    <Edit3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                    <h1 className="text-xl font-bold text-white">{building.buildingName}</h1>
                    <p className="text-white/80 text-xs">Configure your building details in 3 simple steps</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-white text-xs">
                    <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    <span>
                        Created:{" "}
                        {new Date(building.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        })}
                    </span>
                    </div>
                    <div
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(building.status)}`}
                    >
                    <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                    {building.status.charAt(0).toUpperCase() + building.status.slice(1)}
                    </div>
                </div>
                </div>
            </div>

  {/* Progress Steps */}
  <div className="px-6 py-4 border-b border-gray-200">
    <div className="flex items-center justify-between">
      {steps.map((step, index) => {
        const Icon = step.icon
        const isActive = index === currentStep
        const isCompleted = index < currentStep

        return (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex items-center gap-3">
              <div
                className={`
                flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300
                ${
                  isActive
                    ? "bg-[#f69938] border-[#f69938] text-white shadow-lg"
                    : isCompleted
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "bg-gray-100 border-gray-300 text-gray-400"
                }
              `}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
              <div className="flex flex-col">
                <span
                  className={`font-semibold text-xs ${isActive ? "text-[#f69938]" : isCompleted ? "text-emerald-600" : "text-gray-500"}`}
                >
                  Step {index + 1}
                </span>
                <span className={`font-bold text-sm ${isActive ? "text-gray-900" : "text-gray-600"}`}>
                  {step.title}
                </span>
                <span className="text-xs text-gray-500 max-w-40">{step.description}</span>
              </div>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-6 transition-all duration-300 ${
                  isCompleted ? "bg-emerald-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  </div>
</div>

          {/* Step Content */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 min-h-[600px]">
            <div className="p-8">
              {currentStep === 0 && <BasicInfoStep building={building} setBuilding={setBuilding} />}
              {currentStep === 1 && <SpaceDetailsStep building={building} setBuilding={setBuilding} />}
              {currentStep === 2 && <DescriptionAmenitiesStep building={building} setBuilding={setBuilding} />}
            </div>

            {/* Navigation Footer */}
            <div className="border-t border-gray-200 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>
                    Step {currentStep + 1} of {steps.length}
                  </span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#f69938] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={handlePrevious}
                    disabled={isFirstStep}
                    className={`
                      flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200
                      ${
                        isFirstStep
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-md hover:shadow-lg"
                      }
                    `}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  {isLastStep ? (
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className={`flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all duration-200
                        ${isLoading ? "bg-emerald-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"}
                        text-white shadow-lg hover:shadow-xl`}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="flex items-center gap-2 bg-[#f69938] text-white px-6 py-3 rounded-xl hover:bg-[#e5862f] transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}