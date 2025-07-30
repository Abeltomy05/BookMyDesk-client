import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Building2, Download, ChevronDown } from 'lucide-react';
import { generateDateOptions } from '@/utils/constants/vendorHome';

interface BuildingOption {
  _id: string;
  name: string;
}

interface DownloadReportSectionProps {
  buildings?: BuildingOption[];
  onDownloadReport: (buildingId?: string, filterParams?: DownloadReportFilterParams) => void;
  className?: string;
}

export interface DownloadReportFilterParams {
  filterType: 'month' | 'year' | 'date';
  date?: string;
  month?: string;
  year: string;
}

const DownloadReportSection: React.FC<DownloadReportSectionProps> = ({
  buildings = [],
  onDownloadReport,
  className = ""
}) => {
  const [showBuildingDropdown, setShowBuildingDropdown] = useState(false);
  
  // Filter states
  const [selectedFilterType, setSelectedFilterType] = useState<'month' | 'year' | 'date'>('month');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  const handleDownloadReport = (buildingId?: string) => {
    const filterParams: DownloadReportFilterParams = {
      filterType: selectedFilterType,
      date: selectedFilterType === 'date' ? selectedDate : undefined,
      month: selectedFilterType === 'month' ? selectedMonth : undefined,
      year: selectedYear
    };

    onDownloadReport(buildingId, filterParams);
    setShowBuildingDropdown(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 }}
      className={`h-full ${className}`}
    >
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 h-full">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Building2 className="w-5 h-5 mr-2 text-[#f69938]" />
          Download Reports
        </h3>
        
        <div className="space-y-3 relative">
          {/* Filter Type Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter Type</label>
            <select
              value={selectedFilterType}
              onChange={(e) => setSelectedFilterType(e.target.value as 'month' | 'year' | 'date')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f69938] focus:border-transparent"
            >
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
              <option value="date">Daily</option>
            </select>
          </div>

          {/* Date Selection Based on Filter Type */}
          <div className="space-y-3">
            {selectedFilterType === 'date' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f69938] focus:border-transparent"
                />
              </div>
            )}

            {selectedFilterType === 'month' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f69938] focus:border-transparent"
                  >
                    <option value="">All Months</option>
                    {generateDateOptions().months.map(month => (
                      <option key={month.value} value={month.value}>{month.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f69938] focus:border-transparent"
                  >
                    {generateDateOptions().years.map(year => (
                      <option key={year} value={year.toString()}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {selectedFilterType === 'year' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f69938] focus:border-transparent"
                >
                  {generateDateOptions().years.map(year => (
                    <option key={year} value={year.toString()}>{year}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Main Download Button */}
          <motion.button
            onClick={() => setShowBuildingDropdown(!showBuildingDropdown)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-[#f69938] text-white py-3 px-4 rounded-lg hover:bg-[#e8872e] transition-colors duration-200 flex items-center justify-between space-x-2"
          >
            <div className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Revenue Report</span>
            </div>
            <ChevronDown 
              className={`w-4 h-4 transition-transform duration-200 ${
                showBuildingDropdown ? 'rotate-180' : ''
              }`} 
            />
          </motion.button>

          {/* Building Selection Dropdown */}
          <AnimatePresence>
            {showBuildingDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 w-68 overflow-y-auto"
              >
                {/* All Buildings Option */}
                <motion.button
                  onClick={() => handleDownloadReport()}
                  whileHover={{ backgroundColor: '#f9fafb' }}
                  className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 border-b border-gray-100 flex items-center space-x-3"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">All Buildings</p>
                    <p className="text-sm text-gray-500">Download complete report</p>
                  </div>
                </motion.button>

                {/* Individual Building Options */}
                {buildings?.map((building, index) => (
                  <motion.button
                    key={building._id}
                    onClick={() => handleDownloadReport(building._id)}
                    whileHover={{ backgroundColor: '#f9fafb' }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-3 last:border-b-0 border-b border-gray-100"
                  >
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-[#f69938]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{building.name}</p>
                      <p className="text-sm text-gray-500">Building-specific report</p>
                    </div>
                  </motion.button>
                ))}

                {/* No Buildings Message */}
                {(!buildings || buildings.length === 0) && (
                  <div className="px-4 py-6 text-center text-gray-500">
                    <Building2 className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No buildings available</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Close dropdown when clicking outside */}
          {showBuildingDropdown && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowBuildingDropdown(false)}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DownloadReportSection;