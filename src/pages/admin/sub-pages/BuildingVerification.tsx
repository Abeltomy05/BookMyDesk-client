import { useState } from "react"
import {
  Check,
  X,
  Building2,
  MapPin,
  FileImage,
  User,
  Users,
  CheckCheck,
} from "lucide-react"
import { GenericTable } from "@/components/ReusableComponents/GenericTable" 
import RejectionModal from "@/components/ReusableComponents/RejectionModal"
import { adminService } from "@/services/adminService"
import toast from "react-hot-toast"
import type { TableColumn, TableAction } from "@/types/table.type"
import type { FetchParams, ApiResponse } from "@/types/api.type"

type BuildingStatus = "approved" | "rejected" | "pending" 

interface SummarizedSpaces {
   name: string;
   count: number;
   _id: string;
}

interface Building {
  _id: string
  buildingName: string
  vendorName: string
  vendorEmail: string
  vendorId: string
  location: string
  summarizedSpaces: SummarizedSpaces[]
  images: string[]
  status: string
  createdAt: string
  email: string
  phone: string
  amenities: string[]
}

export default function BuildingVerification() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [selectedBuildingId, setBuildingId] = useState<string | null>(null)
  const [isSubmittingReject, setIsSubmittingReject] = useState(false)
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showImageModal, setShowImageModal] = useState(false)

  const buildingRejectionReasons = [
    "Incomplete building information",
    "Invalid or unclear images",
    "Location verification failed",
    "Insufficient space documentation",
    "Building safety standards not met"
  ]

  const fetchBuildings = async (params: FetchParams): Promise<ApiResponse<Building>> => {
    try {
      const response = await adminService.getPendingBuildings({
        page: params.page,
        limit: params.limit,
      })

      return {
        success: response.success,
        users: response.buildings as Building[],
        totalPages: response.totalPages,
        currentPage: response.currentPage,
        message: response.message
      }
    } catch (error) {
      console.error("Failed to fetch buildings:", error)
      return {
        success: false,
        users: [],
        totalPages: 0,
        currentPage: 1,
        message: "Failed to fetch buildings"
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-900/30 text-green-400 border border-green-500/30"
      case "rejected":
        return "bg-red-900/30 text-red-400 border border-red-500/30"
      case "pending":
        return "bg-yellow-900/30 text-yellow-400 border border-yellow-500/30"
      default:
        return "bg-gray-900/30 text-gray-400 border border-gray-500/30"
    }
  }

  const handleStatusChange = async (buildingId: string, newStatus: BuildingStatus) => {
    try {
      const res = await adminService.updateEntityStatus("building", buildingId, newStatus)
      if (res.success) {
        toast.success(`Building status updated to ${newStatus}`)
        setRefreshKey(prev => prev + 1) 
      } else {
        console.error("Failed to update status:", res.message)
        toast.error(`Failed to update building status: ${res.message || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error while updating building status:", error)
      toast.error("Error updating building status. Please try again later.")
    }
  }

  const handleRejectClick = (buildingId: string) => {
    setBuildingId(buildingId)
    setShowRejectModal(true)
  }

  const handleRejectSubmit = async (reason: string) => {
    if (!selectedBuildingId) return

    try {
      setIsSubmittingReject(true)
      const res = await adminService.updateEntityStatus("building", selectedBuildingId, "rejected", reason)
      
      if (res.success) {
        toast.success("Building rejected successfully")
        setShowRejectModal(false)
        setBuildingId(null)
        setRefreshKey(prev => prev + 1) 
      } else {
        toast.error(`Failed to reject building: ${res.message || "Unknown error"}`)
        throw new Error(res.message || "Failed to reject building")
      }
    } catch (error) {
      console.error("Error while rejecting building:", error)
      toast.error("Error rejecting building. Please try again later.")
      throw error 
    } finally {
      setIsSubmittingReject(false)
    }
  }

  const closeRejectModal = () => {
    setShowRejectModal(false)
    setBuildingId(null)
  }

  const openImageModal = (images: string[]) => {
    setSelectedImages(images)
    setCurrentImageIndex(0)
    setShowImageModal(true)
  }

  const closeImageModal = () => {
    setSelectedImages([])
    setCurrentImageIndex(0)
    setShowImageModal(false)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % selectedImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + selectedImages.length) % selectedImages.length)
  }

  const formatSummarizedSpaces = (spaces: SummarizedSpaces[]) => {
    if (!spaces || spaces.length === 0) {
      return "No spaces available"
    }
    
    return spaces
      .filter(space => space.count > 0)
      .map(space => `${space.name}: ${space.count}`)
      .join(", ") || "No spaces available"
  }

  const getFirstTwoWords = (location: string) => {
    if (!location) return ""
    const words = location.split(/,|\s+/).filter(word => word.trim() !== "")
    return words.slice(0, 2).join(" ")
  }

  const columns: TableColumn<Building>[] = [
    {
      key: "building",
      label: "Building",
      width: "col-span-3",
      render: (building) => (
        <div className="flex items-start gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mt-1">
            <Building2 className="text-gray-400" size={16} />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-sm text-white">{building.buildingName}</span>
            <div className="flex items-center gap-1 mt-1">
              <MapPin size={12} className="text-gray-400" />
              <span className="text-xs text-gray-400">{getFirstTwoWords(building.location)}</span>
            </div>
          </div>
        </div>
      )
    },
    {
      key: "vendor",
      label: "Vendor",
      width: "col-span-3",
      render: (building) => (
        <div className="flex items-start gap-2">
          <User size={14} className="text-gray-400 mt-1" />
          <div className="flex flex-col">
            <span className="text-gray-300 text-sm">{building.vendorName}</span>
            <span className="text-xs text-gray-400">{building.vendorEmail}</span>
          </div>
        </div>
      )
    },
    {
    key: "summarizedSpaces",
    label: "Available Spaces",
    width: "col-span-2",
    render: (building) => {
      const allSpaces = formatSummarizedSpaces(building.summarizedSpaces)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean); // remove empty strings

      const shown = allSpaces.slice(0, 3);
      const remaining = allSpaces.length - shown.length;

      return (
        <div className="flex items-start gap-2">
          <Users size={14} className="text-gray-400 mt-1 shrink-0" />
          <div className="flex flex-col text-gray-300 text-xs w-full leading-snug">
            {shown.map((space, index) => (
              <span key={index}>{space}</span>
            ))}
            {remaining > 0 && (
              <span className="text-gray-400">+{remaining} more</span>
            )}
          </div>
        </div>
      );
    }
  },
    {
      key: "images",
      label: "Images",
      width: "col-span-2", 
      render: (building) => (
        <button
          onClick={() => openImageModal(building.images)}
          className="flex items-center gap-2 px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
          disabled={!building.images || building.images.length === 0}
        >
          <FileImage size={14} className="text-[#f69938]" />
          <span className="text-xs text-[#f69938]">
            {building.images && building.images.length > 0 ? `View (${building.images.length})` : "No Images"}
          </span>
        </button>
      )
    },
    {
      key: "status",
      label: "Status",
      width: "col-span-1",
      render: (building) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(building.status)}`}>
          {building.status}
        </span>
      )
    }
  ]

  const actions: TableAction<Building>[] = [
    {
      label: "Approve",
      icon:  <Check size={16} />,
      variant: "success",
      onClick: (building) => handleStatusChange(building._id, "approved"),
      className: "bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1"
    },
    {
      label: "Reject",
      icon:  <X size={16} />,
      variant: "danger",
      onClick: (building) => handleRejectClick(building._id),
      className: "bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1"
    }
  ]

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div>
      <GenericTable<Building>
        key={refreshKey} 
        title="Building Verification"
        columns={columns}
        actions={actions}
        fetchData={fetchBuildings}
        onRefresh={handleRefresh}
        searchPlaceholder="Search buildings..."
        itemsPerPage={5}
        enableSearch={true}
        enablePagination={true}
        enableActions={true}
        emptyMessage="No buildings found matching your criteria"
        loadingMessage="Loading buildings..."
      />

      {/* Rejection Modal */}
      <RejectionModal
        isOpen={showRejectModal}
        onClose={closeRejectModal}
        onSubmit={handleRejectSubmit}
        title="Reject Building"
        description="Please select a reason for rejecting this building:"
        predefinedReasons={buildingRejectionReasons}
        isSubmitting={isSubmittingReject}
      />

      {/* Enhanced Image Modal with Navigation */}
      {showImageModal && selectedImages.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative max-w-5xl max-h-full p-6 w-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <div className="text-white">
                <span className="text-sm">
                  Image {currentImageIndex + 1} of {selectedImages.length}
                </span>
              </div>
              <button
                onClick={closeImageModal}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <X size={28} />
              </button>
            </div>

            {/* Image Container */}
            <div className="relative flex items-center justify-center">
              {/* Previous Button */}
              {selectedImages.length > 1 && (
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity z-10"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              {/* Main Image */}
              <img
                src={selectedImages[currentImageIndex]}
                alt={`Building image ${currentImageIndex + 1}`}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />

              {/* Next Button */}
              {selectedImages.length > 1 && (
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity z-10"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {selectedImages.length > 1 && (
              <div className="flex justify-center mt-4 gap-2 max-w-full overflow-x-auto">
                {selectedImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                      index === currentImageIndex 
                        ? 'border-[#f69938] opacity-100' 
                        : 'border-gray-600 opacity-60 hover:opacity-80'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}