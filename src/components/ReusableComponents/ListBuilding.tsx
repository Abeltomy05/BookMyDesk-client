import { useState } from "react"
import { MapPin, Clock } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Pagination from "@/components/ui/Pagination"

export interface Building {
  _id: string;
  buildingName: string;
  location: { name: string };
  description: string;
  amenities: string[];
  openingHours: {
    weekdays: { is24Hour: boolean; openTime?: string; closeTime?: string };
    weekends: { is24Hour: boolean; openTime?: string; closeTime?: string };
  };
  images: string[];
  summarizedSpaces: {
    count: number;
    name: string;
    price: number;
  }[]
}

interface BuildingsListProps {
  buildings: Building[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  showPagination?: boolean;
  className?: string;
}

export default function BuildingsList({
  buildings,
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
  showPagination = true,
  className = ""
}: BuildingsListProps) {
  const [showFullDescriptionId, setShowFullDescriptionId] = useState<string | null>(null)
  const navigate = useNavigate()

  const toggleDescription = (id: string) => {
    setShowFullDescriptionId(prev => (prev === id ? null : id))
  }

  if (isLoading) {
    return (
      <div className={`max-w-6xl mx-auto px-4 py-8 ${className}`}>
        <div className="text-center text-gray-500">Loading buildings...</div>
      </div>
    )
  }

  if (buildings.length === 0) {
    return (
      <div className={`max-w-6xl mx-auto px-4 py-8 ${className}`}>
        <div className="text-center text-gray-500">
          No buildings found matching your criteria. Try adjusting your filters.
        </div>
      </div>
    )
  }

  return (
    <div className={`max-w-6xl mx-auto px-4 py-12 ${className}`}>
      <div className="space-y-8">
        {buildings.map((building) => {
          const isExpanded = showFullDescriptionId === building._id;
          const descriptionPreview =
            building.description && building.description.length > 160 && !isExpanded
              ? `${building.description.slice(0, 160)}...`
              : building.description || "";

          return (
            <div key={building._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img
                    src={(Array.isArray(building.images) && building.images[0]) || "/placeholder.svg"}
                    alt={building.buildingName}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>

                <div className="md:w-2/3 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h2 className="font-bold text-xl">
                        {building.buildingName?.toUpperCase() ?? "UNKNOWN"} - IN {building.location?.name?.toUpperCase() ?? "UNKNOWN LOCATION"}
                      </h2>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {descriptionPreview}
                        {building.description?.length > 160 && (
                          <span
                            onClick={() => toggleDescription(building._id)}
                            className="text-[#f69938] cursor-pointer hover:underline ml-1"
                          >
                            {isExpanded ? "LESS ←" : "MORE →"}
                          </span>
                        )}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{building.location?.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            {building.openingHours?.weekdays?.is24Hour
                              ? "24/7 Access"
                              : building.openingHours?.weekdays?.openTime && building.openingHours?.weekdays?.closeTime
                                ? `Open: ${building.openingHours.weekdays.openTime} - ${building.openingHours.weekdays.closeTime}`
                                : "Opening hours unavailable"}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {building.amenities?.map((feature, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-right ml-6">
                      <div className="mb-4">
                        {building.summarizedSpaces?.length ? (
                          <>
                            <div className="text-2xl font-bold text-blue-600">
                              Starting from ₹{Math.min(...building.summarizedSpaces.map(s => s.price || 0))}
                            </div>
                            <div className="text-sm text-gray-500">/day</div>
                            <div className="text-xs text-gray-400 mt-1">all taxes included</div>
                          </>
                        ) : (
                          <div className="text-sm text-gray-500">Pricing unavailable</div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <button
                          onClick={() => navigate(`/building-details/${building._id}`)}
                          className="w-full px-6 py-2 border border-[#f69938] text-[#f69938] hover:bg-orange-50 rounded transition-colors cursor-pointer"
                        >
                          DETAILS
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {showPagination && buildings.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          className="mt-12"
        />
      )}
    </div>
  )
}

