import { useState, useRef } from "react"
import { LightGenericTable } from "@/components/ReusableComponents/LightGenericTable" 
import type { TableColumn, TableAction, TableFilter } from "@/types/table.type"
import { Plus, Eye, Building2, Users, Calendar, MapPin, Archive, MessageCircle } from "lucide-react"
import type { ApiResponse, FetchParams } from "@/types/api.type"
import VendorLayout from "../VendorLayout"
import type {  Building } from "@/types/building.type"
import { vendorService, type BuildingStatus } from "@/services/vendorServices"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import ConfirmModal from "@/components/ReusableComponents/ConfirmModal"
import type{ TableRef } from "@/components/ReusableComponents/LightGenericTable"


export default function BuildingManagement() {
  const [currentFilter, setCurrentFilter] = useState<string>("all");
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    building: Building | null;
    action: string;
    newStatus: BuildingStatus | null;
  }>({
    isOpen: false,
    building: null,
    action: "",
    newStatus: null
  });
  
  const tableRef = useRef<TableRef<Building> | null>(null);
  
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

  const renderAvailableSpaces = (spaces: { name: string; count: number }[]) => {
    if (!spaces || spaces.length === 0) {
      return <div className="text-sm text-gray-500">No spaces available</div>
    }

    return (
      <div className="space-y-1">
        {spaces.map((space, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            {space.name.toLowerCase().includes('desk') ? (
              <Users className="w-4 h-4 text-blue-400" />
            ) : space.name.toLowerCase().includes('meeting') || space.name.toLowerCase().includes('room') ? (
              <Calendar className="w-4 h-4 text-green-400" />
            ) : (
              <Building2 className="w-4 h-4 text-gray-400" />
            )}
            <span className="capitalize">
              {space.name.replace(/([A-Z])/g, ' $1').trim()}: {space.count}
            </span>
          </div>
        ))}
      </div>
    )
  }

  const handleArchiveAction = async () => {
    if (!confirmModal.building || !confirmModal.newStatus) return;

    if (tableRef.current) {
      tableRef.current.updateItemOptimistically(confirmModal.building._id, {
        status: confirmModal.newStatus
      });
    }

    const result = await vendorService.updateBuildingStatus(
      "building", 
      confirmModal.building._id, 
      confirmModal.newStatus
    );

    if (result.success) {
      toast.success(`${confirmModal.building.buildingName} has been ${confirmModal.newStatus}`);
    } else {
      if (tableRef.current) {
        tableRef.current.updateItemOptimistically(confirmModal.building._id, {
          status: confirmModal.building.status
        });
      }
      toast.error(result.message || "Failed to update building status.");
    }
  };

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
            <div className="font-medium text-gray-900">{building.buildingName}</div>
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {building.location.displayName ? building.location.displayName.split(',').slice(0, 2).join(', ') : ""}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "availableSpaces",
      label: "Available Spaces",
      width: "col-span-3",
      render: (building) => renderAvailableSpaces(building.summarizedSpaces),
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
      onClick: (building) => {
        navigate(`/vendor/edit-building/${building._id}`)
      },
       refreshAfter: false
    },
    {
      label: (building) => building.status === "archived" ? "Unarchive Building" : "Archive Building",
      icon: (building) => <Archive className="w-4 h-4" />,
      onClick: async (building) => {
         const isArchived = building.status === "archived";
         const newStatus: BuildingStatus = isArchived ? "approved" : "archived";
         const actionText = isArchived ? "unarchive" : "archive";

           setConfirmModal({
            isOpen: true,
            building: building,
            action: actionText,
            newStatus: newStatus
          });
      },
      refreshAfter: true,
      variant: "warning",
    },
    {
      label: "View Chats",
      icon: <MessageCircle className="w-4 h-4" />,
      onClick: (building) => {
        navigate(`/vendor/chat/${building._id}`)
      },
       refreshAfter: false
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
     {
      key: "rejected",
      label: "Rejected",
      value: "rejected",
    },
  ]

  const handleAddBuilding = () => {
    navigate("/vendor/register-building")
  }

  const handleFilterChange = (filterValue: string) => {
    setCurrentFilter(filterValue)
  }

   const closeConfirmModal = () => {
    setConfirmModal({
      isOpen: false,
      building: null,
      action: "",
      newStatus: null
    });
  };

  return (
    <VendorLayout
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
            ref={tableRef}
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

        {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={handleArchiveAction}
        title={`${confirmModal.action ? confirmModal.action.charAt(0).toUpperCase() + confirmModal.action.slice(1) : ''} Building`}
        message={`Are you sure you want to ${confirmModal.action} "${confirmModal.building?.buildingName}"? This action will change the building's status.`}
        confirmText={confirmModal.action ? confirmModal.action.charAt(0).toUpperCase() + confirmModal.action.slice(1) : 'Confirm'}
        cancelText="Cancel"
        variant="warning"
      />
    </VendorLayout>
  )
}