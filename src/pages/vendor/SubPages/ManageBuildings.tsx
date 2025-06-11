import { useState } from "react"
import { LightGenericTable } from "@/components/ReusableComponents/LightGenericTable" 
import type { TableColumn, TableAction, TableFilter } from "@/types/table.type"
import { Plus, Edit, Eye, Trash2, Building2, Users, Calendar, MapPin, Archive } from "lucide-react"
import type { ApiResponse, FetchParams } from "@/types/api.type"
import VendorLayout from "../VendorLayout"
import type {  Building, SpaceType } from "@/types/building.type"
import { vendorService } from "@/services/vendorServices"
import { useNavigate } from "react-router-dom"


export default function BuildingManagement() {
  const [currentFilter, setCurrentFilter] = useState<string>("all");
  const navigate = useNavigate();

  const fetchBuildings = async (params: FetchParams): Promise<ApiResponse<Building>> => {
    try {
      const response = await vendorService.getAllBuildings({
        page: params.page,
        limit: params.limit,
        search: params.search,
        status: currentFilter as "approved" | "pending" | "archived" | "all"
      })

      if (response.success) {
        return {
          success: true,
          users: response.buildings,
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          message: response.message
        }
      } else {
        return {
          success: false,
          users: [],
          currentPage: 1,
          totalPages: 0,
          message: response.message || "Failed to fetch buildings"
        }
      }
    } catch (error) {
      console.error("Error in fetchBuildings:", error)
      return {
        success: false,
        users: [],
        currentPage: 1,
        totalPages: 0,
        message: "An error occurred while fetching buildings"
      }
    }
  }

  const renderAvailableSpaces = (spaces: SpaceType[]) => {
    if (!spaces || spaces.length === 0) {
      return <div className="text-sm text-gray-500">No spaces available</div>
    }

    return (
      <div className="space-y-1">
        {spaces.map((space, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            {space.type.toLowerCase().includes('desk') ? (
              <Users className="w-4 h-4 text-blue-400" />
            ) : space.type.toLowerCase().includes('meeting') || space.type.toLowerCase().includes('room') ? (
              <Calendar className="w-4 h-4 text-green-400" />
            ) : (
              <Building2 className="w-4 h-4 text-gray-400" />
            )}
            <span className="capitalize">
              {space.type.replace(/([A-Z])/g, ' $1').trim()}: {space.count}
            </span>
          </div>
        ))}
      </div>
    )
  }

  const columns: TableColumn<Building>[] = [
    {
      key: "name",
      label: "Building Name",
      width: "col-span-3",
      render: (building) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{building.name}</div>
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {building.address}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "availableSpaces",
      label: "Available Spaces",
      width: "col-span-3",
      render: (building) => renderAvailableSpaces(building.availableSpaces),
    },
    {
      key: "status",
      label: "Status",
      width: "col-span-2",
      render: (building) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            building.status === "approved" 
              ? "bg-green-100 text-green-800" 
              : building.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : building.status === "archived"
              ? "bg-gray-100 text-gray-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {building.status.charAt(0).toUpperCase() + building.status.slice(1)}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created Date",
      width: "col-span-3",
      responsive: "hidden",
      render: (building) => (
        <div className="text-sm text-gray-500">
          {new Date(building.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </div>
      ),
    },
  ]

  const actions: TableAction<Building>[] = [
    {
      label: "View & Edit Building",
      icon: <Eye className="w-4 h-4" />,
      onClick: async (building) => {
        console.log("View & Edit building:", building.name)
        // Implement view/edit logic here
        alert(`View & Edit: ${building.name}`)
      },
    },
    {
      label: "Edit Details",
      icon: <Edit className="w-4 h-4" />,
      onClick: async (building) => {
        console.log("Edit building:", building.name)
        // Implement edit logic here
        alert(`Edit: ${building.name}`)
      },
    },
    {
      label: (building) => building.status === "archived" ? "Unarchive Building" : "Archive Building",
      icon: (building) => <Archive className="w-4 h-4" />,
      onClick: async (building) => {
        const action = building.status === "archived" ? "unarchive" : "archive"
        const confirmMessage = building.status === "archived" 
          ? `Are you sure you want to unarchive ${building.name}?`
          : `Are you sure you want to archive ${building.name}?`
          
        if (window.confirm(confirmMessage)) {
          console.log(`${action} building:`, building.name)
          // Implement archive/unarchive logic here
          alert(`${action.charAt(0).toUpperCase() + action.slice(1)}d: ${building.name}`)
        }
      },
      variant: "warning",
    },
    {
      label: "Delete Building",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: async (building) => {
        if (window.confirm(`Are you sure you want to permanently delete ${building.name}? This action cannot be undone.`)) {
          console.log("Delete building:", building.name)
          // Implement delete logic here
          alert(`Deleted: ${building.name}`)
        }
      },
      variant: "danger",
      separator: true,
    },
  ]

  const filters: TableFilter[] = [
    {
      key: "all",
      label: "All Buildings",
      value: "all",
    },
    {
      key: "approved",
      label: "Approved",
      value: "approved",
    },
    {
      key: "pending",
      label: "Pending",
      value: "pending",
    },
    {
      key: "archived",
      label: "Archived",
      value: "archived",
    },
  ]

  const handleAddBuilding = () => {
    navigate("/vendor/register-building")
  }

  const handleFilterChange = (filterValue: string) => {
    setCurrentFilter(filterValue)
  }

  return (
    <VendorLayout
      notificationCount={5}
      backgroundClass="bg-black"
    >
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto pt-16">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Building Management</h1>
              <p className="text-gray-600 mt-1">Manage your buildings and workspace availability</p>
            </div>
            <button
              onClick={handleAddBuilding}
              className="flex items-center gap-2 bg-[#f69938] hover:bg-[#e5873a] text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
              Add Building
            </button>
          </div>

          {/* Buildings Table */}
          <LightGenericTable<Building>
            title="Buildings"
            columns={columns}
            actions={actions}
            filters={filters}
            searchPlaceholder="Search buildings..."
            itemsPerPage={4}
            enableSearch={true}
            enablePagination={true}
            enableActions={true}
            emptyMessage="No buildings found. Add your first building to get started."
            loadingMessage="Loading buildings..."
            fetchData={fetchBuildings}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>
    </VendorLayout>
  )
}
