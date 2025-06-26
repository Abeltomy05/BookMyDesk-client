import React, { useState, useRef } from 'react';
import { Eye, MapPin, Calendar, Users, Clock, Edit, CheckCircle, XCircle, Phone, Mail, User, DollarSign } from 'lucide-react';
import { LightGenericTable } from '@/components/ReusableComponents/LightGenericTable';
import { vendorService } from '@/services/vendorServices';
import { useNavigate } from 'react-router-dom';
import type { TableColumn, TableAction } from '@/types/table.type';
import type { BookingData } from '@/types/booking.type';
import type { FetchParams } from '@/types/api.type';
import VendorLayout from '../VendorLayout';
import { formatCurrency } from '@/utils/formatters/currency';
import toast from 'react-hot-toast';
import { formatDate } from '@/utils/formatters/date';

const VendorManageBookings = () => {
  const tableRef = useRef(null);
  const navigate = useNavigate();
  const [currentFilter, setCurrentFilter] = useState<string>("all");

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

  const handleUpdateStatus = async (booking: BookingData, newStatus: string) => {
    // try {
    //   const response = await vendorService.updateBookingStatus(booking._id, newStatus);
    //   if (response.success) {
    //     if (tableRef.current) {
    //       tableRef.current.updateItemOptimistically(booking._id, { status: newStatus });
    //     }
    //     toast.success('Booking status updated successfully');
    //   } else {
    //     console.error('Failed to update booking status:', response.message);
    //     toast.error(response.message || 'Failed to update booking status');
    //   }
    // } catch (error) {
    //   console.error('Error updating booking status:', error);
    // }
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
      label: 'View Details',
      icon: <Eye size={16} />,
      onClick: (item) => navigate(`/vendor/booking-details/${item._id}`),
      variant: 'default',
      refreshAfter: false
    },
    {
      label: 'Confirm Booking',
      icon: <CheckCircle size={16} />,
      onClick: (item) => handleUpdateStatus(item, 'confirmed'),
      variant: 'success',
      condition: (item) => item.status === 'pending',
      refreshAfter: false
    },
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
     notificationCount={5}
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
    </VendorLayout>
  );
};

export default VendorManageBookings;