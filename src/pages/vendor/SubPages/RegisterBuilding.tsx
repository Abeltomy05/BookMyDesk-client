import { useState } from "react"
import { ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react"
import { StepIndicator } from "@/components/RegisterBuildingComps/StepIndicator"
import { BasicInfoStep } from "@/components/RegisterBuildingComps/BasicInfo"
import { FacilitiesContactStep } from "@/components/RegisterBuildingComps/Facilities"
import { PricingPlansStep } from "@/components/RegisterBuildingComps/Pricing&Plans"
import type { BuildingFormData } from "@/types/building-form.type"
import VendorLayout from "../VendorLayout"
import { uploadImageCloudinary } from "@/utils/cloudinary/cloudinary"
import { vendorService } from "@/services/vendorServices"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import Loading from "@/components/Loadings/Loading"

export default function RegisterBuilding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<BuildingFormData>({
    basicInfo: {
      name: "",
      location: null,
      openingHours: {
        weekdays: {
          is24Hour: false,
          openTime: "00:00",
          closeTime: "00:00",
        },
        weekends: {
          is24Hour: false,
          openTime: "00:00",
          closeTime: "00:00",
        },
      },
      photos: [],
    },
    facilities: {
      bicycleParking: false,
      normalParking: false,
      garden: false,
      swimmingPool: false,
      gym: false,
      cafeteria: false,
      wifi: false,
      airConditioning: false,
    },
    contactInfo: {
      phone: "",
      email: "",
    },
    pricingPlans: {
      spaceTypes: [],
    },
  })

  const stepTitles = ["Basic Info", "Facilities & Contact", "Pricing & Plans"]
  const totalSteps = 3

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
     e.preventDefault()
     setIsLoading(true);
    try {
       let images = [];
      if(formData.basicInfo.photos.length > 0){
        for(let pic of formData.basicInfo.photos){
           let cloudinaryUrl = '';
           cloudinaryUrl = await uploadImageCloudinary(pic);
           images.push(cloudinaryUrl);
        }
      }

       const selectedFacilities = Object.entries(formData.facilities)
      .filter(([key, value]) => value === true)
      .map(([key, value]) => key);


       let data = {
          name: formData.basicInfo.name,
          location: formData.basicInfo.location,
          openingHours: formData.basicInfo.openingHours,
          photos: images,
          facilities: selectedFacilities,
          phone: formData.contactInfo.phone,
          email: formData.contactInfo.email,
          spaceTypes: formData.pricingPlans.spaceTypes
        }
      const response = await vendorService.registerNewBuilding(data);
      if(response.success){
        toast.success( response.message || "Building Registered Sucessfully");
        setFormData({
          basicInfo: {
            name: "",
            location: null,
            openingHours: {
              weekdays: {
                is24Hour: false,
                openTime: "09:00",
                closeTime: "18:00",
              },
              weekends: {
                is24Hour: false,
                openTime: "10:00",
                closeTime: "16:00",
              },
            },
            photos: [],
          },
          facilities: {
            bicycleParking: false,
            normalParking: false,
            garden: false,
            swimmingPool: false,
            gym: false,
            cafeteria: false,
            wifi: false,
            airConditioning: false,
          },
          contactInfo: {
            phone: "",
            email: "",
          },
          pricingPlans: {
            spaceTypes: [],
          },
        });
        setCurrentStep(1);
        navigate("/vendor/manage-buildings")
      }else{
        toast.error(response.message || "Registration Failed")
      }
    } catch (error:any) {
       console.error('Registration error:', error);
    toast.error(error?.response?.data?.message || "An error occurred during registration");
    }finally {
    setIsLoading(false);
  }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.basicInfo.name && formData.basicInfo.location?.displayName
      case 2:
        return formData.contactInfo.phone && formData.contactInfo.email
      case 3:
        return formData.pricingPlans.spaceTypes.some((space) => space.totalSeats > 0 && space.pricePerDay > 0)
      default:
        return false
    }
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep data={formData.basicInfo} onChange={(basicInfo) => setFormData({ ...formData, basicInfo })} />
        )
      case 2:
        return (
          <FacilitiesContactStep
            facilities={formData.facilities}
            contactInfo={formData.contactInfo}
            onFacilitiesChange={(facilities) => setFormData({ ...formData, facilities })}
            onContactChange={(contactInfo) => setFormData({ ...formData, contactInfo })}
          />
        )
      case 3:
        return (
          <PricingPlansStep
            data={formData.pricingPlans}
            onChange={(pricingPlans) => setFormData({ ...formData, pricingPlans })}
          />
        )
      default:
        return null
    }
  }

  return (
    <>
    {/* {isLoading && <Loading/>} */}

  <VendorLayout
     notificationCount={5}
      backgroundClass="bg-black"
    >
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-4">
      <div className="max-w-4xl mx-auto px-4 h-full flex flex-col pt-16">
        {/* Header - Compact */}
        {/* <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Create New Building</h1>
          <p className="text-gray-600 text-sm">Register your building in a few simple steps</p>
        </div> */}

        {/* Step Indicator - Compact */}
        <div>
          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} stepTitles={stepTitles} />
        </div>

        {/* Form Content - Flexible height */}
        <div className="bg-white rounded-xl shadow-lg flex-1 flex flex-col min-h-0">
          <div className="p-6 flex-1 overflow-auto">
            {renderCurrentStep()}
          </div>
        </div>

        {/* Navigation Buttons - Fixed at bottom */}
        <div className="flex justify-between items-center py-4 bg-gray-50">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
              currentStep === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </button>

          <div className="text-xs text-gray-500">
            Step {currentStep} of {totalSteps}
          </div>

          {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                  isStepValid()
                    ? "bg-[#f69938] text-white hover:bg-[#e5873a]"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            ) : (
              <button
                onClick={handleRegister}
                disabled={!isStepValid() || isLoading}
                className={`flex items-center px-6 py-2 rounded-lg font-medium transition-colors text-sm ${
                  isStepValid() && !isLoading
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Register Building
                  </>
                )}
              </button>
            )}
        </div>
      </div>
    </div>
    </VendorLayout>
    </>
  )
}
