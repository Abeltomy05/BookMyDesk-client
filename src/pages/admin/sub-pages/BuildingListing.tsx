import { useRef, useState } from "react"
import { GenericTable } from "@/components/ReusableComponents/GenericTable"
import { Building2, MapPin, User, Building } from "lucide-react"
import { adminService } from "@/services/adminService"
import type { TableColumn, TableFilter, ExtendableItem } from "@/types/table.type"
import type { ApiResponse, FetchParams } from "@/types/api.type"
import type { TableRef } from "@/components/ReusableComponents/LightGenericTable"
import type { BuildingStatus } from "@/types/building.type"
interface VendorInfo {
  _id: string
  username: string
  companyName: string
  avatar?: string
}

interface SpaceInfo {
  name: string
  count: number
  price: number
}

export interface AllBuildingsData extends ExtendableItem {
  _id: string
  buildingName: string
  location: {
    name: string;
  }
  vendor: VendorInfo
  status: BuildingStatus
  summarizedSpaces: SpaceInfo[]
  createdAt?: string
}

export default function BuildingManagement() {
  const [activeFilter, setActiveFilter] = useState<BuildingStatus | "all">("all")
  const tableRef = useRef<TableRef<AllBuildingsData>>(null)

  const fetchBuildings = async (params: FetchParams): Promise<ApiResponse<AllBuildingsData>> => {
    try {
      const response = await adminService.getAllBuildings({
        page: params.page,
        limit: params.limit,
        search: params.search,
        status: activeFilter === "all" ? undefined : activeFilter,
      })
      console.log(response)
      if (response.success) {
        return {
          success: true,
          users: response.buildings as AllBuildingsData[],
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          totalItems: response.buildings.length
        }
      } else {
        return {
          success: false,
          users: [],
          currentPage: 1,
          totalPages: 0,
          message: "Failed to fetch buildings"
        }
      }
    } catch (error) {
      console.error("Error fetching buildings:", error)
      return {
        success: false,
        users: [],
        currentPage: 1,
        totalPages: 0,
        message: "An error occurred while fetching buildings"
      }
    }
  }

  const columns: TableColumn<AllBuildingsData>[] = [
    {
      key: "building",
      label: "Building",
      width: "col-span-3 md:col-span-2",
      render: (building: AllBuildingsData) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
            <Building2 className="text-gray-400" size={20} />
          </div>
          <span className="font-medium truncate">{building.buildingName}</span>
        </div>
      )
    },
    {
      key: "location",
      label: "Location",
      width: "col-span-3 md:col-span-2",
      render: (building: AllBuildingsData) => (
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-gray-400" />
          <span className="text-gray-300 truncate">{building.location.name}</span>
        </div>
      )
    },
    {
      key: "vendor",
      label: "Vendor",
      width: "col-span-3 md:col-span-3",
      render: (building: AllBuildingsData) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
            {building.vendor.avatar ? (
              <img
                src={`${import.meta.env.VITE_CLOUDINARY_SAVE_URL}${building.vendor.avatar}`}
                alt={building.vendor.username}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
              />
            ) : (
              <User className="text-gray-400" size={16} />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-sm truncate">{building.vendor.username}</span>
            {building.vendor.companyName && (
              <span className="text-xs text-gray-400 truncate">{building.vendor.companyName}</span>
            )}
          </div>
        </div>
      )
    },
    {
      key: "status",
      label: "Status",
      width: "col-span-2 md:col-span-2",
      render: (building: AllBuildingsData) => {
        const getStatusColor = (status: BuildingStatus) => {
          switch (status) {
            case "approved":
              return "bg-emerald-900/30 text-emerald-400 border border-emerald-500/30"
            case "rejected":
              return "bg-red-900/30 text-red-400 border border-red-500/30"
            case "pending":
              return "bg-yellow-900/30 text-yellow-400 border border-yellow-500/30"
            case "archived":
              return "bg-gray-900/30 text-gray-400 border border-gray-500/30"
            default:
              return "bg-gray-900/30 text-gray-400 border border-gray-500/30"
          }
        }
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(building.status)}`}>
            {building.status}
          </span>
        )
      }
    },
    {
      key: "spaces",
      label: "Spaces",
      width: "col-span-1 md:col-span-3",
      responsive: "hidden",
      render: (building: AllBuildingsData) => (
        <div className="space-y-1">
          {building.summarizedSpaces.slice(0, 2).map((space, index) => (
            <div key={index} className="flex items-center text-xs gap-2">
                <Building size={12} className="text-gray-400" />
                <span className="text-gray-300">{space.name} •</span>
              <div className="text-gray-400 ">
                Count: {space.count} • ₹{space.price.toLocaleString()}
              </div>
            </div>
          ))}
          {building.summarizedSpaces.length > 2 && (
            <div className="text-xs text-gray-500 ml-4">
              +{building.summarizedSpaces.length - 2} more spaces
            </div>
          )}
          {building.summarizedSpaces.length === 0 && (
            <span className="text-xs text-gray-500">No spaces</span>
          )}
        </div>
      )
    }
  ]

  const filters: TableFilter[] = [
    { key: "all", label: "All", value: "all" },
    { key: "pending", label: "Pending", value: "pending" },
    { key: "approved", label: "Approved", value: "approved" },
    { key: "rejected", label: "Rejected", value: "rejected" },
    { key: "archived", label: "Archived", value: "archived" }
  ]

  const handleFilterChange = (filterValue: string) => {
    setActiveFilter(filterValue as BuildingStatus | "all")
  }

  return (
    <GenericTable<AllBuildingsData>
      ref={tableRef}
      title="Building Management"
      columns={columns}
      actions={[]} // No actions needed as specified
      filters={filters}
      searchPlaceholder="Search buildings..."
      itemsPerPage={4}
      enableSearch={true}
      enablePagination={true}
      enableActions={false} // Disable actions
      emptyMessage="No buildings found matching your criteria"
      loadingMessage="Loading buildings..."
      fetchData={fetchBuildings}
      onFilterChange={handleFilterChange}
      className="max-w-7xl"
    />
  )
}