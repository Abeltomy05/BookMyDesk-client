import type React from "react"
import { Calendar, MapPin, Phone, Mail, Building, DollarSign, BookOpen, X } from "lucide-react"
import { formatDate } from "@/utils/formatters/date"
import { adminService } from "@/services/adminService"
import toast from "react-hot-toast"
import { useEffect, useState } from "react"
import { formatCurrency } from "@/utils/formatters/currency"

interface VendorDetails {
  _id: string
  username: string
  email: string
  phone: string
  avatar?: string
  banner?: string
  companyName: string
  companyAddress?: string
  description?: string
  status: "pending" | "approved" | "blocked" | "rejected"
  createdAt?: string
}

interface BuildingData{
    buildingName: string;
    summarizedSpaces?: {
      name: string;
      count: number;
      price: number;
    }[];
}

interface VendorDetailsProps {
  vendor?: VendorDetails
  onClose: () => void
}

const VendorDetails: React.FC<VendorDetailsProps> = ({ vendor,onClose }) => {
  const [totalBookings, setTotalBookings] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [buildings, setBuildings] = useState<BuildingData[]>([])
  const [loading, setLoading] = useState(true) 

  const fetchData = async ()=>{
    try {
       setLoading(true)
       if(!vendor?._id) return;
      const response  = await adminService.getSingleVendorData(vendor._id);
      console.log(response.data)
       if (response.success && response.data) {
        setTotalBookings(response.data.totalBookings)
        setTotalRevenue(response.data.totalRevenue?.balance ?? 0)
        setBuildings(response.data.buildings ?? [])
      } else {
        toast.error("Failed to fetch vendor statistics.")
      }
    } catch (error) {
       console.error("Error fetching vendor data:", error)
      toast.error("An error occurred while fetching vendor data.")
    } finally {
      setLoading(false)
    }
  }

   useEffect(() => {
    fetchData()
  }, [vendor?._id])


  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-900 text-green-300 border-green-700"
      case "pending":
        return "bg-yellow-900 text-yellow-300 border-yellow-700"
      case "blocked":
        return "bg-red-900 text-red-300 border-red-700"
      case "rejected":
        return "bg-gray-800 text-gray-300 border-gray-600"
      default:
        return "bg-gray-800 text-gray-300 border-gray-600"
    }
  }

  const getAvatarPlaceholder = (name: string) => {
    const colors = [
      "bg-cyan-500",
      "bg-lime-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-yellow-400",
      "bg-red-500",
      "bg-blue-500",
    ]
    const colorIndex = name.charCodeAt(0) % colors.length
    return colors[colorIndex]
  }

  const getBannerPlaceholder = () => {
    return "bg-gradient-to-r from-cyan-400 to-purple-500"
  }

 if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-white text-lg">Loading vendor details...</p>
      </div>
    )
  }  

  if (!vendor) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500 text-lg">Vendor not found.</p>
      </div>
    )
  }
  const vendorData = vendor;

return (
  <div className="max-w-6xl mx-auto mt-5 p-6 space-y-6 bg-black min-h-screen">
    {/* Banner Section */}
    <div className="relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full transition-all duration-200"
      >
        <X className="w-6 h-6 text-white" />
      </button>
      <div className={`h-48 w-full rounded-lg ${vendorData.banner ? "" : getBannerPlaceholder()}`}>
        {vendorData.banner ? (
          <img
            src={`${import.meta.env.VITE_CLOUDINARY_SAVE_URL}${vendorData.banner}`}
            alt="Vendor Banner"
            className="h-full w-full object-cover rounded-lg"
          />
        ) : null}
      </div>

      {/* Avatar */}
      <div className="absolute -bottom-12 left-6">
        <div
          className={`w-24 h-24 rounded-full border-4 border-white shadow-lg ${
            vendorData.avatar ? "" : getAvatarPlaceholder(vendorData.username)
          } flex items-center justify-center`}
        >
          {vendorData.avatar ? (
            <img
              src={`${import.meta.env.VITE_CLOUDINARY_SAVE_URL}${vendorData.avatar}`}
              alt="Vendor Avatar"
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
            />
          ) : (
            <span className="text-white text-2xl font-bold">
              {vendorData.username.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      </div>
    </div>

    {/* Main Content */}
    <div className="pt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Vendor Info and Buildings */}
      <div className="lg:col-span-2 space-y-6">
        {/* Basic Info */}
        <div className="bg-gray-900 rounded-lg shadow-sm border-gray-700 border p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">{vendorData.username}</h1>
              <p className="text-lg text-gray-300 mt-1">{vendorData.companyName}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                vendorData.status
              )}`}
            >
              {vendorData.status.charAt(0).toUpperCase() + vendorData.status.slice(1)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center text-gray-300">
              <Mail className="w-5 h-5 mr-3" />
              <span>{vendorData.email}</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Phone className="w-5 h-5 mr-3" />
              <span>{vendorData.phone}</span>
            </div>
            <div className="flex items-center text-gray-300">
              <MapPin className="w-5 h-5 mr-3" />
              <span>{vendorData.companyAddress}</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Calendar className="w-5 h-5 mr-3" />
              <span>
                Joined {vendorData.createdAt ? formatDate(vendorData.createdAt) : "N/A"}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
            <p className="text-gray-300 leading-relaxed">{vendorData.description}</p>
          </div>
        </div>

        {/* Buildings & Spaces */}
        <div className="bg-gray-900 rounded-lg shadow-sm border-gray-700 border p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Buildings & Available Spaces</h3>
          {buildings && buildings.length > 0 ? (
            buildings.map((building, index) => (
              <div key={index} className="mb-6">
                <p className="text-md font-semibold text-cyan-400 mb-2">{building.buildingName}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {building.summarizedSpaces && building.summarizedSpaces.length > 0 ? (
                    building.summarizedSpaces.map((space, i) => (
                      <div key={i} className="text-center p-4 bg-gray-800 rounded-lg">
                        <div className="text-2xl font-bold text-white">{space.count}</div>
                        <div className="text-sm text-gray-300 mt-1">{space.name}</div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 col-span-full">No spaces available.</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No buildings found.</p>
          )}
        </div>
      </div>

      {/* Right Column - Stats */}
      <div className="space-y-6">
        {/* Revenue */}
        <div className="bg-gray-900 rounded-lg shadow-sm border-gray-700 border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300">Total Revenue</p>
              <p className="text-2xl font-bold" style={{ color: "#f69938" }}>
                {formatCurrency(totalRevenue ?? 0)}
              </p>
            </div>
            <div className="p-3 rounded-full" style={{ backgroundColor: "rgba(246, 153, 56, 0.1)" }}>
              <DollarSign className="w-6 h-6" style={{ color: "#f69938" }} />
            </div>
          </div>
        </div>

        {/* Buildings */}
        <div className="bg-gray-900 rounded-lg shadow-sm border-gray-700 border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300">Total Buildings</p>
              <p className="text-2xl font-bold text-cyan-400">
                {buildings?.length ?? 0}
              </p>
            </div>
            <div className="p-3 rounded-full bg-cyan-900 bg-opacity-20">
              <Building className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
        </div>

        {/* Bookings */}
        <div className="bg-gray-900 rounded-lg shadow-sm border-gray-700 border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300">Total Bookings</p>
              <p className="text-2xl font-bold text-purple-400">
                {totalBookings}
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-900 bg-opacity-20">
              <BookOpen className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

}

export default VendorDetails
