import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Check,
  X,
  Building2,
  MapPin,
  FileImage,
  User,
} from "lucide-react"
import { GenericTable } from "@/components/ReusableComponents/GenericTable" 
import RejectionModal from "@/components/ReusableComponents/RejectionModal"
import { adminService } from "@/services/adminService"
import toast from "react-hot-toast"
import type { TableColumn, TableAction } from "@/types/table.type"
import type { FetchParams, ApiResponse } from "@/types/api.type"

type VendorStatus = "approved" | "rejected" | "pending" 

interface Vendor {
  _id: string
  username: string
  email: string
  companyName: string
  companyAddress: string
  idProof: string
  status: string
  createdAt: string
}

export default function VendorVerification() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const [showRejectModal, setShowRejectModal] = useState(false)
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null)
  const [isSubmittingReject, setIsSubmittingReject] = useState(false)

  const vendorRejectionReasons = [
    "Incomplete or unclear documentation",
    "Invalid or expired ID proof",
    "Company information does not match documentation"
  ]

  const fetchVendors = async (params: FetchParams): Promise<ApiResponse<Vendor>> => {
    try {
      const response = await adminService.getAllUsers({
        role: "vendor",
        page: params.page,
        limit: params.limit,
        search: params.search || "",
        excludeStatus: ["approved", "rejected", "blocked"]
      })

      return {
        success: response.success,
        users: response.users as Vendor[],
        totalPages: response.totalPages,
        currentPage: response.currentPage,
        message: response.message
      }
    } catch (error) {
      console.error("Failed to fetch vendors:", error)
      return {
        success: false,
        users: [],
        totalPages: 0,
        currentPage: 1,
        message: "Failed to fetch vendors"
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

  const handleStatusChange = async (vendorId: string, newStatus: VendorStatus) => {
    try {
      const res = await adminService.updateEntityStatus("vendor", vendorId, newStatus)
      if (res.success) {
        toast.success(`Vendor status updated to ${newStatus}`)
        setRefreshKey(prev => prev + 1) 
      } else {
        console.error("Failed to update status:", res.message)
        toast.error(`Failed to update vendor status: ${res.message || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error while updating vendor status:", error)
      toast.error("Error updating vendor status. Please try again later.")
    }
  }

  const handleRejectClick = (vendorId: string) => {
    setSelectedVendorId(vendorId)
    setShowRejectModal(true)
  }

  const handleRejectSubmit = async (reason: string) => {
    if (!selectedVendorId) return

    try {
      setIsSubmittingReject(true)
      const res = await adminService.updateEntityStatus("vendor", selectedVendorId, "rejected", reason)
      
      if (res.success) {
        toast.success("Vendor rejected successfully")
        setShowRejectModal(false)
        setSelectedVendorId(null)
        setRefreshKey(prev => prev + 1) 
      } else {
        toast.error(`Failed to reject vendor: ${res.message || "Unknown error"}`)
        throw new Error(res.message || "Failed to reject vendor")
      }
    } catch (error) {
      console.error("Error while rejecting vendor:", error)
      toast.error("Error rejecting vendor. Please try again later.")
      throw error 
    } finally {
      setIsSubmittingReject(false)
    }
  }

  const closeRejectModal = () => {
    setShowRejectModal(false)
    setSelectedVendorId(null)
  }

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl)
  }

  const closeImageModal = () => {
    setSelectedImage(null)
  }

  const columns: TableColumn<Vendor>[] = [
    {
      key: "vendor",
      label: "Vendor",
      width: "col-span-2",
      render: (vendor) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
            <User className="text-gray-400" size={16} />
          </div>
          <span className="font-medium truncate text-sm">{vendor.username}</span>
        </div>
      )
    },
    {
      key: "company",
      label: "Company",
      width: "col-span-2",
      render: (vendor) => (
        <div className="flex items-center gap-2">
          <Building2 size={14} className="text-gray-400" />
          {vendor.companyName ? 
          (<span className="text-gray-300 truncate text-sm">{vendor.companyName}</span>) 
          : "N/A"}
        </div>
      )
    },
    {
      key: "address",
      label: "Address",
      width: "col-span-4",
      responsive: "hidden",
      render: (vendor) => (
        <div className="flex items-start gap-2">
          <MapPin size={14} className="text-gray-400 mt-1 shrink-0" />
          <span className="text-gray-300 text-sm whitespace-pre-wrap break-words max-w-md w-full leading-snug">
            {vendor.companyAddress}
          </span>
        </div>
      )
    },
    {
      key: "idProof",
      label: "ID Proof",
      width: "col-span-2", 
      render: (vendor) => (
        <button
          onClick={() => openImageModal(vendor.idProof)}
          className="flex items-center gap-2 px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
        >
          <FileImage size={14} className="text-[#f69938]" />
          <span className="text-xs text-[#f69938]">View</span>
        </button>
      )
    },
    {
      key: "status",
      label: "Status",
      width: "col-span-1",
      render: (vendor) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vendor.status)}`}>
          {vendor.status}
        </span>
      )
    }
  ]

  // Define table actions
  const actions: TableAction<Vendor>[] = [
    {
      label: "Approve",
      icon: <Check size={12} />,
      onClick: (vendor) => handleStatusChange(vendor._id, "approved"),
      condition: (vendor) => vendor.status !== "approved",
      variant: "success"
    },
    {
      label: "Reject",
      icon: <X size={12} />,
      onClick: (vendor) => handleRejectClick(vendor._id),
      condition: (vendor) => vendor.status !== "rejected", 
      variant: "danger"
    }
  ]

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div>
      <GenericTable<Vendor>
        key={refreshKey} 
        title="Vendor Verification"
        columns={columns}
        actions={actions}
        fetchData={fetchVendors}
        onRefresh={handleRefresh}
        searchPlaceholder="Search vendors..."
        itemsPerPage={5}
        enableSearch={true}
        enablePagination={true}
        enableActions={true}
        emptyMessage="No vendors found matching your criteria"
        loadingMessage="Loading vendors..."
      />

      {/* Rejection Modal */}
      <RejectionModal
        isOpen={showRejectModal}
        onClose={closeRejectModal}
        onSubmit={handleRejectSubmit}
        title="Reject Vendor"
        description="Please select a reason for rejecting this vendor:"
        predefinedReasons={vendorRejectionReasons}
        isSubmitting={isSubmittingReject}
      />

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeImageModal}
          >
            <motion.div
              className="bg-gray-900 rounded-xl p-4 max-w-4xl max-h-[90vh] overflow-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[#f69938]">ID Proof Document</h3>
                <button onClick={closeImageModal} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                  <X size={20} className="text-gray-400" />
                </button>
              </div>
              <img src={selectedImage || "/placeholder.svg"} alt="ID Proof" className="w-full h-auto rounded-lg" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}