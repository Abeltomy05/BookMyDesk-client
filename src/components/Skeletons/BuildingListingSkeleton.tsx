import ClientLayout from "@/pages/client/ClientLayout" 

export default function BuildingsListingSkeleton() {
  return (
    <ClientLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section Skeleton */}
        <div className="relative h-96 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-shimmer bg-[length:200%_100%]" />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="h-16 bg-white/30 rounded-lg w-80 mx-auto animate-pulse-slow"></div>
            </div>
          </div>
        </div>

        {/* Filter Section Skeleton */}
        <div className="bg-[#1A1A1A] border-b border-gray-800 py-6">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Left side - Filters Skeleton */}
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <div className="h-4 bg-gray-600 rounded w-12 animate-pulse"></div>
                  <div className="h-10 bg-gray-700 rounded-md w-32 animate-shimmer bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%] animation-delay-200"></div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-4 bg-gray-600 rounded w-10 animate-pulse animation-delay-300"></div>
                  <div className="h-10 bg-gray-700 rounded-md w-36 animate-shimmer bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%] animation-delay-400"></div>
                </div>

                <div className="h-4 bg-gray-600 rounded w-20 animate-pulse animation-delay-500"></div>
              </div>

              {/* Right side - Search Skeleton */}
              <div className="flex gap-2 w-full lg:w-auto lg:min-w-96">
                <div className="flex-1">
                  <div className="h-10 bg-gray-700 rounded-md animate-shimmer bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%] animation-delay-600"></div>
                </div>
                <div className="h-10 bg-gray-300 rounded-md w-24 animate-pulse animation-delay-700"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Listings Section Skeleton */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="space-y-8">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="md:flex">
                  {/* Image Skeleton */}
                  <div className="md:w-1/3">
                    <div
                      className="w-full h-64 md:h-full bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-[length:200%_100%]"
                      style={{ animationDelay: `${index * 200}ms` }}
                    ></div>
                  </div>

                  {/* Content Skeleton */}
                  <div className="md:w-2/3 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1 pr-6">
                        {/* Title */}
                        <div
                          className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-md w-4/5 mb-4 animate-shimmer bg-[length:200%_100%]"
                          style={{ animationDelay: `${index * 200 + 100}ms` }}
                        ></div>

                        {/* Description */}
                        <div className="space-y-2 mb-4">
                          {[85, 90, 75, 60].map((width, lineIndex) => (
                            <div
                              key={lineIndex}
                              className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]"
                              style={{
                                width: `${width}%`,
                                animationDelay: `${index * 200 + 200 + lineIndex * 100}ms`,
                              }}
                            ></div>
                          ))}
                        </div>

                        {/* Location and Hours */}
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                            <div
                              className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-24 animate-shimmer bg-[length:200%_100%]"
                              style={{ animationDelay: `${index * 200 + 600}ms` }}
                            ></div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-300 rounded animate-pulse animation-delay-100"></div>
                            <div
                              className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-32 animate-shimmer bg-[length:200%_100%]"
                              style={{ animationDelay: `${index * 200 + 700}ms` }}
                            ></div>
                          </div>
                        </div>

                        {/* Amenities */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {[1, 2, 3, 4, 5].map((amenityIndex) => (
                            <div
                              key={amenityIndex}
                              className="h-6 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 rounded-full animate-shimmer bg-[length:200%_100%]"
                              style={{
                                width: `${Math.random() * 40 + 60}px`,
                                animationDelay: `${index * 200 + 800 + amenityIndex * 100}ms`,
                              }}
                            ></div>
                          ))}
                        </div>
                      </div>

                      {/* Price and Actions Skeleton */}
                      <div className="text-right min-w-[140px]">
                        <div className="mb-4">
                          <div
                            className="h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-md w-32 mb-1 animate-shimmer bg-[length:200%_100%]"
                            style={{ animationDelay: `${index * 200 + 1000}ms` }}
                          ></div>
                          <div
                            className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-12 mb-1 animate-shimmer bg-[length:200%_100%]"
                            style={{ animationDelay: `${index * 200 + 1100}ms` }}
                          ></div>
                          <div
                            className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-20 animate-shimmer bg-[length:200%_100%]"
                            style={{ animationDelay: `${index * 200 + 1200}ms` }}
                          ></div>
                        </div>

                        <div className="space-y-2">
                          <div
                            className="h-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-full animate-shimmer bg-[length:200%_100%]"
                            style={{ animationDelay: `${index * 200 + 1300}ms` }}
                          ></div>
                          <div
                            className="h-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-full animate-shimmer bg-[length:200%_100%]"
                            style={{ animationDelay: `${index * 200 + 1400}ms` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div className="mt-12 flex justify-center">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] animation-delay-1600"></div>
              {[1, 2, 3, 4, 5].map((pageIndex) => (
                <div
                  key={pageIndex}
                  className="h-10 w-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]"
                  style={{ animationDelay: `${1700 + pageIndex * 100}ms` }}
                ></div>
              ))}
              <div className="h-10 w-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] animation-delay-2200"></div>
            </div>
          </div>
        </div>
      </div>

      <style >{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }
        
        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animation-delay-100 {
          animation-delay: 100ms;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        
        .animation-delay-500 {
          animation-delay: 500ms;
        }
        
        .animation-delay-600 {
          animation-delay: 600ms;
        }
        
        .animation-delay-700 {
          animation-delay: 700ms;
        }
        
        .animation-delay-1600 {
          animation-delay: 1600ms;
        }
        
        .animation-delay-2200 {
          animation-delay: 2200ms;
        }
      `}</style>
    </ClientLayout>
  )
}
