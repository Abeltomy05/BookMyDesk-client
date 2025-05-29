
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, MoreVertical, User, Building2, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import { adminService } from "@/services/adminService"
import toast from "react-hot-toast"


type VendorStatus = "approved" | "rejected" | "pending" | "blocked"

interface VendorData {
  _id: string
  username: string
  companyName: string
  status: VendorStatus
  avatar?: string
}



export default function VendorManagement() {
  const [vendors, setVendors] = useState<VendorData[]>([])
  const [loading, setLoading] = useState(false)
  const [activeFilter, setActiveFilter] = useState<"all" | VendorStatus>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const itemsPerPage = 4

   const fetchVendors = async (page: number = 1, search: string = "") => {
     setLoading(true)
     setError(null)

     try {
      const response = await adminService.getAllUsers({role: "vendor", page, limit: itemsPerPage, search, excludeStatus: "pending"});
      if(response.success){
         let filteredVendors = response.users as VendorData[];

         if (activeFilter !== "all") {
          filteredVendors = filteredVendors.filter(vendor => vendor.status === activeFilter)
        }

        setVendors(filteredVendors)
        setTotalPages(response.totalPages)
        setCurrentPage(response.currentPage)
      }else{
        setError("Failed to fetch vendors")
        setVendors([])
        setTotalPages(0)
      }
     } catch (error) {
       setError("An error occurred while fetching vendors")
      setVendors([])
      setTotalPages(0)
     }finally{
        setLoading(false);
     }
   }

  useEffect(() => {
    fetchVendors(1, searchQuery)
    setCurrentPage(1)
  }, [activeFilter])


   useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchVendors(1, searchQuery)
      setCurrentPage(1)
    }, 500)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])


 const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchVendors(page, searchQuery)
    }
  }

  const changeVendorStatus = async(vendorId: string, newStatus: VendorStatus) => {
  try {
    const response = await adminService.updateUserStatus("vendor", vendorId, newStatus)
    if (response.success) {
      setVendors((prevVendors) =>
        prevVendors.map((vendor) =>
          vendor._id === vendorId ? { ...vendor, status: newStatus } : vendor
        )
      )
      toast.success(`Vendor status updated to ${newStatus}`)
    } else {
      setError(response.message || "Failed to update vendor status")
      toast.error(response.message || "Failed to update vendor status")
    }
  } catch (err) {
    console.error("Status update failed", err)
    setError("An error occurred while updating vendor status")
  } finally {
    setActiveDropdown(null)
  }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  const getStatusColor = (status: VendorStatus) => {
    switch (status) {
      case "approved":
        return "bg-emerald-900/30 text-emerald-400 border border-emerald-500/30"
      case "rejected":
        return "bg-red-900/30 text-red-400 border border-red-500/30"
      case "pending":
        return "bg-yellow-900/30 text-yellow-400 border border-yellow-500/30"
      case "blocked":
        return "bg-purple-900/30 text-purple-400 border border-purple-500/30"
      default:
        return "bg-gray-900/30 text-gray-400 border border-gray-500/30"
    }
  }

  return (
    <motion.div
      className="bg-black text-white p-6 rounded-xl max-w-6xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1 className="text-2xl font-bold mb-6 text-[#f69938]" variants={itemVariants}>
        Vendor Management
      </motion.h1>

      {/* Search and Filters */}
      <motion.div className="flex flex-col md:flex-row justify-between mb-6 gap-4" variants={itemVariants}>
        {/* Search Bar */}
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search vendors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f69938] focus:border-transparent text-white"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap space-x-1 bg-gray-900 p-1 rounded-lg">
          {(["all", "approved", "rejected", "blocked"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-2 rounded-md capitalize transition-all duration-200 ${
                activeFilter === filter
                  ? "bg-[#f69938] text-black font-medium"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </motion.div>

       {error && (
        <motion.div 
          className="bg-red-900/30 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6"
          variants={itemVariants}
        >
          {error}
        </motion.div>
      )}

      {/* Vendor List */}
      <motion.div
        className="bg-gray-900 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(246,153,56,0.15)] min-h-[400px]"
        variants={itemVariants}
      >
        {/* Table Header */}
        <div className="grid grid-cols-12 bg-gray-800 p-4 font-medium text-sm text-gray-300">
          <div className="col-span-4 md:col-span-3">Vendor</div>
          <div className="col-span-4 md:col-span-6 hidden md:block">Company Name</div>
          <div className="col-span-4 md:col-span-2">Status</div>
          <div className="col-span-4 md:col-span-1 text-right">Actions</div>
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
              className="grid grid-cols-12 p-4 border-b border-gray-800 items-center hover:bg-gray-800/50 transition-colors"
              variants={itemVariants}
              whileHover={{ scale: 1.005 }}
            >
              {/* Vendor with Avatar */}
              <div className="col-span-4 md:col-span-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                  {vendor.avatar ? (
                    <img
                      src={vendor.avatar}
                      alt={vendor.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="text-gray-400" size={20} />
                  )}
                </div>
                <span className="font-medium truncate">{vendor.username}</span>
              </div>

              {/* Company Name */}
              <div className="col-span-4 md:col-span-6 hidden md:block">
                <div className="flex items-center gap-2">
                  <Building2 size={16} className="text-gray-400" />
                  <span className="text-gray-300 truncate">{vendor.companyName}</span>
                </div>
              </div>

              {/* Status */}
              <div className="col-span-4 md:col-span-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vendor.status)}`}>
                  {vendor.status}
                </span>
              </div>

              {/* Actions */}
             <div className="col-span-4 md:col-span-1 text-right relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === vendor._id ? null : vendor._id)}
                  className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                >
                  <MoreVertical size={18} className="text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {activeDropdown === vendor._id && (
                  <motion.div
                    className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-10"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded-t-lg text-sm flex items-center gap-2">
                      <Eye size={16} />
                      <span>View Details</span>
                    </button>

                    <div className="px-4 py-2 text-xs text-gray-400 border-t border-gray-700">Change Status</div>

                      {(["approved", "rejected", "blocked"] as const)
                      .filter((status) => status !== vendor.status)
                      .map((status) => (
                        <button
                          key={status}
                          onClick={() => changeVendorStatus(vendor._id, status)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-700 text-sm capitalize"
                        >
                          {status}
                        </button>
                      ))}
                  </motion.div>
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
        <motion.div 
          className="flex items-center justify-between mt-6"
          variants={itemVariants}
        >
          <div className="text-sm text-gray-400">
            Page {currentPage} of {totalPages}
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
                      currentPage === pageNum
                        ? "bg-[#f69938] text-black"
                        : "bg-gray-800 text-white hover:bg-gray-700"
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
    </motion.div>
  )
}
