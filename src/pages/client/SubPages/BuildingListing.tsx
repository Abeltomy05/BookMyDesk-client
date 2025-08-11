import { useEffect, useState } from "react"
import { MapPin } from "lucide-react"
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
  const [selectedType, setSelectedType] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [showAmenities, setShowAmenities] = useState(false)
  const [amenityMatchMode, setAmenityMatchMode] = useState<"all" | "any">("all");
  const [searchLocation, setSearchLocation] = useState<LocationData | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false)
  const [fetchedAmenities, setFetchedAmenities] = useState<string[]>([]);
  const limit = 4;

  const navigate = useNavigate()

  const [currentFilters, setCurrentFilters] = useState({
    locationName: undefined as string | undefined,
    type: undefined as string | undefined,
    priceRange: undefined as string | undefined,
    amenities: undefined as string[] | undefined,
    amenityMatchMode: "all" as "all" | "any"
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

  useEffect(() => {
  fetchFilters();
  }, []);
  
  const fetchBuildings = async () => {
    setIsLoading(true)
    try {
      const response = await clientService.fetchBuildings(currentPage, limit, currentFilters)
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

  const fetchFilters = async () => {
  try {
    const response = await clientService.fetchFilters();
    console.log("Filter options:", response.data);
    setAvailableTypes(response.data.spaceNames || []);
  } catch (error) {
    toast.error("Failed to load filter options");
    console.error("Error fetching filter data:", error);
  }
};

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleSearch = () => {
    const newFilters = {
      locationName: searchLocation?.name,
      type: selectedType || undefined,
      priceRange: selectedPrice || undefined,
      amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
      amenityMatchMode,
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
    setSelectedAmenities([]);
    setCurrentPage(1);
    setCurrentFilters({
      locationName: undefined,
      type: undefined,
      priceRange: undefined,
      amenities: undefined,
      amenityMatchMode: "all"
    });
  };

  const toggleAmenity = (amenity: string) => {
  setSelectedAmenities(prev => 
    prev.includes(amenity) 
      ? prev.filter(a => a !== amenity)
      : [...prev, amenity]
  );
  };

  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      setShowAmenities(false);
    }
  };

  if (showAmenities) {
    document.addEventListener('mousedown', handleClickOutside);
  }

  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [showAmenities]);

useEffect(() => {
  const fetchAmenities = async () => {
    try {
      const response = await clientService.getAllAmenities(1, 100, undefined, 'active');
      console.log("Amenities data: ",response.data);
      if (response.success && Array.isArray(response.data)) {
        const names = response.data.map((amenity: {_id:string,name:string}) => amenity.name); 
        setFetchedAmenities(names);
      } else {
        toast.error("Failed to load amenities");
      }
    } catch (error) {
      toast.error("Error fetching amenities");
      console.error("Amenity fetch error:", error);
    }
  };

  if (showAmenities && fetchedAmenities.length === 0) {
    fetchAmenities();
  }
}, [showAmenities, fetchedAmenities.length]);

  if (isLoading) {
    return (
      <BuildingsListingSkeleton />
    );
  }

  return (
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
      <div className="bg-[#1A1A1A] border-b border-gray-800 py-6 px-16">
            <div className="max-w-8xl">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">

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

                  {/* Amenities Filter */}
                  <div className="relative flex items-center gap-2">
                    <span className="text-gray-300">Amenities:</span>
                    <div className="relative">
                      <button
                        onClick={() => setShowAmenities(!showAmenities)}
                        className="px-4 py-2 bg-white border border-gray-600 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f69938] min-w-32 text-left flex items-center justify-between"
                      >
                        <span>
                          {selectedAmenities.length === 0 
                            ? "Select amenities"
                            : `${selectedAmenities.length} selected`
                          }
                        </span>
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Amenities Dropdown  */}
                     {showAmenities && (
                      <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 w-80">
                        
                        {/* Match Mode Selection */}
                        <div className="flex items-center justify-around px-3 py-2 border-b border-gray-200">
                          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                            <input
                              type="radio"
                              value="all"
                              checked={amenityMatchMode === "all"}
                              onChange={() => setAmenityMatchMode("all")}
                              className="form-radio text-[#f69938] focus:ring-[#f69938]"
                            />
                            Match All
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                            <input
                              type="radio"
                              value="any"
                              checked={amenityMatchMode === "any"}
                              onChange={() => setAmenityMatchMode("any")}
                              className="form-radio text-[#f69938] focus:ring-[#f69938]"
                            />
                            Match Any
                          </label>
                        </div>

                        {/* Amenities Checkboxes */}
                        <div className="grid grid-cols-2">
                          {fetchedAmenities.map((amenity) => (
                            <label key={amenity} className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer border-r border-b border-gray-100 last:border-r-0">
                              <input
                                type="checkbox"
                                checked={selectedAmenities.includes(amenity)}
                                onChange={() => toggleAmenity(amenity)}
                                className="mr-2 text-[#f69938] focus:ring-[#f69938]"
                              />
                              <span className="text-gray-900 text-sm">{amenity}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                    </div>
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
  )
}