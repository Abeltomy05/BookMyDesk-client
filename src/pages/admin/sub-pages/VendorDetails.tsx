import type React from "react"
import { Calendar, MapPin, Phone, Mail, Building, DollarSign, BookOpen, X } from "lucide-react"
import { formatDate } from "@/utils/formatters/date"

interface VendorSpace {
  type: string
  count: number
}

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
  totalRevenue?: number
  totalBuildings?: number
  totalBookings?: number
  availableSpaces?: VendorSpace[]
}

interface VendorDetailsProps {
  vendor?: VendorDetails
  onClose: () => void
}

const VendorDetails: React.FC<VendorDetailsProps> = ({ vendor,onClose }) => {
  // Default vendor data for demonstration
  const defaultVendor: VendorDetails = {
    _id: "",
    username: "",
    email: "john@workspace.com",
    phone: "+1 (555) 123-4567",
    companyName: "Workspace Solutions Inc.",
    companyAddress: "123 Business District, New York, NY 10001",
    description:
      "Leading provider of flexible workspace solutions with modern amenities and prime locations across the city.",
    status: "approved",
    createdAt: "2023-06-15T10:30:00Z",
    totalRevenue: 125000,
    totalBuildings: 8,
    totalBookings: 342,
    availableSpaces: [
      { type: "Hot Desk", count: 45 },
      { type: "Meeting Room", count: 12 },
      { type: "Private Office", count: 8 },
      { type: "Conference Hall", count: 3 },
    ],
  }

  const vendorData = vendor || defaultVendor

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
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

  return (
    <div className="max-w-6xl mx-auto mt-5 p-6 space-y-6 bg-black min-h-screen">
      {/* Banner Section */}
      <div className="relative">
         {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full transition-all duration-200"
        >
          <X className="w-6 h-6 text-white" />
        </button>
        <div className={`h-48 w-full rounded-lg ${vendorData.banner ? "" : getBannerPlaceholder()}`}>
          {vendorData.banner ? (
            <img
              src={vendorData.banner || "/placeholder.svg"}
              alt="Vendor Banner"
              className="h-full w-full object-cover rounded-lg"
            />
          ) : null}
        </div>

        {/* Avatar */}
        <div className="absolute -bottom-12 left-6">
          <div
            className={`w-24 h-24 rounded-full border-4 border-white shadow-lg ${vendorData.avatar ? "" : getAvatarPlaceholder(vendorData.username)} flex items-center justify-center`}
          >
            {vendorData.avatar ? (
              <img
                src={vendorData.avatar || "/placeholder.svg"}
                alt="Vendor Avatar"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
              />
            ) : (
              <span className="text-white text-2xl font-bold">{vendorData.username.charAt(0).toUpperCase()}</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Vendor Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <div className="bg-gray-900 rounded-lg shadow-sm border-gray-700 border p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-white">{vendorData.username}</h1>
                <p className="text-lg text-gray-300 mt-1">{vendorData.companyName}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(vendorData.status)}`}
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
                <span>Joined {vendorData.createdAt ? formatDate(vendorData.createdAt) : "N/A"}</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
              <p className="text-gray-300 leading-relaxed">{vendorData.description}</p>
            </div>
          </div>

          {/* Available Spaces Card */}
          <div className="bg-gray-900 rounded-lg shadow-sm border-gray-700 border p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Available Spaces</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {vendorData.availableSpaces && vendorData.availableSpaces.length > 0 ? (
                vendorData.availableSpaces.map((space, index) => (
                    <div key={index} className="text-center p-4 bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-white">{space.count}</div>
                    <div className="text-sm text-gray-300 mt-1">{space.type}</div>
                    </div>
                ))
                ) : (
                <p className="text-gray-400">No spaces available.</p>
                )}
            </div>
          </div>
        </div>

        {/* Right Column - Statistics */}
        <div className="space-y-6">
          {/* Revenue Card */}
          <div className="bg-gray-900 rounded-lg shadow-sm border-gray-700 border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Total Revenue</p>
                <p className="text-2xl font-bold" style={{ color: "#f69938" }}>
                  {formatCurrency(vendorData.totalRevenue ?? 0)}
                </p>
              </div>
              <div className="p-3 rounded-full" style={{ backgroundColor: "rgba(246, 153, 56, 0.1)" }}>
                <DollarSign className="w-6 h-6" style={{ color: "#f69938" }} />
              </div>
            </div>
          </div>

          {/* Buildings Card */}
          <div className="bg-gray-900 rounded-lg shadow-sm border-gray-700 border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Total Buildings</p>
                <p className="text-2xl font-bold" style={{ color: "cyan" }}>
                  {vendorData.totalBuildings}
                </p>
              </div>
              <div className="p-3 rounded-full" style={{ backgroundColor: "rgba(0, 255, 255, 0.1)" }}>
                <Building className="w-6 h-6" style={{ color: "cyan" }} />
              </div>
            </div>
          </div>

          {/* Bookings Card */}
          <div className="bg-gray-900 rounded-lg shadow-sm border-gray-700 border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Total Bookings</p>
                <p className="text-2xl font-bold" style={{ color: "purple" }}>
                  {vendorData.totalBookings}
                </p>
              </div>
              <div className="p-3 rounded-full" style={{ backgroundColor: "rgba(128, 0, 128, 0.1)" }}>
                <BookOpen className="w-6 h-6" style={{ color: "purple" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VendorDetails
