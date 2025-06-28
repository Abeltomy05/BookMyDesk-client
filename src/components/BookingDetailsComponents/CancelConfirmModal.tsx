import React, { useState } from 'react';

interface CancelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  loading?: boolean;
  isVendor?: boolean;
}

const CancelBookingModal: React.FC<CancelBookingModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  isVendor = false
}) => {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [customReason, setCustomReason] = useState<string>('');

  const clientReasons  = [
    'Change of plans',
    'Found alternative venue',
    'Schedule conflict',
    'Other'
  ];

   const vendorReasons = [
    'Space unavailable due to maintenance',
    'Technical issues',
    'Safety concerns',
    'Other'
  ];

  const defaultReasons = isVendor ? vendorReasons : clientReasons;

  const handleConfirm = () => {
    const reason = selectedReason === 'Other' ? customReason.trim() : selectedReason;
    
    if (!reason) {
      return; 
    }
    
    onConfirm(reason);
  };

  const handleClose = () => {
    if (!loading) {
      setSelectedReason('');
      setCustomReason('');
      onClose();
    }
  };

  const isConfirmDisabled = !selectedReason || (selectedReason === 'Other' && !customReason.trim()) || loading;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm  flex items-center justify-center z-50 p-4 mt-6">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Cancel Booking</h2>
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200 disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Warning Message */}
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <svg
                className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  {isVendor
                    ? 'You are about to cancel this booking for the client.'
                    : 'Are you sure you want to cancel?'}
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  {isVendor
                    ? 'Upon cancellation, the client will receive a full refund to their wallet. This action cannot be undone.'
                    : 'Please note: Upon cancellation, the refund will be credited to your wallet balance and not to your bank account.'}
                </p>
              </div>
            </div>
          </div>


          {/* Reason Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select reason for cancellation <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {defaultReasons.map((reason) => (
                <label key={reason} className="flex items-center">
                  <input
                    type="radio"
                    name="cancelReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    disabled={loading}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 disabled:opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">{reason}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Custom Reason Input */}
          {selectedReason === 'Other' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Please specify your reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                disabled={loading}
                placeholder="Enter your reason for cancellation..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:opacity-50 disabled:bg-gray-50"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">{customReason.length}/500 characters</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200 disabled:opacity-50"
            >
              Keep Booking
            </button>
            <button
              onClick={handleConfirm}
              disabled={isConfirmDisabled}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? 'Cancelling...' : 'Confirm Cancellation'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelBookingModal;