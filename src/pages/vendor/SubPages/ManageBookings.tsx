import React, { useState, useRef } from 'react';
import { Eye, MapPin, Calendar, Users, Clock, Edit, CheckCircle, XCircle, Phone, Mail, User, DollarSign } from 'lucide-react';
import { LightGenericTable, type TableRef } from '@/components/ReusableComponents/LightGenericTable';
import { vendorService } from '@/services/vendorServices';
import type { TableColumn, TableAction } from '@/types/table.type';
import type { BookingData } from '@/types/booking.type';
import type { FetchParams } from '@/types/api.type';
import VendorLayout from '../VendorLayout';
import { formatCurrency } from '@/utils/formatters/currency';
import toast from 'react-hot-toast';
import { formatDate } from '@/utils/formatters/date';
import ConfirmModal from '@/components/ReusableComponents/ConfirmModal';
import CancelBookingModal from '@/components/BookingDetailsComponents/CancelConfirmModal';

const VendorManageBookings = () => {
  const tableRef = useRef<TableRef<BookingData> | null>(null);
  const [currentFilter, setCurrentFilter] = useState<string>("all");

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);

  const fetchBookings = async (params: FetchParams) => {
    try {
  
      const response = await vendorService.getBookings({
        page: params.page || 1,
        limit: params.limit || 4,
        search: params.search || '',
        status: currentFilter !== 'all' ? currentFilter : undefined
      });

      if (response.success) {
        return {
          success: true,
          users: response.data || [], 
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          totalItems: response.totalItems
        };
      }
      return {
        success: false,
        message: response.message || 'Failed to fetch bookings',
        users: [],
        currentPage: 1,
        totalPages: 0,
        totalItems: 0
      };
      
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return {
        success: false,
        message: 'An error occurred while fetching bookings',
        users: [],
        currentPage: 1,
        totalPages: 0,
        totalItems: 0
      };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'failed':
        return 'bg-red-100 text-red-800';

      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFilterChange = (filterValue: string) => {
    setCurrentFilter(filterValue);
  };

  const handleCancelBooking = async (reason: string) => {
       if (!selectedBooking) return;
    
    setCancelLoading(true);
    
    try {
      const response = await vendorService.cancelBooking( selectedBooking._id, reason );

      if (response.success) {
        if (tableRef.current) {
          tableRef.current.updateItemOptimistically(selectedBooking._id, { status: 'cancelled' });
        }
        toast.success('Booking cancelled successfully. Refund has been processed.');
        setShowCancelModal(false);
        setSelectedBooking(null);
      } else {
        console.error('Failed to cancel booking:', response.message);
        toast.error(response.message || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('An error occurred while cancelling the booking');
    } finally {
      setCancelLoading(false);
    }
  };

   const handleCompleteBooking = async () => {
    if (!selectedBooking) return;
    
    try {
      const response = await vendorService.updateBookingStatus(
        "booking",
        selectedBooking._id,
        'completed'
      );

      if (response.success) {
        if (tableRef.current) {
          tableRef.current.updateItemOptimistically(selectedBooking._id, { status: 'completed' });
        }
        toast.success('Booking marked as completed successfully');
      } else {
        console.error('Failed to complete booking:', response.message);
        toast.error(response.message || 'Failed to mark booking as completed');
      }
    } catch (error) {
      console.error('Error completing booking:', error);
      toast.error('An error occurred while completing the booking');
    } finally {
      setSelectedBooking(null);
    }
  };

   const handleUpdateStatus = async (booking: BookingData, newStatus: string) => {
    setSelectedBooking(booking);
    
    if (newStatus === 'cancelled') {
      setShowCancelModal(true);
    } else if (newStatus === 'completed') {
      setShowCompleteModal(true);
    }
  };

  const tableColumns: TableColumn<BookingData>[] = [
    {
      key: 'bookingDate',
      label: 'Booking Date',
      width: 'col-span-2',
      render: (item) => (
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-400" />
          <span className="font-medium">{formatDate(item.bookingDate)}</span>
        </div>
      )
    },
    {
      key: 'client',
      label: 'Client Info',
      width: 'col-span-2',
      render: (item) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <User size={12} className="text-gray-400" />
            <span className="font-medium text-sm">{item.client?.username || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Mail size={12} className="text-gray-400" />
            <span className="text-xs text-gray-600">{item.client?.email || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Phone size={12} className="text-gray-400" />
            <span className="text-xs text-gray-600">{item.client?.phone || 'N/A'}</span>
          </div>
        </div>
      )
    },
    {
      key: 'building',
      label: 'Building Info',
      width: 'col-span-2',
      render: (item) => (
        <div>
          <div className="font-medium text-gray-900 text-sm">
            {item.building?.buildingName || 'N/A'}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin size={12} />
            {item.building?.location?.name || 'N/A'}
          </div>
        </div>
      )
    },
    {
      key: 'space',
      label: 'Space Info',
      width: 'col-span-2',
      render: (item) => (
        <div className="space-y-1">
          <div className="font-medium text-gray-900 text-sm">
            {item.space?.name || 'N/A'}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Users size={12} />
            {item.numberOfDesks || 0} desks
          </div>
          <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
            {formatCurrency(item.totalPrice || 0)}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      width: 'col-span-1',
      render: (item) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(item.status)}`}>
          {item.status}
        </span>
      )
    }
  ];

  const tableActions: TableAction<BookingData>[] = [
    {
      label: 'Mark Completed',
      icon: <CheckCircle size={16} />,
      onClick: (item) => handleUpdateStatus(item, 'completed'),
      variant: 'success',
      condition: (item) => item.status === 'confirmed',
      refreshAfter: false
    },
    {
      label: 'Cancel Booking',
      icon: <XCircle size={16} />,
      onClick: (item) => handleUpdateStatus(item, 'cancelled'),
      variant: 'danger',
      condition: (item) => ['pending', 'confirmed'].includes(item.status),
      refreshAfter: false,
      separator: true
    }
  ];

  const tableFilters = [
    { key: 'all', label: 'All Bookings', value: 'all' },
    { key: 'upcoming', label: 'Upcoming', value: 'confirmed' },
    { key: 'past', label: 'Completed', value: 'completed' },
    { key: 'cancelled', label: 'Cancelled', value: 'cancelled' }
  ];

  return (
    <VendorLayout
     backgroundClass="bg-black"
    >
      <div className="pt-18 bg-gray-50 min-h-screen">
        <LightGenericTable
          ref={tableRef}
          title="Manage Bookings"
          columns={tableColumns}
          actions={tableActions}
          filters={tableFilters}
          fetchData={fetchBookings}
          enableSearch={true}
          enablePagination={true}
          enableActions={true}
          itemsPerPage={3}
          searchPlaceholder="Search by client name, building, or space..."
          emptyMessage="No bookings found"
          loadingMessage="Loading bookings..."
          onFilterChange={handleFilterChange}
        />
      </div>

       {/* Cancel Booking Modal */}
     <CancelBookingModal
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false);
          setSelectedBooking(null);
        }}
        onConfirm={handleCancelBooking}
        loading={cancelLoading}
        isVendor={true}
      />

        {/* Mark Completed Modal */}
      <ConfirmModal
        isOpen={showCompleteModal}
        onClose={() => {
          setShowCompleteModal(false);
          setSelectedBooking(null);
        }}
        onConfirm={handleCompleteBooking}
        title="Mark as Completed"
        message={
          selectedBooking 
            ? `Are you sure you want to mark this booking as completed? This will finalize the service delivery for ${selectedBooking.client?.username || 'the client'}. This action cannot be undone.`
            : 'Are you sure you want to mark this booking as completed?'
        }
        confirmText="Yes, Mark Completed"
        cancelText="Not Yet"
        variant="warning"
      />
    </VendorLayout>
  );
};

export default VendorManageBookings;