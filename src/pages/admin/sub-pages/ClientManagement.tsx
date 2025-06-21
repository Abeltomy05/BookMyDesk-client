import { GenericTable } from "@/components/ReusableComponents/GenericTable" 
import { type TableColumn, type TableAction, type TableFilter } from "@/types/table.type"
import { adminService } from "@/services/adminService"
import { User, Shield} from "lucide-react"
import toast from "react-hot-toast"
import type { FetchParams, ApiResponse } from "@/types/api.type"
import { useState } from "react"

interface ClientUser {
  _id: string
  username: string
  email: string
  phone: string
  status: "active" | "blocked"
  avatar?: string
}

function ClientManagement() {
  const columns: TableColumn<ClientUser>[] = [
    {
      key: "user",
      label: "Client",
      width: "col-span-4 md:col-span-3",
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" referrerPolicy="no-referrer" crossOrigin="anonymous" />
            ) : (
              <User className="text-gray-400" size={20} />
            )}
          </div>
          <span className="font-medium truncate">{user.username}</span>
        </div>
      )
    },
    {
      key: "email",
      label: "Email",
      width: "col-span-4 md:col-span-3",
      responsive: "hidden",
      render: (user) => <span className="text-gray-300 truncate">{user.email}</span>
    },
    {
      key: "phone",
      label: "Phone",
      width: "col-span-3",
      responsive: "hidden",
      render: (user) => <span className="text-gray-300">{user.phone || "N/A"}</span>
    },
    {
      key: "status",
      label: "Status",
      width: "col-span-4 md:col-span-2",
      render: (user) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          user.status === "active"
            ? "bg-emerald-900/30 text-emerald-400 border border-emerald-500/30"
            : "bg-red-900/30 text-red-400 border border-red-500/30"
        }`}>
          {user.status}
        </span>
      )
    }
  ]

  const actions: TableAction<ClientUser>[] = [
    {
      label: (user) => user.status === "active" ? "Block User" : "Unblock User",
      icon: <Shield size={16} />,
      onClick: async (user) => {
        try {
          const newStatus = user.status === "active" ? "blocked" : "active"
          const response = await adminService.updateEntityStatus("client", user._id, newStatus)
          if (response.success) {
            toast.success(`User ${newStatus === "active" ? "unblocked" : "blocked"} successfully`)
          } else {
            toast.error(response.message || "Failed to update user status")
          }
        } catch (error) {
          toast.error("An error occurred while updating user status")
          console.error("Status update error:", error)
        }
      },
      refreshAfter:true,
      variant: "danger",
      condition: (user) => true
    }
  ]

  const filters: TableFilter[] = [
    { key: "all", label: "All", value: "all" },
    { key: "active", label: "Active", value: "active" },
    { key: "blocked", label: "Blocked", value: "blocked" }
  ]

  const [activeFilter, setActiveFilter] = useState("all")

  const fetchClients = async (params: FetchParams): Promise<ApiResponse<ClientUser>> => {
    try {
      const response = await adminService.getAllUsers({
        role: "client",
        page: params.page,
        limit: params.limit,
        search: params.search,
        status: activeFilter === "all" ? undefined : activeFilter,
      })as ApiResponse<ClientUser>;

      return {
        success: response.success,
        users: response.users,
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalItems: response.users.length,
      }
    } catch (error) {
      console.error("Error fetching clients:", error)
      return {
        success: false,
        users: [],
        totalPages: 0,
        currentPage: 1,
        totalItems: 0,
      }
    }
  }

  return (
    <GenericTable<ClientUser>
      title="Client Management"
      columns={columns}
      actions={actions}
      filters={filters}
      searchPlaceholder="Search clients..."
      itemsPerPage={4}
      fetchData={fetchClients}
      emptyMessage="No clients found matching your criteria"
      loadingMessage="Loading clients..."
       onFilterChange={(val) => setActiveFilter(val)}
    />
  )
}

export default ClientManagement