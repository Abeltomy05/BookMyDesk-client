import BuildingsList, { type Building } from "@/components/ReusableComponents/ListBuilding"
import { clientService } from "@/services/clientServices"
import type { RootState } from "@/store/store"
import { HandledAuthError } from "@/utils/errors/handleAuthError"
import { MapPin, Search } from "lucide-react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import ClientLayout from "../ClientLayout"


export default function NearbySpaces() {
  const [selectedRadius, setSelectedRadius] = useState<number>(10)
  const [currentFilters, setCurrentFilters] = useState<{
    latitude: number;
    longitude: number;
    radius: number;
    } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const user = useSelector((state:RootState)=>state.client.client) 
  const coordinates = user?.location?.coordinates;

  const radiusOptions = [
    { value: 5, label: "5km" },
    { value: 10, label: "10km" },
    { value: 20, label: "20km" },
    { value: 50, label: "50km" },
  ]

useEffect(() => {
    if (coordinates && coordinates.length === 2) {
    setCurrentFilters({
        latitude: coordinates[1],
        longitude: coordinates[0],
        radius: selectedRadius,
    });
    }
}, [coordinates, selectedRadius])
 
useEffect(() => {
  if (
    currentFilters &&
    currentFilters.latitude &&
    currentFilters.longitude &&
    currentFilters.radius
  ) {
    fetchBuildings();
  }
}, [currentPage, currentFilters]);

const fetchBuildings = async () => {
    setIsLoading(true)
    try {
    const response = await clientService.fetchBuildings(currentPage, 5, {
    latitude: currentFilters?.latitude.toString(),
    longitude: currentFilters?.longitude.toString(),
    radius: currentFilters?.radius.toString(),
    });
    console.log(response.data)

    setBuildings(response?.data || []);
    setTotalPages(response.totalPages || 1);
    } catch (error: unknown) {
    if (!(error instanceof HandledAuthError)) {
        toast.error("Failed to fetch buildings")
    }
    console.error(error)
    } finally {
    setIsLoading(false)
    }
}

const handleRadiusChange = (radius: number) => {
    setSelectedRadius(radius);

    if (!coordinates || coordinates.length !== 2) {
        toast.error("Please add your location in the profile section");
        return;
    }

   const [longitude, latitude] = coordinates; 
   setCurrentFilters({
    latitude,
    longitude,
    radius
  });

  setCurrentPage(1);
}

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  }

  return (
    <ClientLayout>
    <div className="w-full max-w-6xl mx-auto px-4 py-6  min-h-screen">
      {/* Header */}
      <div className="mb-8 ">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-[#f69938] rounded-lg">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nearby Spaces</h1>
            <p className="text-gray-600">Discover buildings and spaces around you</p>
          </div>
        </div>

        {/* Radius Selection */}
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center gap-4 mb-4">
            <Search className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-gray-700">Search Radius:</span>
          </div>

          <div className="flex flex-wrap gap-3">
            {radiusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleRadiusChange(option.value)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  selectedRadius === option.value
                    ? "bg-[#f69938] text-white shadow-md transform scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="mt-4 text-sm text-gray-500">Showing results within {selectedRadius}km radius</div>
        </div>
      </div>

      {/* Buildings List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="py-2">
          <BuildingsList
            buildings={buildings}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isLoading={isLoading}
            showPagination={true}
          />
        </div>
      </div>

      {/* Empty State */}
      {!isLoading && buildings.length === 0 && (
        <div className="bg-white rounded-lg p-12 text-center shadow-sm border">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No spaces found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search radius to find more results.</p>
          <button
            onClick={() => handleRadiusChange(20)}
            className="px-6 py-2 bg-[#f69938] text-white rounded-lg hover:bg-[#e58830] transition-colors"
          >
            Expand to 20km
          </button>
        </div>
      )}
    </div>
    </ClientLayout>
  )
}