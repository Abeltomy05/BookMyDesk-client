

export default function BuildingDetailsPageSkeleton() {
  return (
      <>
      <div className="min-h-screen bg-white">
        {/* Hero Section Skeleton */}
        <div className="relative h-[300px] w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%]" />
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4">
              <div className="h-12 bg-white/30 rounded-lg w-96 mx-auto mb-4 animate-pulse-slow"></div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Office Description Section */}
          <div className="grid md:grid-cols-2 gap-14 mb-12">
            <div className="space-y-6">
              {/* Building Name */}
              <div className="space-y-2">
                <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg w-3/4 animate-shimmer bg-[length:200%_100%]"></div>
                <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-md w-1/2 animate-shimmer bg-[length:200%_100%] animation-delay-100"></div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                {[100, 95, 80, 90, 70].map((width, index) => (
                  <div
                    key={index}
                    className={`h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]`}
                    style={{
                      width: `${width}%`,
                      animationDelay: `${index * 150}ms`,
                    }}
                  ></div>
                ))}
              </div>

              {/* Contact Info */}
              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-gray-300 rounded-full animate-pulse mt-0.5"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-32 animate-shimmer bg-[length:200%_100%] animation-delay-200"></div>
                    <div className="space-y-1.5 ml-2">
                      <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-36 animate-shimmer bg-[length:200%_100%] animation-delay-300"></div>
                      <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-44 animate-shimmer bg-[length:200%_100%] animation-delay-400"></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-gray-300 rounded-full animate-pulse"></div>
                  <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-52 animate-shimmer bg-[length:200%_100%] animation-delay-500"></div>
                </div>

                <div className="space-y-2">
                  {[40, 36].map((width, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-gray-300 rounded-full animate-pulse"></div>
                      <div
                        className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]"
                        style={{
                          width: `${width * 4}px`,
                          animationDelay: `${(index + 6) * 100}ms`,
                        }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Map Skeleton */}
            <div className="relative mt-5">
              <div className="w-full h-72 md:h-96 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 rounded-xl animate-shimmer bg-[length:200%_100%] animation-delay-700 relative overflow-hidden">
                {/* Map pin indicators */}
                <div className="absolute top-1/3 left-1/2 w-3 h-3 bg-gray-300 rounded-full animate-bounce animation-delay-1000"></div>
                <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-gray-300 rounded-full animate-bounce animation-delay-1200"></div>
              </div>
            </div>
          </div>

          {/* Available Spaces Section */}
          <div className="mb-12">
            <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg w-52 mb-6 animate-shimmer bg-[length:200%_100%] animation-delay-800"></div>
            <div className="grid md:grid-cols-3 gap-6 mb-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="relative overflow-hidden rounded-xl shadow-sm border border-gray-100">
                  <div className="relative">
                    <div
                      className="w-full h-48 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-[length:200%_100%]"
                      style={{ animationDelay: `${i * 200}ms` }}
                    ></div>
                    <div className="absolute bottom-4 left-4 space-y-2">
                      <div
                        className="h-5 bg-white/40 rounded-md w-20 animate-pulse"
                        style={{ animationDelay: `${i * 200 + 500}ms` }}
                      ></div>
                      <div
                        className="h-4 bg-white/30 rounded w-28 animate-pulse"
                        style={{ animationDelay: `${i * 200 + 700}ms` }}
                      ></div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <div
                        className="w-8 h-8 bg-white/40 rounded-full animate-pulse"
                        style={{ animationDelay: `${i * 200 + 300}ms` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Photos and Amenities Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Photos Section */}
            <div className="md:col-span-2">
              <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg w-28 mb-5 animate-shimmer bg-[length:200%_100%] animation-delay-900"></div>

              {/* Main Photo */}
              <div className="relative h-60 md:h-80 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 rounded-xl mb-4 animate-shimmer bg-[length:200%_100%] animation-delay-1000 overflow-hidden">
                {/* Photo overlay elements */}
                <div className="absolute top-4 left-4 w-12 h-6 bg-white/30 rounded-full animate-pulse animation-delay-1500"></div>
                <div className="absolute bottom-4 right-4 w-16 h-8 bg-white/30 rounded-lg animate-pulse animation-delay-1700"></div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 items-center">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-16 w-24 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 rounded-lg animate-shimmer bg-[length:200%_100%]"
                    style={{ animationDelay: `${1100 + i * 100}ms` }}
                  ></div>
                ))}
                <div className="flex items-center justify-center h-16 ml-auto">
                  <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full w-24 animate-shimmer bg-[length:200%_100%] animation-delay-1500"></div>
                </div>
              </div>
            </div>

            {/* Amenities Section */}
            <div className="md:col-span-1">
              <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg w-32 mb-5 animate-shimmer bg-[length:200%_100%] animation-delay-1200"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50/50">
                    <div
                      className="w-5 h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]"
                      style={{ animationDelay: `${1300 + i * 100}ms` }}
                    ></div>
                    <div
                      className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]"
                      style={{
                        width: `${Math.random() * 60 + 80}px`,
                        animationDelay: `${1350 + i * 100}ms`,
                      }}
                    ></div>
                  </div>
                ))}
              </div>
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
                
                .animation-delay-700 {
                    animation-delay: 700ms;
                }
                
                .animation-delay-800 {
                    animation-delay: 800ms;
                }
                
                .animation-delay-900 {
                    animation-delay: 900ms;
                }
                
                .animation-delay-1000 {
                    animation-delay: 1000ms;
                }
                
                .animation-delay-1200 {
                    animation-delay: 1200ms;
                }
                
                .animation-delay-1500 {
                    animation-delay: 1500ms;
                }
                
                .animation-delay-1700 {
                    animation-delay: 1700ms;
                }
            `}</style>

    </>
  )
}
