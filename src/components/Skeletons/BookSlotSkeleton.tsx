export default function SkeletonSpaceBooking() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded-md w-3/4 mb-2 animate-pulse"></div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-200 rounded mr-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded-md w-1/2 animate-pulse"></div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column Skeleton */}
          <div className="space-y-6">
            {/* Image Skeleton */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="w-full h-80 bg-gray-200 animate-pulse"></div>
            </div>

            {/* Amenities Skeleton */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-6">
              <div className="h-6 bg-gray-200 rounded-md w-1/3 mb-4 animate-pulse"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50">
                    <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded-md flex-1 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column Skeleton - Booking Form */}
          <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-6">
              <div className="h-6 bg-gray-200 rounded-md w-1/2 mb-6 animate-pulse"></div>

              {/* Date Selection Skeleton */}
              <div className="space-y-4 mb-6">
                <div className="h-4 bg-gray-200 rounded-md w-1/4 animate-pulse"></div>
                <div className="w-full h-10 bg-gray-200 rounded-md animate-pulse"></div>
              </div>

              {/* Number of Desks Skeleton */}
              <div className="space-y-4 mb-6">
                <div className="h-4 bg-gray-200 rounded-md w-1/4 animate-pulse"></div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-md animate-pulse"></div>
                  <div className="w-20 h-10 bg-gray-200 rounded-md animate-pulse"></div>
                  <div className="w-10 h-10 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
              </div>

              {/* Summary Skeleton */}
              <div className="border-t border-gray-200 pt-6 mb-6">
                <div className="h-5 bg-gray-200 rounded-md w-1/3 mb-4 animate-pulse"></div>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="flex justify-between">
                      <div className="h-4 bg-gray-200 rounded-md w-1/4 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded-md w-1/3 animate-pulse"></div>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between">
                      <div className="h-5 bg-gray-200 rounded-md w-1/4 animate-pulse"></div>
                      <div className="h-5 bg-gray-200 rounded-md w-1/3 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Book Now Button Skeleton */}
              <div className="w-full h-12 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
