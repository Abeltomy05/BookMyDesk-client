import { useEffect, useState } from "react"
import { MapPin } from "lucide-react"
import ClientLayout from "../ClientLayout"
import { clientService } from "@/services/clientServices"
import toast from "react-hot-toast"
import { LocationInput } from "@/components/ReusableComponents/LocationInput" 
import type { LocationData } from "@/types/location.type"
import { HandledAuthError } from "@/utils/errors/handleAuthError"
import { useNavigate } from "react-router-dom"
import BuildingsListingSkeleton from "@/components/Skeletons/BuildingListingSkeleton"
import BuildingsList, { type Building } from "@/components/ReusableComponents/ListBuilding"


export default function BuildingsListing() {
  const [buildings, setBuildings] = useState<Building[]>([])  
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [availablePrices, setAvailablePrices] = useState<number[]>([]);
  const [selectedType, setSelectedType] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [searchLocation, setSearchLocation] = useState<LocationData | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false)
  const limit = 4;

  const navigate = useNavigate()

  const [currentFilters, setCurrentFilters] = useState({
    locationName: undefined as string | undefined,
    type: undefined as string | undefined,
    priceRange: undefined as string | undefined,
  });

  const getHeroTitle = () => {
    if (currentFilters.locationName && searchLocation) {
      return searchLocation.name.toUpperCase();
    }
    return "BUILDINGS";
  };

  useEffect(() => {
    fetchBuildings()
  }, [currentPage, currentFilters])

  const fetchBuildings = async () => {
    setIsLoading(true)
    try {
      const response = await clientService.fetchBuildings(currentPage, limit, currentFilters)
      console.log(response.data)

      setBuildings(response?.data || []);
      setTotalPages(response.totalPages || 1);

      if (currentPage === 1) {
        const typesSet = new Set<string>(availableTypes); 
        const pricesSet = new Set<number>(availablePrices); 

        response.data.forEach((building: Building) => {
          building.summarizedSpaces?.forEach(space => {
            if (space.name) typesSet.add(space.name);
            if (typeof space.price === "number") pricesSet.add(space.price);
          });
        });

        setAvailableTypes(Array.from(typesSet));
        setAvailablePrices(Array.from(pricesSet).sort((a, b) => a - b)); 
      }

    } catch (error: unknown) {
      if (!(error instanceof HandledAuthError)) {
        toast.error("Failed to fetch buildings")
      }
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleSearch = () => {
    const newFilters = {
      locationName: searchLocation?.name,
      type: selectedType || undefined,
      priceRange: selectedPrice || undefined,
    };

    setCurrentPage(1);
    setCurrentFilters(newFilters); 
  }

  const handleLocationChange = (location: LocationData | null) => {
    setSearchLocation(location)
  }

  const getPriceRangeOptions = () => {
    const ranges = [
      { label: "Under ₹500", value: "0-500" },
      { label: "₹500 - ₹1000", value: "500-1000" },
      { label: "₹1000 - ₹2000", value: "1000-2000" },
      { label: "Over ₹2000", value: "2000+" }
    ];
    return ranges;
  };

  const handleClearFilters = () => {
    setSelectedType("");
    setSelectedPrice("");
    setSearchLocation(null);
    setCurrentPage(1);
    setCurrentFilters({
      locationName: undefined,
      type: undefined,
      priceRange: undefined,
    });
  };

  if (isLoading) {
    return (
      <BuildingsListingSkeleton />
    );
  }

  return (
    <ClientLayout activeMenuItem="buildings">
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div 
          className="relative h-96 bg-cover bg-center flex items-center justify-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://res.cloudinary.com/dnivctodr/image/upload/v1750089129/srptqnckz38fpjjxekdz.jpg')`,
          }}
        >
          {/* Nearby Location Button */}
          <button 
            onClick={() => navigate("/nearby")}
            className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 backdrop-blur-sm text-md cursor-pointer"
          >
            <MapPin size={20} className="text-white" />
            View Nearby Spaces
          </button>

          {/* Hero Content */}
          <div className="text-center text-white">
            <h1 className="text-7xl font-bold tracking-wider">{getHeroTitle()}</h1>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-[#1A1A1A] border-b border-gray-800 py-6">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">

              {/* Left side - Filters */}
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <span className="text-gray-300">Type:</span>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-4 py-2 bg-white border border-gray-600 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f69938]"
                  >
                    <option value="">All types</option>
                    {availableTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-gray-300">Price:</span>
                  <select
                    value={selectedPrice}
                    onChange={(e) => setSelectedPrice(e.target.value)}
                    className="px-4 py-2 bg-white border border-gray-600 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f69938]"
                  >
                    <option value="">Any price</option>
                    {getPriceRangeOptions().map((range) => (
                      <option key={range.value} value={range.value}>{range.label}</option>
                    ))}
                  </select>
                </div>

                {/* Clear filters button */}
                <button
                  onClick={handleClearFilters}
                  className="text-gray-400 hover:text-white text-sm underline"
                >
                  Clear filters
                </button>
              </div>

              {/* Right side - Location Search */}
              <div className="flex gap-2 w-full lg:w-auto lg:min-w-96">
                <div className="flex-1">
                  <LocationInput
                    value={searchLocation}
                    onChange={handleLocationChange}
                    placeholder="Type city, country or any place you love"
                    className="w-full"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="bg-[#f69938] hover:bg-[#de851e] text-white px-6 py-2 rounded-md font-semibold transition-colors whitespace-nowrap disabled:opacity-50"
                >
                  {isLoading ? 'SEARCHING...' : 'SEARCH'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Buildings List Component */}
        <BuildingsList
          buildings={buildings}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={isLoading}
          showPagination={true}
        />
      </div>
    </ClientLayout>
  )
}