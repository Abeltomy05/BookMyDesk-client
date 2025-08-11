import { useRef, useState } from "react"
import { X, Check, XCircle } from "lucide-react"
import { GenericTable } from "../ReusableComponents/GenericTable" 
import type { TableColumn, TableAction, ExtendableItem } from "@/types/table.type"
import type { FetchParams, ApiResponse } from "@/types/api.type"
import type { TableRef } from "../ReusableComponents/LightGenericTable" 
import { toast } from "react-hot-toast"
import type { AmenityStatus } from "@/types/service.type"
import { formatDate } from "@/utils/formatters/date"
import RejectionModal from "../ReusableComponents/RejectionModal"
import { amenityRejectionReasons } from "@/utils/constants/reasons"

export interface AmenityRequest extends ExtendableItem {
  name: string
  description: string
  status: AmenityStatus
  createdAt: string
  requestedBy:{
    username:string,
    email: string
  }

}

interface NewAmenityRequestsProps {
  isOpen: boolean
  onClose: () => void
  fetchRequests: (params: FetchParams) => Promise<ApiResponse<AmenityRequest>>
  onStatusChange: (_id:string,status:'active' | 'rejected',reason?:string,email?:string) => Promise<void>

}

export function NewAmenityRequests({
  isOpen,
  onClose,
  fetchRequests,
  onStatusChange
}: NewAmenityRequestsProps) {
  const tableRef = useRef<TableRef<AmenityRequest>>(null)
  const [rejectionModal, setRejectionModal] = useState<{
  isOpen: boolean;
  requestId: string;
  isSubmitting: boolean;
  email?: string;
}>({
  isOpen: false,
  requestId: '',
  isSubmitting: false,
  email: undefined,
})
  const handleRejectionSubmit = async (reason: string,) => {
    setRejectionModal(prev => ({ ...prev, isSubmitting: true }))
    
    try {
      await onStatusChange(rejectionModal.requestId, 'rejected', reason,rejectionModal.email)
      tableRef.current?.removeItemOptimistically?.(rejectionModal.requestId)
      toast.success("Request rejected successfully")
      setRejectionModal({ isOpen: false, requestId: '', isSubmitting: false,email:undefined })
    } catch (error) {
      toast.error("Failed to reject request")
      console.error("Reject error:", error)
      setRejectionModal(prev => ({ ...prev, isSubmitting: false }))
    }
  }

  if (!isOpen) return null

  const columns: TableColumn<AmenityRequest>[] = [
    {
      key: "name",
      label: "Name",
      width: "col-span-3",
      render: (item) => <span className="text-gray-300 font-medium">{item.name}</span>
    },
    {
      key: "description", 
      label: "Description",
      width: "col-span-4",
      render: (item) => (
        <span className="text-gray-300 truncate" title={item.description}>
          {item.description}
        </span>
      )
    },
    {
      key: "requestedDate",
      label: "Requested Date",
      width: "col-span-3",
      render: (item) => (
        <span className="text-gray-400">
          {formatDate(item.createdAt)}
        </span>
      )
    }
  ]

  const actions: TableAction<AmenityRequest>[] = [
    {
      label: "Approve",
      icon: <Check size={16} />,
      onClick: async (request) => {
        try {
          await onStatusChange(request._id,'active')
          tableRef.current?.removeItemOptimistically?.(request._id)
          toast.success("Request approved successfully")
        } catch (error) {
          toast.error("Failed to approve request")
          console.error("Approve error:", error)
        }
      },
      refreshAfter: false,
      variant: "success",
      condition: (item) => item.status === "pending"
    },
    {
      label: "Reject", 
      icon: <XCircle size={16} />,
      onClick: async (request) => {
        setRejectionModal({
          isOpen: true,
          requestId: request._id,
          email: request.requestedBy.email,
          isSubmitting: false
        })
      },
      refreshAfter: false,
      variant: "danger",
      condition: (item) => item.status === "pending"
    }
  ]

  return (
    <>
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-black rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-[#f69938]">New Amenity Requests</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Table Container */}
        <div className="overflow-auto max-h-[calc(90vh-80px)]">
          <GenericTable<AmenityRequest>
            ref={tableRef}
            title=""
            columns={columns}
            actions={actions}
            searchPlaceholder=""
            itemsPerPage={4}
            fetchData={fetchRequests}
            emptyMessage="No amenity requests found"
            enableSearch={false}
            enablePagination={true}
            enableActions={true}
            className="bg-transparent p-0"
          />
        </div>
      </div>
    </div>

     <RejectionModal
        isOpen={rejectionModal.isOpen}
        onClose={() => setRejectionModal({ isOpen: false, requestId: '', isSubmitting: false,email:undefined })}
        onSubmit={handleRejectionSubmit}
        title="Reject Amenity Request"
        description="Please select a reason for rejecting this amenity request:"
        predefinedReasons={amenityRejectionReasons}
        isSubmitting={rejectionModal.isSubmitting}
      />
      </>
  )
}