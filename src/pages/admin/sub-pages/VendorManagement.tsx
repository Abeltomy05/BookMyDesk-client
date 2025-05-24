
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, MoreVertical, User, Building2, Eye } from "lucide-react"


type VendorStatus = "approved" | "rejected" | "pending" | "blocked"

interface VendorData {
  id: string
  username: string
  companyName: string
  status: VendorStatus
  profilePic?: string
}


const sampleVendors: VendorData[] = [
  {
    id: "1",
    username: "johnsmith",
    companyName: "Smith Enterprises",
    status: "approved",
    profilePic: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    username: "sarahwilliams",
    companyName: "Williams & Co",
    status: "pending",
  },
  {
    id: "3",
    username: "michaeljohnson",
    companyName: "Johnson Solutions",
    status: "rejected",
    profilePic: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    username: "emilydavis",
    companyName: "Davis Technologies",
    status: "approved",
    profilePic: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    username: "davidbrown",
    companyName: "Brown Industries",
    status: "blocked",
  },
]

export default function VendorManagement() {
  const [vendors, setVendors] = useState<VendorData[]>(sampleVendors)
  const [filteredVendors, setFilteredVendors] = useState<VendorData[]>(sampleVendors)
  const [activeFilter, setActiveFilter] = useState<"all" | VendorStatus>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  useEffect(() => {
    let result = vendors

    if (activeFilter !== "all") {
      result = result.filter((vendor) => vendor.status === activeFilter)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (vendor) => vendor.username.toLowerCase().includes(query) || vendor.companyName.toLowerCase().includes(query),
      )
    }

    setFilteredVendors(result)
  }, [vendors, activeFilter, searchQuery])

  const changeVendorStatus = (vendorId: string, newStatus: VendorStatus) => {
    setVendors((prevVendors) =>
      prevVendors.map((vendor) => (vendor.id === vendorId ? { ...vendor, status: newStatus } : vendor)),
    )
    setActiveDropdown(null)
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
          {(["all", "approved", "rejected", "pending", "blocked"] as const).map((filter) => (
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

      {/* Vendor List */}
      <motion.div
        className="bg-gray-900 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(246,153,56,0.15)]"
        variants={itemVariants}
      >
        {/* Table Header */}
        <div className="grid grid-cols-12 bg-gray-800 p-4 font-medium text-sm text-gray-300">
          <div className="col-span-4 md:col-span-3">Vendor</div>
          <div className="col-span-4 md:col-span-6 hidden md:block">Company</div>
          <div className="col-span-4 md:col-span-2">Status</div>
          <div className="col-span-4 md:col-span-1 text-right">Actions</div>
        </div>

        {/* Vendor Rows */}
        {filteredVendors.length > 0 ? (
          filteredVendors.map((vendor) => (
            <motion.div
              key={vendor.id}
              className="grid grid-cols-12 p-4 border-b border-gray-800 items-center hover:bg-gray-800/50 transition-colors"
              variants={itemVariants}
              whileHover={{ scale: 1.005 }}
            >
              {/* Vendor with Avatar */}
              <div className="col-span-4 md:col-span-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                  {vendor.profilePic ? (
                    <img
                      src={vendor.profilePic || "/placeholder.svg"}
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
                  onClick={() => setActiveDropdown(activeDropdown === vendor.id ? null : vendor.id)}
                  className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                >
                  <MoreVertical size={18} className="text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {activeDropdown === vendor.id && (
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

                    {(["approved", "rejected", "pending", "blocked"] as const)
                      .filter((status) => status !== vendor.status)
                      .map((status) => (
                        <button
                          key={status}
                          onClick={() => changeVendorStatus(vendor.id, status)}
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
        ) : (
          <div className="p-8 text-center text-gray-400">No vendors found matching your criteria</div>
        )}
      </motion.div>
    </motion.div>
  )
}
