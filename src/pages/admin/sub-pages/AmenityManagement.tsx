import { GenericTable } from "@/components/ReusableComponents/GenericTable"
import { type TableColumn, type TableAction, type TableFilter, type ExtendableItem } from "@/types/table.type"
import { adminService, type AmenityStatus } from "@/services/adminService"
import { Edit, Shield, Trash, Wrench } from "lucide-react"
import toast from "react-hot-toast"
import type { FetchParams, ApiResponse } from "@/types/api.type"
import { useRef, useState } from "react"
import type { TableRef } from "@/components/ReusableComponents/LightGenericTable"
import { AddAmenityForm } from "./AddAmenity"
import ConfirmModal from "@/components/ReusableComponents/ConfirmModal"

interface Amenity extends ExtendableItem {
  name: string;
  isActive: boolean;
}

function AmenityManagement() {
  const tableRef = useRef<TableRef<Amenity>>(null)
  const [activeFilter, setActiveFilter] = useState("all")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [amenityToDelete, setAmenityToDelete] = useState<Amenity | null>(null)

  const columns: TableColumn<Amenity>[] = [
   {
      key: "Amenity",
      label: "Amenity",
      width: "col-span-6 md:col-span-3",
      render: () => (
        <Wrench />
      ),
    },
    {
      key: "name",
      label: "Amenity Name",
      width: "col-span-6 md:col-span-4",
      render: (item) => <span className="text-gray-300 truncate">{item.name}</span>
    },
    {
      key: "status",
      label: "Status",
      width: "col-span-6 md:col-span-2",
      render: (item) => (
        <span className={`font-medium ${item.isActive ? "text-green-500" : "text-red-500"}`}>
          {item.isActive ? "Active" : "Non-active"}
        </span>
      )
    }
  ]

  const actions: TableAction<Amenity>[] = [
    {
      label: "Edit",
      icon: <Edit size={16} />,
      onClick: (amenity) => {
        setEditingAmenity(amenity)
        setShowAddForm(true)
      },
      refreshAfter: false,
      variant: "default",
      condition: () => true
    },
    {
      label: (item) => item.isActive ? "Make Non-active" : "Make Active",
      icon: <Shield size={16} />,
      onClick: async (amenity) => {
        try {
          const newStatus: AmenityStatus = amenity.isActive ? "non-active" : "active"
          const response = await adminService.updateEntityStatus("amenity",amenity._id, newStatus) 

          if (response.success) {
            tableRef.current?.updateItemOptimistically(amenity._id, { isActive: newStatus === "active" })
            toast.success(`Amenity ${newStatus ? "activated" : "deactivated"} successfully`)
          } else {
            toast.error(response.message || "Failed to update amenity status")
          }
        } catch (error) {
          toast.error("An error occurred while updating amenity status")
          console.error("Status update error:", error)
        }
      },
      refreshAfter: false,
      variant: "danger",
      condition: () => true
    },
    {
      label: "Delete",
      icon: <Trash size={16} />,
      onClick: (amenity) => {
        setAmenityToDelete(amenity)
        setShowConfirmModal(true)
      },
      refreshAfter: false,
      variant: "danger",
      condition: () => true
    }
  ]

  const filters: TableFilter[] = [
    { key: "all", label: "All", value: "all" },
    { key: "active", label: "Active", value: "active" },
    { key: "non-active", label: "Non-active", value: "non-active" }
  ]

  const fetchAmenities = async (params: FetchParams): Promise<ApiResponse<Amenity>> => {
    try {
      const status =
        activeFilter === "active"
          ? true
          : activeFilter === "non-active"
          ? false
          : undefined

      const response = await adminService.getAllAmenities(
        params.page,
        params.limit,
        params.search,
        status,
      )
      console.log(response.data);
      return {
        success: response.success,
        users: response.data, 
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalItems: response.data.length,
      }
    } catch (error) {
      console.error("Error fetching amenities:", error)
      return {
        success: false,
        users: [],
        totalPages: 0,
        currentPage: 1,
        totalItems: 0,
      }
    }
  }

  const handleAddAmenity = async (name: string) => {
    try {
      const response = await adminService.createAmenity(name);
      
      if (response.success) {
        toast.success("Amenity added successfully")
        tableRef.current?.refreshData()
      } else {
        toast.error(response.message || "Failed to add amenity")
      }
    } catch (error) {
      toast.error("An error occurred while adding amenity")
      console.error("Add amenity error:", error)
    }
  }

  const handleEditAmenity = async (id: string, name: string) => {
    try {
      const response = await adminService.editAmenity(name,id);
      
      if (response.success) {
        toast.success("Amenity updated successfully")
        tableRef.current?.refreshData()
      } else {
        toast.error(response.message || "Failed to update amenity")
      }
    } catch (error) {
      toast.error("An error occurred while updating amenity")
      console.error("Update amenity error:", error)
    }
  }

  const handleConfirmDelete = async () => {
    if (!amenityToDelete) return
    try {
      const response = await adminService.deleteAmenity(amenityToDelete._id)
      if (response.success) {
        toast.success("Amenity deleted successfully")
        tableRef.current?.refreshData()
      } else {
        toast.error(response.message || "Failed to delete amenity")
      }
    } catch (error) {
      toast.error("An error occurred while deleting amenity")
      console.error("Delete amenity error:", error)
    } finally {
      setAmenityToDelete(null)
    }
  }

  const handleCloseForm = () => {
    setShowAddForm(false)
    setEditingAmenity(null)
  }

  return (
    <>
    <GenericTable<Amenity>
      ref={tableRef}
      title="Amenity Management"
      columns={columns}
      actions={actions}
      filters={filters}
      searchPlaceholder="Search amenities..."
      itemsPerPage={4}
      fetchData={fetchAmenities}
      emptyMessage="No amenities found matching your criteria"
      loadingMessage="Loading amenities..."
      onFilterChange={(val) => setActiveFilter(val)}
      showAddButton={true}
      addButtonLabel="Add Amenity"
      onAddClick={() => setShowAddForm(true)}
    />

    <AddAmenityForm
        isOpen={showAddForm}
        onClose={handleCloseForm}
        onSubmit={handleAddAmenity}
        onEdit={handleEditAmenity}
        editingAmenity={editingAmenity}
      />

     <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false)
          setAmenityToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Amenity"
        message={`Are you sure you want to delete "${amenityToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
  
   </>   
  )
}

export default AmenityManagement
