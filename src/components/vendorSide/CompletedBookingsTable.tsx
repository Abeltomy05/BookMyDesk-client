import React from 'react';
import { motion } from 'framer-motion';
import { Eye, CheckCircle, Calendar } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters/currency';
import { formatDate } from '@/utils/formatters/date';

export type CompletedBooking = {
  _id: string;
  bookingId: string;
  client: { username: string; email: string };
  space: { name: string; pricePerDay: number };
  building: { buildingName: string; location: { name: string; displayName: string } };
  bookingDate: Date;
  status: string;
  totalPrice: number;
  numberOfDesks: number;
};

const CompletedBookingsTable: React.FC<{
  completedBookings: CompletedBooking[];
  loading: boolean;
  onViewAll?: () => void;
}> = ({ 
  completedBookings = [], 
  loading = false, 
  onViewAll 
}) => {

  const tableVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { delay: 0.5 }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (index:number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: 0.1 * index }
    })
  };

  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center"
    >
      <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No completed bookings yet</h3>
      <p className="text-gray-600">Your completed bookings will appear here once customers book your spaces.</p>
    </motion.div>
  );

  // If no bookings and not loading, show empty state
  if (!loading && completedBookings.length === 0) {
    return <EmptyState />;
  }

  // If no bookings but loading, don't render anything
  if (completedBookings.length === 0) {
    return null;
  }

  return (
    <motion.div
      variants={tableVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="mb-8"
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Recent Completed Bookings</h2>
            {onViewAll && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onViewAll}
                className="bg-[#f69938] text-white px-4 py-2 rounded-lg hover:bg-[#e8872e] transition-colors duration-200 flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>View All</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Space
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Building
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Number of Desk
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {completedBookings.map((booking, index) => (
                <motion.tr
                  key={booking._id}
                  custom={index}
                  variants={rowVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {booking.bookingId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{booking.client.username}</div>
                      <div className="text-gray-500 text-xs">{booking.client.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{booking.space.name}</div>
                      <div className="text-gray-500 text-xs">
                        { formatCurrency(booking.space.pricePerDay)} 
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{booking.building.buildingName}</div>
                      <div className="text-gray-500 text-xs">{booking.building.location.displayName.split(',').slice(0,2).join(', ')}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(booking.bookingDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.numberOfDesks}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {booking.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default CompletedBookingsTable;