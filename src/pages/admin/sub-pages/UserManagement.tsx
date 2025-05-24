
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, MoreVertical, User } from "lucide-react"

type UserStatus = "active" | "blocked"

interface UserData {
  id: string
  username: string
  email: string
  phone: string
  status: UserStatus
  profilePic?: string
}


const sampleUsers: UserData[] = [
  {
    id: "1",
    username: "alexsmith",
    email: "alex.smith@example.com",
    phone: "+1 (555) 123-4567",
    status: "active",
    profilePic: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    username: "sarahjones",
    email: "sarah.jones@example.com",
    phone: "+1 (555) 987-6543",
    status: "active",
  },
  {
    id: "3",
    username: "mikebrown",
    email: "mike.brown@example.com",
    phone: "+1 (555) 456-7890",
    status: "blocked",
    profilePic: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    username: "emilywilson",
    email: "emily.wilson@example.com",
    phone: "+1 (555) 789-0123",
    status: "active",
    profilePic: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    username: "davidlee",
    email: "david.lee@example.com",
    phone: "+1 (555) 234-5678",
    status: "blocked",
  },
]

export default function UserManagement() {
  const [users, setUsers] = useState<UserData[]>(sampleUsers)
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>(sampleUsers)
  const [activeFilter, setActiveFilter] = useState<"all" | UserStatus>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  useEffect(() => {
    let result = users

    if (activeFilter !== "all") {
      result = result.filter((user) => user.status === activeFilter)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (user) =>
          user.username.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.phone.includes(query),
      )
    }

    setFilteredUsers(result)
  }, [users, activeFilter, searchQuery])

  const toggleUserStatus = (userId: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, status: user.status === "active" ? "blocked" : "active" } : user,
      ),
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

  return (
    <motion.div
      className="bg-black text-white p-6 rounded-xl max-w-6xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1 className="text-2xl font-bold mb-6 text-[#f69938]" variants={itemVariants}>
        User Management
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
      </motion.div>

      {/* User List */}
      <motion.div
        className="bg-gray-900 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(246,153,56,0.15)]"
        variants={itemVariants}
      >
        {/* Table Header */}
        <div className="grid grid-cols-12 bg-gray-800 p-4 font-medium text-sm text-gray-300">
          <div className="col-span-4 md:col-span-3">User</div>
          <div className="col-span-4 md:col-span-3 hidden md:block">Email</div>
          <div className="col-span-3 hidden md:block">Phone</div>
          <div className="col-span-4 md:col-span-2">Status</div>
          <div className="col-span-4 md:col-span-1 text-right">Actions</div>
        </div>

        {/* User Rows */}
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <motion.div
              key={user.id}
              className="grid grid-cols-12 p-4 border-b border-gray-800 items-center hover:bg-gray-800/50 transition-colors"
              variants={itemVariants}
              whileHover={{ scale: 1.005 }}
            >
              {/* User with Avatar */}
              <div className="col-span-4 md:col-span-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                  {user.profilePic ? (
                    <img
                      src={user.profilePic || "/placeholder.svg"}
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
              <div className="col-span-3 hidden md:block text-gray-300">{user.phone}</div>

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
                  onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)}
                  className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                >
                  <MoreVertical size={18} className="text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {activeDropdown === user.id && (
                  <motion.div
                    className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-10"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <button
                      onClick={() => toggleUserStatus(user.id)}
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
          <div className="p-8 text-center text-gray-400">No users found matching your criteria</div>
        )}
      </motion.div>
    </motion.div>
  )
}
