
import { useRef, useState } from "react"
import { GenericTable } from "@/components/ReusableComponents/GenericTable"
import { User, Building2, Eye,} from "lucide-react"
import { adminService } from "@/services/adminService"
import toast from "react-hot-toast"
import VendorDetails from "./VendorDetails"
import type { TableColumn, TableAction, TableFilter, ExtendableItem } from "@/types/table.type"
import type { ApiResponse, FetchParams } from "@/types/api.type"
import type { TableRef } from "@/components/ReusableComponents/LightGenericTable"


type VendorStatus = "approved" | "rejected" | "pending" | "blocked"

interface VendorData extends ExtendableItem{
  _id: string
  username: string
  companyName: string
  status: VendorStatus
  avatar?: string
  email: string
  phone: string
  createdAt?: string
  companyAddress?: string
  description?: string
}



export default function VendorManagement() {
  const [activeFilter, setActiveFilter] = useState<VendorStatus | "all">("all")
  const [selectedVendor, setSelectedVendor] = useState<VendorData | null>(null)
  const tableRef = useRef<TableRef<VendorData>>(null)


   const fetchVendors =  async (params: FetchParams): Promise<ApiResponse<VendorData>> =>  {
     try {
      const response = await adminService.getAllUsers({
        role: "vendor",
        page: params.page,
        limit: params.limit,
        search: params.search,
        status: activeFilter === "all" ? undefined : activeFilter,
        excludeStatus: "pending"
      });

      if(response.success){
       return {
          success: true,
          users: response.users as VendorData[],
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          totalItems:  response.users.length
        }

      }else{
        return {
          success: false,
          users: [],
          currentPage: 1,
          totalPages: 0,
          message: "Failed to fetch vendors"
        }
      }
     } catch (error) {
      console.error("Error fetching vendors:", error)
      return {
        success: false,
        users: [],
        currentPage: 1,
        totalPages: 0,
        message: "An error occurred while fetching vendors"
      }
    }
   }

  const changeVendorStatus = async(vendorId: string, newStatus: VendorStatus) => {
  try {
    const response = await adminService.updateEntityStatus("vendor", vendorId, newStatus)
    if (response.success) {
      tableRef.current?.updateItemOptimistically(vendorId, { status: newStatus })
      toast.success(`Vendor status updated to ${newStatus}`)
    } else {
      toast.error(response.message || "Failed to update vendor status")
    }
  } catch (err) {
    console.error("Status update failed", err)
  }
  }

    const columns: TableColumn<VendorData>[] = [
    {
      key: "vendor",
      label: "Vendor",
      width: "col-span-4 md:col-span-3",
      render: (vendor: VendorData) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
            {vendor.avatar ? (
              <img
                src={`${import.meta.env.VITE_CLOUDINARY_SAVE_URL}${vendor.avatar}`}
                alt={vendor.username}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
              />
            ) : (
              <User className="text-gray-400" size={20} />
            )}
          </div>
          <span className="font-medium truncate">{vendor.username}</span>
        </div>
      )
    },
    {
      key: "companyName",
      label: "Company Name",
      width: "col-span-4 md:col-span-6",
      responsive: "hidden",
      render: (vendor: VendorData) => (
        <div className="flex items-center gap-2">
          <Building2 size={16} className="text-gray-400" />
          {vendor.companyName ? 
         ( <span className="text-gray-300 truncate">{vendor.companyName}</span> ) :
          "N/A"
          }
        </div>
      )
    },
    {
      key: "status",
      label: "Status",
      width: "col-span-4 md:col-span-2",
      render: (vendor: VendorData) => {
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
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vendor.status)}`}>
            {vendor.status}
          </span>
        )
      }
    }
  ]

   const actions: TableAction<VendorData>[] = [
    {
      label: "View Details",
      icon: <Eye size={16} />,
      onClick: (vendor: VendorData) => {
        setSelectedVendor(vendor)
      },
      variant: "default",
      refreshAfter:false,
    },
    {
      label: "Approve",
      onClick: (vendor: VendorData) => changeVendorStatus(vendor._id, "approved"),
      condition: (vendor: VendorData) => vendor.status !== "approved",
      variant: "success",
      separator: true,
      refreshAfter:false,
    },
    {
      label: "Reject",
      onClick: (vendor: VendorData) => changeVendorStatus(vendor._id, "rejected"),
      condition: (vendor: VendorData) => vendor.status !== "rejected",
      variant: "danger",
      refreshAfter:false,
    },
    {
      label: "Block",
      onClick: (vendor: VendorData) => changeVendorStatus(vendor._id, "blocked"),
      condition: (vendor: VendorData) => vendor.status !== "blocked",
      variant: "warning",
      refreshAfter:false,
    }
  ]

  const filters: TableFilter[] = [
    { key: "all", label: "All", value: "all" },
    { key: "approved", label: "Approved", value: "approved" },
    { key: "rejected", label: "Rejected", value: "rejected" },
    { key: "blocked", label: "Blocked", value: "blocked" }
  ]

   const handleFilterChange = (filterValue: string) => {
    setActiveFilter(filterValue as VendorStatus | "all")
  }

  return (
    <>
      <GenericTable<VendorData>
         ref={tableRef}
        title="Vendor Management"
        columns={columns}
        actions={actions}
        filters={filters}
        searchPlaceholder="Search vendors..."
        itemsPerPage={4}
        enableSearch={true}
        enablePagination={true}
        enableActions={true}
        emptyMessage="No vendors found matching your criteria"
        loadingMessage="Loading vendors..."
        fetchData={fetchVendors}
        onFilterChange={handleFilterChange}
        className="max-w-6xl"
      />

      {/* Vendor Details Modal */}
      {selectedVendor && (
        <VendorDetails
          vendor={selectedVendor}
          onClose={() => setSelectedVendor(null)}
        />
      )}
    </>
  )
}
