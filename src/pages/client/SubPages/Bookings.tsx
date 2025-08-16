import  { useState, useRef } from 'react';
import { Eye, MapPin, Calendar, Users } from 'lucide-react';
import { LightGenericTable } from '@/components/ReusableComponents/LightGenericTable';
import { clientService } from '@/services/clientServices';
import { useNavigate } from 'react-router-dom';
import type { TableColumn } from '@/types/table.type';
import type { BookingData } from '@/types/booking.type';
import type { FetchParams } from '@/types/api.type';
import { formatBookingDates } from '@/utils/formatters/date';
import { getStatusColor } from '@/utils/constants/reasons';

const ClientBookings = () => {
  const tableRef = useRef(null);
  const navigate = useNavigate();
  const [currentFilter, setCurrentFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({ from: '', to: '' });

  const [selectedBuildingId, setSelectedBuildingId] = useState<string>('');

  const fetchBookings = async (params:FetchParams) => {
    try {
      const response = await clientService.getBookings({
        page: params.page || 1,
        limit: params.limit || 4,
        status: currentFilter  !== 'all' ? currentFilter  : undefined,
        fromDate: dateRange.from || undefined,
        toDate: dateRange.to || undefined,
        buildingId: selectedBuildingId || undefined,
      });
      console.log(response.data)
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

  const fetchBuildings = async (): Promise<{ id: string; name: string }[]> => {
    try {
      const response = await clientService.fetchBuildingsForClient();
      console.log(response)
      if (response.success) {
        const buildingOptions = response.data.map((building: {buildingName: string, _id:string}) => ({
          id: building._id,
          name: building.buildingName
        }));
         return buildingOptions;
      }
    } catch (error) {
      console.error('Error fetching buildings:', error);
    }
    return [];
  };


  const handleFilterChange = (filterValue: string) => {
  setCurrentFilter(filterValue);
};

const handleDateFilterChange = (fromDate: string, toDate: string) => {
 setDateRange({ from: fromDate, to: toDate });
};

  const handleBuildingFilterChange = (buildingId: string) => {
  setSelectedBuildingId(buildingId);
  };

  const tableColumns:TableColumn<BookingData>[] = [
    {
      key: 'bookingDate',
      label: 'Booking Date',
      width: 'col-span-3',
      render: (item) => (
        <div className="flex items-start gap-2">
          <Calendar size={16} className="text-gray-400 mt-1" />
          <span
            className="font-medium whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: formatBookingDates(item.bookingDates) }}
          />
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
        enableDateFilter={true}
        onDateFilterChange={handleDateFilterChange}
        enableBuildingFilter={true}
        fetchBuildings={fetchBuildings} 
        onBuildingFilterChange={handleBuildingFilterChange}
      />

    </div>
  );
};

export default ClientBookings;