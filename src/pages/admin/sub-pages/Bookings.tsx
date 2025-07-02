import { useState, useMemo, useEffect  } from "react"
import { TableLoadingSkeleton } from "@/components/Skeletons/TableLoadingSkeleton"
import { motion } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Calendar,
  Building,
  User,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { adminService } from "@/services/adminService"


interface BookingData {
  _id: string
  bookingDate: string
  totalPrice: number
  status: string
  clientName: string
  clientEmail: string
  vendorName: string
  vendorEmail: string
  buildingName: string
  spaceName: string
}


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

const getStatusIcon = (status: string) => {
  switch (status) {
    case "confirmed":
      return <CheckCircle size={16} className="text-green-500" />
    case "completed":
      return <CheckCircle size={16} className="text-blue-500" />
    case "cancelled":
      return <XCircle size={16} className="text-red-500" />
    default:
      return null
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-green-500/20 text-green-400 border-green-500/30"
    case "completed":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30"
    case "cancelled":
      return "bg-red-500/20 text-red-400 border-red-500/30"
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30"
  }
}

const statuses = [
  { value: 'all', label: 'All Statuses' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

export default function AdminBookingsPage() {
  const [selectedVendor, setSelectedVendor] = useState("all")
  const [selectedBuilding, setSelectedBuilding] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [loading,setLoading] = useState(false)

  const [bookings, setBookings] = useState<BookingData[]>([])

const [vendors, setVendors] = useState<Array<{ _id: string; companyName: string }>>([])
const [buildings, setBuildings] = useState<Array<{ _id: string; buildingName: string }>>([])

const [currentPage, setCurrentPage] = useState(1)
const [totalPages, setTotalPages] = useState(1)
const [totalItems, setTotalItems] = useState(0)

  const itemsPerPage = 4

  const fetchVendorsAndBuilding = async () => {
  try {
    const response = await adminService.getVendorsAndBuildings();
    console.log("Vendors and building",response.data)
    if (response.success) {
     const vendorList = response.data.vendors.names
        const buildingList = response.data.buildings.names

        setVendors([{ _id: "", companyName: "All Vendors" }, ...vendorList])
        setBuildings([{ _id: "", buildingName: "All Buildings" }, ...buildingList])
    }
  } catch (error) {
    console.error('Error fetching vendors:', error)
  }
}

  const fetchBookings = async () => {
  setLoading(true)
  try {
   const params: any = {
      page: currentPage,
      limit: itemsPerPage,
    }

     if (selectedVendor && selectedVendor !== "all" && selectedVendor !== "") {
      params.vendorId = selectedVendor
    }

    if (selectedBuilding && selectedBuilding !== "all" && selectedBuilding !== "") {
      params.buildingId = selectedBuilding
    }

    if (selectedStatus && selectedStatus !== "all") {
      params.status = selectedStatus
    }  
    
    const response = await adminService.getBookingsForAdmin(params)

    if (response.success) {
      setBookings(response.data.bookings)
      setTotalPages(response.data.totalPages)
      setTotalItems(response.data.total)
    }
  } catch (error) {
    console.error('Error fetching bookings:', error)
  } finally {
    setTimeout(()=>{
      setLoading(false);
    },2000)
  }
}


useEffect(() => {
  fetchVendorsAndBuilding()
}, [])

useEffect(() => {
  setCurrentPage(1) 
}, [selectedVendor, selectedBuilding, selectedStatus])

useEffect(() => {
  fetchBookings()
}, [currentPage, selectedVendor, selectedBuilding, selectedStatus])

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const currentBookings = bookings;
  const pagination = {
    currentPage,
    totalPages,
    totalItems,
  }
  const enablePagination = true
  const validVendors = vendors.filter(v => v._id && v._id !== "");
  const validBuildings = buildings.filter(b => b._id && b._id !== "");
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <motion.div className="max-w-7xl mx-auto" variants={containerVariants} initial="hidden" animate="visible">
        {/* Filters */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gray-800 border-gray-700 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: "#f69938" }}>
                <Filter size={20} />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
            <div className="flex flex-wrap items-center justify-start gap-3">
                {/* Vendor Filter */}
                <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white h-10 text-sm w-[160px]">
                    <div className="flex items-center gap-2">
                    <User size={16} />
                    <SelectValue placeholder="Vendor" />
                    </div>
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="all">All Vendors</SelectItem>
                    {validVendors.map((vendor) => (
                    <SelectItem key={vendor._id} value={vendor._id} className="text-white hover:bg-gray-600">
                        {vendor.companyName}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>

                {/* Building Filter */}
                <Select value={selectedBuilding} onValueChange={setSelectedBuilding}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white h-10 text-sm w-[160px]">
                    <div className="flex items-center gap-2">
                    <Building size={16} />
                    <SelectValue placeholder="Building" />
                    </div>
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="all">All Buildings</SelectItem>
                    {validBuildings.map((building) => (
                    <SelectItem key={building._id} value={building._id} className="text-white hover:bg-gray-600">
                        {building.buildingName}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>

                {/* Status Filter */}
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white h-10 text-sm w-[150px]">
                    <div className="flex items-center gap-2">
                    <CheckCircle size={16} />
                    <SelectValue placeholder="Status" />
                    </div>
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                    {statuses.map((status) => (
                    <SelectItem key={status.value} value={status.value} className="text-white hover:bg-gray-600">
                        {status.label}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
            </CardContent>

          </Card>
        </motion.div>

        {/* Bookings Table */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gray-800 border-gray-700">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800 border-b border-gray-700">
                  <tr>
                    <th className="text-left p-4 font-semibold" style={{ color: "#f69938" }}>
                      Booking ID
                    </th>
                    <th className="text-left p-4 font-semibold" style={{ color: "#f69938" }}>
                      Customer
                    </th>
                    <th className="text-left p-4 font-semibold" style={{ color: "#f69938" }}>
                      Vendor
                    </th>
                    <th className="text-left p-4 font-semibold" style={{ color: "#f69938" }}>
                      Building
                    </th>
                    <th className="text-left p-4 font-semibold" style={{ color: "#f69938" }}>
                      Space
                    </th>
                    <th className="text-left p-4 font-semibold" style={{ color: "#f69938" }}>
                      Booking Date 
                    </th>
                    <th className="text-left p-4 font-semibold" style={{ color: "#f69938" }}>
                      Status
                    </th>
                    <th className="text-left p-4 font-semibold" style={{ color: "#f69938" }}>
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="p-0">
                        <TableLoadingSkeleton 
                          rows={4} 
                          columns={8} 
                          showActions={false}
                          variant="dark"
                        />
                      </td>
                    </tr>
                  ) : (
                    currentBookings.map((booking, index) => (
                      <motion.tr
                        key={booking._id}
                        className="border-b border-gray-700 hover:bg-gray-750 transition-colors"
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: index * 0.05 }}
                      >
                        <td className="p-4 text-white font-medium">{booking._id}</td>
                        <td className="p-4 text-white">
                          <div className="flex flex-col leading-tight">
                            <span className="font-medium">{booking.clientName}</span>
                            <span className="text-gray-400 text-sm">{booking.clientEmail}</span>
                          </div>
                        </td>
                        <td className="p-4 text-white">
                          <div className="flex flex-col leading-tight">
                            <span className="font-medium">{booking.vendorName}</span>
                            <span className="text-gray-400 text-sm">{booking.vendorEmail}</span>
                          </div>
                        </td>
                        <td className="p-4 text-white">{booking.buildingName}</td>
                        <td className="p-4 text-white">{booking.spaceName}</td>
                        <td className="p-4 text-white">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-gray-400" />
                            <span>{new Date(booking.bookingDate).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className={`flex items-center gap-1 w-fit ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            {booking.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-white font-semibold">₹{booking.totalPrice}</td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

           {currentBookings.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No bookings found matching your criteria</p>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Pagination */}
        {enablePagination && !loading && pagination.totalPages > 1 && (
          <motion.div className="flex items-center justify-between mt-6" variants={itemVariants}>
            <div className="text-sm text-gray-400">
              Page {pagination.currentPage} of {pagination.totalPages}
              {pagination.totalItems && <span className="ml-2">({pagination.totalItems} total items)</span>}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pagination.currentPage === 1
                    ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
              >
                <ChevronLeft size={16} className="mr-1" />
                Previous
              </button>
              {/* Page Numbers */}
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1
                  } else if (pagination.currentPage <= 3) {
                    pageNum = i + 1
                  } else if (pagination.currentPage >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i
                  } else {
                    pageNum = pagination.currentPage - 2 + i
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        pagination.currentPage === pageNum
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
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pagination.currentPage === pagination.totalPages
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
    </div>
  )
}