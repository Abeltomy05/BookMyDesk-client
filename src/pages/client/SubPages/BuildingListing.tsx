import { useEffect, useState } from "react"
import { MapPin, Users, Clock } from "lucide-react"
import ClientLayout from "../ClientLayout"
import { clientService } from "@/services/clientServices"
import toast from "react-hot-toast"
import Pagination from "@/components/ui/Pagination"
import { LocationInput } from "@/components/ReusableComponents/LocationInput" 
import type { LocationData } from "@/types/location.type"
import { HandledAuthError } from "@/utils/errors/handleAuthError"
import { useNavigate } from "react-router-dom"
import BuildingsListingSkeleton from "@/components/Skeletons/BuildingListingSkeleton"

interface Building {
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
  summarizedSpaces:{
    count:number;
    name:string;
    price:number;
  }[]
}

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
  const [showFullDescriptionId, setShowFullDescriptionId] = useState<string | null>(null) 
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

    } catch (error:unknown) {
       if (!(error instanceof HandledAuthError)) {
      toast.error("Failed to fetch buildings")
       }
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleDescription = (id: string) => {
    setShowFullDescriptionId(prev => (prev === id ? null : id))
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

  const deskPrices = buildings
    .flatMap(building =>
      building.summarizedSpaces?.filter(space => space.name.toLowerCase() === "desk") || []
    )
    .map(space => space.price);

  const minDeskPrice = deskPrices.length ? Math.min(...deskPrices) : null;

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
           <BuildingsListingSkeleton/>
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

              {/* Optional: Clear filters button */}
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

      {/* Loading indicator */}
      {isLoading && (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center text-gray-500">Loading buildings...</div>
        </div>
      )}

      {/* No results message */}
      {!isLoading && buildings.length === 0 && (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center text-gray-500">
            No buildings found matching your criteria. Try adjusting your filters.
          </div>
        </div>
      )}

      {/* Listings Section */}
     <div className="max-w-6xl mx-auto px-4 py-12">
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
                <div className="flex-1 ">
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
                    onClick={()=>navigate(`/building-details/${building._id}`)}
                    className="w-full px-6 py-2 border border-[#f69938] text-[#f69938] hover:bg-orange-50 rounded transition-colors cursor-pointer">
                      DETAILS
                    </button>
                    {/* <button className="w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors cursor-pointer">
                      BOOK NOW
                    </button> */}
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
        {!isLoading && buildings.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            className="mt-12"
          />
        )}
      </div>
    </div>
    </ClientLayout>
  )
}