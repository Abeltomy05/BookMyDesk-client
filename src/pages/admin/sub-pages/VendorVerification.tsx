import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Building2,
  MapPin,
  FileImage,
  User,
} from "lucide-react"
import { adminService } from "@/services/adminService"
import toast from "react-hot-toast"


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}


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
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(1)

  const itemsPerPage = 5

   useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true)
        const res = await adminService.getAllUsers({ role:"vendor", page: currentPage, limit: itemsPerPage, search:"" ,excludeStatus: ["approved", "rejected","blocked"] })

        if (res.success) {
          const vendors = res.users as Vendor[];
          setVendors(vendors)
          setTotalPages(res.totalPages || 1)
        } else {
          setVendors([])
        }
      } catch (err) {
        console.error("Failed to fetch vendors:", err)
        setVendors([])
      } finally {
        setLoading(false)
      }
    }

    fetchVendors()
  }, [currentPage])




  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
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

  const handleStatusChange = async(vendorId: string, newStatus: VendorStatus) => {
    try {
    const res = await adminService.updateUserStatus("vendor", vendorId, newStatus)
    if (res.success) {
      setVendors((prev) =>
        prev.map((vendor) =>
          vendor._id === vendorId ? { ...vendor, status: newStatus } : vendor
        )
      )
      toast.success(`Vendor status updated to ${newStatus}`)
    } else {
      console.error("Failed to update status:", res.message)
      toast.error(`Failed to update vendor status: ${res.message || "Unknown error"}`)
    }
  } catch (error) {
    console.error("Error while updating vendor status:", error)
    toast.error("Error updating vendor status. Please try again later.")
  }
  }

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl)
  }

  const closeImageModal = () => {
    setSelectedImage(null)
  }

  return (
    <motion.div
      className="bg-black text-white p-6 rounded-xl max-w-7xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1 className="text-2xl font-bold mb-6 text-[#f69938]" variants={itemVariants}>
        Vendor Verification
      </motion.h1>

      {/* Vendor Verification Table */}
      <motion.div
        className="bg-gray-900 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(246,153,56,0.15)] min-h-[400px]"
        variants={itemVariants}
      >
        {/* Table Header */}
        <div className="grid grid-cols-12 p-4 border-b border-gray-800 items-center hover:bg-gray-800/50 transition-colors">
          <div className="col-span-2">Vendor</div>
          <div className="col-span-2">Company</div>
          <div className="col-span-3 hidden lg:block">Address</div>
          <div className="col-span-1">ID Proof</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-3 text-right">Actions</div>
        </div>

        {loading && (
          <div className="p-8 text-center text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f69938] mx-auto"></div>
            <p className="mt-2">Loading vendors...</p>
          </div>
        )}

        {/* Vendor Rows */}
        {!loading && vendors.length > 0 ? (
          vendors.map((vendor) => (
           <motion.div
        key={vendor._id}
        className="grid grid-cols-12 p-4 border-b border-gray-800 items-start hover:bg-gray-800/50 transition-colors"
        variants={itemVariants}
        whileHover={{ scale: 1.002 }}
        >
        {/* Vendor Name */}
        <div className="col-span-2 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
            <User className="text-gray-400" size={16} />
            </div>
            <span className="font-medium truncate text-sm">{vendor.username}</span>
        </div>

        {/* Company Name */}
        <div className="col-span-2">
            <div className="flex items-center gap-2">
            <Building2 size={14} className="text-gray-400" />
            <span className="text-gray-300 truncate text-sm">{vendor.companyName}</span>
            </div>
        </div>

        {/* Company Address */}
        <div className="col-span-3 hidden lg:block">
        <div className="flex items-start gap-2">
            <MapPin size={14} className="text-gray-400 mt-1 shrink-0" />
            <span className="text-gray-300 text-sm whitespace-pre-wrap break-words max-w-md w-full leading-snug">
            {vendor.companyAddress}
            </span>
        </div>
        </div>

        {/* ID Proof */}
        <div className="col-span-1">
            <button
            onClick={() => openImageModal(vendor.idProof)}
            className="flex items-center gap-2 px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
            >
            <FileImage size={14} className="text-[#f69938]" />
            <span className="text-xs text-[#f69938]">View</span>
            </button>
        </div>

        {/* Status */}
        <div className="col-span-1">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vendor.status)}`}>
            {vendor.status}
            </span>
        </div>

        {/* Actions */}
        <div className="col-span-3 flex items-center justify-end gap-2">

            {/* Approve Button */}
            {vendor.status !== "approved" && (
              <motion.button
                onClick={() => handleStatusChange(vendor._id, "approved")}
                className="flex items-center gap-1 px-3 py-1.5 bg-green-900/30 hover:bg-green-800/40 text-green-400 border border-green-500/30 rounded-md transition-colors text-xs"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                title="Approve Vendor"
              >
                <Check size={12} />
                <span className="hidden sm:inline">Approve</span>
              </motion.button>
            )}

            {/* Reject Button */}
            {vendor.status !== "rejected" && (
              <motion.button
                onClick={() => handleStatusChange(vendor._id, "rejected")}
                className="flex items-center gap-1 px-3 py-1.5 bg-red-900/30 hover:bg-red-800/40 text-red-400 border border-red-500/30 rounded-md transition-colors text-xs"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                title="Reject Vendor"
              >
                <X size={12} />
                <span className="hidden sm:inline">Reject</span>
              </motion.button>
            )}
        </div>
        </motion.div>
          ))
        ) : !loading ? (
          <div className="p-8 text-center text-gray-400">No vendors found matching your criteria</div>
        ) : null}
      </motion.div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <motion.div className="flex items-center justify-between mt-6" variants={itemVariants}>
          <div className="text-sm text-gray-400">
            Page {currentPage} of {totalPages} • {vendors.length} vendors
            </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === 1
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-gray-800 text-white hover:bg-gray-700"
              }`}
            >
              <ChevronLeft size={16} className="mr-1" />
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === pageNum ? "bg-[#f69938] text-black" : "bg-gray-800 text-white hover:bg-gray-700"
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === totalPages
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-gray-800 text-white hover:bg-gray-700"
              }`}
            >
              Next
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </motion.div>
      )}

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
    </motion.div>
  )
}