import React, { useState, useRef } from 'react';
import { Eye, MapPin, Calendar, Users, Clock } from 'lucide-react';
import { LightGenericTable } from '@/components/ReusableComponents/LightGenericTable';
import { clientService } from '@/services/clientServices';
import { useNavigate } from 'react-router-dom';
import type { TableColumn } from '@/types/table.type';
import type { BookingData } from '@/types/booking.type';
import type { FetchParams } from '@/types/api.type';
import ClientLayout from '../ClientLayout';
import { formatDate } from '@/utils/formatters/date';

const ClientBookings = () => {
  const tableRef = useRef(null);
  const navigate = useNavigate();
  const [currentFilter, setCurrentFilter] = useState<string>("all");

  const fetchBookings = async (params:FetchParams) => {
    try {
      const response = await clientService.getBookings({
        page: params.page || 1,
        limit: params.limit || 4,
        search: params.search || '',
        status: currentFilter  !== 'all' ? currentFilter  : undefined
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

  const getStatusColor = (status:string) => {
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


  const tableColumns:TableColumn<BookingData>[] = [
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
      key: 'building',
      label: 'Building',
      width: 'col-span-3',
      render: (item) => (
        <div>
          <div className="font-medium text-gray-900">
            {item.building?.buildingName || 'N/A'}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <MapPin size={12} />
            {item.building ? item.building?.location?.name : 'N/A'}
          </div>
        </div>
      )
    },
    {
      key: 'space',
      label: 'Space',
      width: 'col-span-3',
      render: (item) => (
        <div>
          <div className="font-medium text-gray-900">
            {item.space?.name || 'N/A'}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Users size={12} />
            {item.numberOfDesks || 0} desks booked
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      width: 'col-span-2',
      render: (item) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(item.status)}`}>
          {item.status}
        </span>
      )
    }
  ];

  const tableActions = [
    {
      label: 'View Details',
      icon: <Eye size={16} />,
      onClick: (item: any) => navigate(`/booking-details/${item._id}`),
      variant: 'default' as const,
      refreshAfter: false
    }
  ];

  const tableFilters = [
    { key: 'all', label: 'All', value: 'all' },
    { key: 'upcoming', label: 'Upcoming', value: 'confirmed' },
    { key: 'past', label: 'Past', value: 'completed' },
    { key: 'cancelled', label: 'Cancelled', value: 'cancelled' },
    { key: 'failed', label: 'Failed', value: 'failed' }
  ];

  return (
    <ClientLayout activeMenuItem="bookings">
    <div className="p-6 bg-gray-50 min-h-screen">
      <LightGenericTable
        ref={tableRef}
        title="My Bookings"
        columns={tableColumns}
        actions={tableActions}
        filters={tableFilters}
        fetchData={fetchBookings}
        enableSearch={false}
        enablePagination={true}
        enableActions={true}
        itemsPerPage={4}
        emptyMessage="No bookings found"
        loadingMessage="Loading bookings..."
        onFilterChange={handleFilterChange}
      />

    </div>
    </ClientLayout>
  );
};

export default ClientBookings;