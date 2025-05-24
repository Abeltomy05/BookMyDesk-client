
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, MoreVertical, User, ChevronLeft, ChevronRight } from "lucide-react"
import { adminService } from "@/services/adminService"
import toast from "react-hot-toast"

type ClientStatus = "active" | "blocked"

interface ClientData {
  _id: string
  username: string
  email: string
  phone: string
  status: ClientStatus
  avatar?: string
}




export default function ClientManagement() {
  const [users, setUsers] = useState<ClientData[]>([])
  const [loading, setLoading] = useState(false)
  const [activeFilter, setActiveFilter] = useState<"all" | ClientStatus>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const itemsPerPage = 5

  const fetchUsers = async (page: number = 1, search: string = "") => {
       setLoading(true);
       try{
           const response = await adminService.getAllUsers({page, limit: itemsPerPage, search});
           if(response.success){
            let filteredUsers = response.users as ClientData[];
              if (activeFilter !== "all") {
                filteredUsers = filteredUsers.filter(user => user.status === activeFilter)
              }
              console.log("Fetched Users:", filteredUsers);
             setUsers(filteredUsers);
             setTotalPages(response.totalPages)
            setCurrentPage(response.currentPage)
           }else {
           setError("Failed to fetch users")
           setUsers([])
           setTotalPages(0)
      }
       }catch(error){
      setError("An error occurred while fetching users")
      setUsers([])
      setTotalPages(0)
       }finally{
        setLoading(false);
       }
   }

    useEffect(() => {
     fetchUsers(1, searchQuery)
     setCurrentPage(1)
  }, [activeFilter])

   useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchUsers(1, searchQuery)
      setCurrentPage(1)
    }, 500)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery]);

 const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchUsers(page, searchQuery)
    }
  }

   const toggleUserStatus = async(userId: string,currentStatus: ClientStatus) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId ? { ...user, status: currentStatus  === "active" ? "blocked" : "active" } : user,
      ),
    )
    setActiveDropdown(null);

  try {
    const newStatus: ClientStatus = currentStatus === "active" ? "blocked" : "active";
    const response = await adminService.updateUserStatus("client", userId, newStatus);
    
    if (!response.success) {
      toast.error(response.message || "Failed to update user status");
    }else{
      toast.success("User status updated successfully");
    }
  } catch (error) {
    console.error("Failed to update user status:", error);
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId ? { ...user, status: currentStatus } : user
      )
    );
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
  
  
  return (
    <motion.div
      className="bg-black text-white p-6 rounded-xl max-w-6xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1 className="text-2xl font-bold mb-6 text-[#f69938]" variants={itemVariants}>
        Client Management
      </motion.h1>

      {/* Search and Filters */}
      <motion.div className="flex flex-col md:flex-row justify-between mb-6 gap-4" variants={itemVariants}>
        {/* Search Bar */}
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f69938] focus:border-transparent text-white"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-gray-900 p-1 rounded-lg">
          {(["all", "active", "blocked"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-md capitalize transition-all duration-200 ${
                activeFilter === filter
                  ? "bg-[#f69938] text-black font-medium"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {error && (
        <motion.div 
          className="bg-red-900/30 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6"
          variants={itemVariants}
        >
          {error}
        </motion.div>
      )}

      </motion.div>

      {/* User List */}
      <motion.div
        className="bg-gray-900 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(246,153,56,0.15)] min-h-[400px]"
        variants={itemVariants}
      >
        {/* Table Header */}
        <div className="grid grid-cols-12 bg-gray-800 p-4 font-medium text-sm text-gray-300">
          <div className="col-span-4 md:col-span-3">Client</div>
          <div className="col-span-4 md:col-span-3 hidden md:block">Email</div>
          <div className="col-span-3 hidden md:block">Phone</div>
          <div className="col-span-4 md:col-span-2">Status</div>
          <div className="col-span-4 md:col-span-1 text-right">Actions</div>
        </div>

       {loading && (
          <div className="p-8 text-center text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f69938] mx-auto"></div>
            <p className="mt-2">Loading clients...</p>
          </div>
        )}

        {/* User Rows */}
        {!loading && users.length > 0 ? (
          users.map((user) => (
            <motion.div
              key={user._id}
              className="grid grid-cols-12 p-4 border-b border-gray-800 items-center hover:bg-gray-800/50 transition-colors"
              variants={itemVariants}
              whileHover={{ scale: 1.005 }}
            >
              {/* User with Avatar */}
              <div className="col-span-4 md:col-span-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                  {user.avatar ? (
                    <img
                      src={user.avatar }
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="text-gray-400" size={20} />
                  )}
                </div>
                <span className="font-medium truncate">{user.username}</span>
              </div>

              {/* Email */}
              <div className="col-span-4 md:col-span-3 hidden md:block text-gray-300 truncate">{user.email}</div>

              {/* Phone */}
              <div className="col-span-3 hidden md:block text-gray-300">{user.phone || "N/A"}</div>

              {/* Status */}
              <div className="col-span-4 md:col-span-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.status === "active"
                      ? "bg-emerald-900/30 text-emerald-400 border border-emerald-500/30"
                      : "bg-red-900/30 text-red-400 border border-red-500/30"
                  }`}
                >
                  {user.status}
                </span>
              </div>

              {/* Actions */}
             <div className="col-span-4 md:col-span-1 text-right relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === user._id ? null : user._id)}
                  className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                >
                  <MoreVertical size={18} className="text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {activeDropdown === user._id && (
                  <motion.div
                    className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-10"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <button
                      onClick={() => toggleUserStatus(user._id, user.status)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded-lg text-sm"
                    >
                      {user.status === "active" ? "Block User" : "Unblock User"}
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-400">No clients found matching your criteria</div>
        )}
      </motion.div>
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
