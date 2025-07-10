import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Plus, Calendar, Building, MapPin, Trash2 } from 'lucide-react'
import { LightGenericTable, type TableRef } from '@/components/ReusableComponents/LightGenericTable'
import type { BaseItem, TableAction, TableConfiguration } from '@/types/table.type'
import type { ApiResponse, FetchParams } from '@/types/api.type'
import VendorLayout from '../VendorLayout' 
import AddOfferModal from '@/components/OfferComponents/AddNewOfferModal'
import { vendorService } from '@/services/vendorServices'
import toast from 'react-hot-toast'
import ConfirmModal from '@/components/ReusableComponents/ConfirmModal'

interface Offer extends BaseItem {
  _id: string
  title: string
  description: string
  discountPercentage: number
  startDate: string
  endDate: string
  buildingId:string
  buildingName:string
  spaceId:string
  spaceName:string
  status: 'ongoing' | 'expired' | 'upcoming'
  createdAt: string
  updatedAt: string
}

export interface NewOfferForm {
  title: string
  description: string
  percentage: number
  startDate: string
  endDate: string
  buildingId: string
  spaceId: string
}

const OfferPage: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [offerToDelete, setOfferToDelete] = useState<Offer | null>(null)
  
  const tableRef = useRef<TableRef<Offer>>(null)

  const columns: TableConfiguration<Offer>['columns'] = [
    {
      key: 'title',
      label: 'Offer Title',
      width: 'col-span-3',
      render: (offer) => (
        <div>
          <div className="font-medium text-gray-900">{offer.title}</div>
          <div className="text-sm text-gray-500 mt-1">{offer.description}</div>
        </div>
      )
    },
    {
      key: 'percentage',
      label: 'Discount',
      width: 'col-span-2',
      render: (offer) => (
        <div className="font-bold text-green-600">{offer.discountPercentage}% OFF</div>
      )
    },
    {
      key: 'dateRange',
      label: 'Valid Period',
      width: 'col-span-2',
      render: (offer) => (
        <div className="text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <Calendar size={14} />
            {new Date(offer.startDate).toLocaleDateString()}
          </div>
          <div className="text-gray-500">
            to {new Date(offer.endDate).toLocaleDateString()}
          </div>
        </div>
      )
    },
    {
      key: 'offerInfo',
      label: 'Location',
      width: 'col-span-3',
      render: (offer) => (
        <div className="text-sm">
          <div className="flex items-center gap-1 text-gray-900 font-medium">
            <Building size={14} />
            {offer.buildingName}
          </div>
          <div className="flex items-center gap-1 text-gray-600 mt-1">
            <MapPin size={14} />
            {offer.spaceName}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      width: 'col-span-1',
      render: (offer) => {
        const statusColors = {
          ongoing: 'bg-green-100 text-green-800',
          expired: 'bg-red-100 text-red-800',
          upcoming: 'bg-blue-100 text-blue-800'
        }
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[offer.status]}`}>
            {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
          </span>
        )
      }
    }
  ]

  const actions: TableAction<Offer>[] = [
    {
      label: 'Delete Offer',
      icon: <Trash2 size={16} />,
      variant: 'danger' as const,
      onClick: async (offer: Offer) => {
        setOfferToDelete(offer)
        setShowConfirmModal(true)
      },
      refreshAfter: false
    }
  ]

  const fetchOffers = async (params: FetchParams): Promise<ApiResponse<Offer>> => {
    try {
        const page = params.page || 1;
        const limit = params.limit || 5;

        const response = await vendorService.fetchOffers({ page, limit });
        console.log(response.data)
      if (!response.success) {
      throw new Error(response.message || "Failed to fetch offers");
     }

      return {
        success: true,
        users: response.data.offers,   
        currentPage: response.data.page,
        totalPages: response.data.totalPages,
        totalItems: response.data.total,
        message: 'Offers fetched successfully',
      };
    } catch (error:any) {
         console.error("Error fetching offers:", error);
    return {
      success: false,
      users: [],
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      message: error.message || 'Failed to fetch offers',
    };
    }
  }

  const deleteOffer = async (offerId: string): Promise<void> => {
    try {
      const response = await vendorService.deleteOffer(offerId);
       if (!response.success) {
         toast.error(response.message || "Offer deletion failed.");
         return;
       }
      //  toast.success("Offer deleted successfully.");
       tableRef.current?.refreshData();
    } catch (error:any) {
      console.error("Delete offer error:", error);
    toast.error(error.message || "Failed to delete offer. Please try again.");
    }
  }

  const createOffer = async (offerData: NewOfferForm): Promise<void> => {
    setLoading(true)
    setError(null)

    try {
      const response = await vendorService.createOffer(offerData);
       if (!response.success) {
         toast.error(response.message || "Offer creation failed.")
         return
       }
      toast.success("Offer created successfully.") 
      setShowAddForm(false)
      tableRef.current?.refreshData()
    } catch (err) {
      setError('Failed to create offer. Please try again.')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return (
    <VendorLayout
      backgroundClass="bg-black"
    >
      <div className="min-h-screen bg-gray-50 pt-18">
        <div className="max-w-7xl mx-auto">
          <div className='flex justify-between items-center'>
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Offer Management</h1>
              <p className="text-gray-600">Manage your property offers and discounts</p>
            </div>

            {/* Add New Offer Button */}
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-[#f69938] hover:bg-[#e8873a] text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-md hover:shadow-lg"
              >
                <Plus size={20} />
                Add New Offer
              </button>
            </motion.div>
          </div>

          {/* Offers Table */}
          <LightGenericTable<Offer>
            ref={tableRef}
            title="Current Offers"
            columns={columns}
            actions={actions}
            itemsPerPage={4}
            enableSearch={false}
            enablePagination={true}
            enableActions={true}
            emptyMessage="No offers found. Create your first offer to get started."
            loadingMessage="Loading offers..."
            fetchData={fetchOffers}
          />

          {/* Add Offer Modal */}
          <AddOfferModal
            isOpen={showAddForm}
            onClose={() => setShowAddForm(false)}
            onSubmit={createOffer}
            loading={loading}
            error={error}
          />
        </div>

        {offerToDelete && (
          <ConfirmModal
            isOpen={showConfirmModal}
            onClose={() => {
              setShowConfirmModal(false)
              setOfferToDelete(null)
            }}
            onConfirm={async () => {
              if (!offerToDelete) return
              try {
                await deleteOffer(offerToDelete._id)
                toast.success("Offer deleted successfully.")
                tableRef.current?.refreshData()
              } catch (error) {
                toast.error("Failed to delete offer.")
              } finally {
                setOfferToDelete(null)
                setShowConfirmModal(false)
              }
            }}
            title="Delete Offer"
            message={`Are you sure you want to delete "${offerToDelete.title}"? This action cannot be undone.`}
            confirmText="Delete"
            cancelText="Cancel"
            variant="danger"
          />
        )}
      </div>
    </VendorLayout>
  )
}

export default OfferPage