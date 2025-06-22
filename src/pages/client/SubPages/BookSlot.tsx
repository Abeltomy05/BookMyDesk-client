import { useEffect, useState } from "react"
import { ShieldCheck, MapPin, Calendar, CheckCircle } from "lucide-react"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import ClientLayout from "../ClientLayout"
import { useParams } from "react-router-dom"
import { clientService } from "@/services/clientServices"
import toast from "react-hot-toast"
import SkeletonSpaceBooking from "@/components/Skeletons/BookSlotSkeleton"

export default function SpaceBookingPage() {
  const {spaceId}  = useParams<{ spaceId: string }>(); 
  const [spaceData, setSpaceData] = useState<{
    name:string;
    location:string;
    images:string[] | null;
    pricePerDay: number;
    amenities: string[] | [];
    capacity: number;

  }>({
    name:"",
    location:"",
    images:null,
    pricePerDay: 0,
    amenities: [],
    capacity: 0,
  });
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [numberOfDesks, setNumberOfDesks] = useState(1)
  const [showCalendar, setShowCalendar] = useState(false)
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const fetchData = async () => {
      try {
        if (!spaceId) return;

        console.log("spaceId is: ",spaceId)
        
        setLoading(true);
        const response = await clientService.getBookingPageData(spaceId);
        
        if (!response.success) {
          toast.error(response.message || "Failed to get data, please try again.");
          return;
        }

        const transformedData = {
          name: response.data.space.name,
          location: response.data.building.location,
          images: response.data.building.images,
          pricePerDay: response.data.space.pricePerDay,
          amenities: response.data.space.amenities || [], 
          capacity: response.data.space.capacity,

        };

        console.log("transformedData",transformedData)

        setSpaceData(transformedData);

      } catch (error) {
        console.error("Error in fetchData:", error);
        toast.error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [spaceId])

  useEffect(() => {
  if (!spaceData.images || spaceData.images.length <= 1) return;

  const interval = setInterval(() => {
    setCurrentIndex((prev) => (prev + 1) % spaceData.images!.length);
  }, 4000); 

  return () => clearInterval(interval);
}, [spaceData.images]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    setShowCalendar(false)
  }

  const formatLocation = (location: string): string => {
  const parts = location.split(',').map(p => p.trim());
  if (parts.length <= 4) return location;
  return `${parts[0]}, ${parts[1]}, ${parts[parts.length - 2]}, ${parts[parts.length - 1]}`;
};

  if (loading) {
    return (
      <ClientLayout>
       <SkeletonSpaceBooking />
      </ClientLayout>
    );
  }

  if (!spaceData) {
    return (
      <ClientLayout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 text-lg">Space not found</p>
          </div>
        </div>
      </ClientLayout>
    );
  }

  const totalPrice = numberOfDesks * Number(spaceData.pricePerDay);

  return (
    <ClientLayout>
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">{spaceData.name}</h1>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2" style={{ color: "#f69938" }} />
              <span>{formatLocation(spaceData.location)}</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Space Image */}
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden relative h-80">
                {spaceData.images && spaceData.images.length > 0 ? (
                  <>
                    {spaceData.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Space image ${index + 1}`}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-2000 ease-in-out ${
                          index === currentIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    ))}
                    
                    {/* Image indicators */}
                    {spaceData.images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {spaceData.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              index === currentIndex 
                                ? 'bg-white shadow-lg' 
                                : 'bg-white/50 hover:bg-white/75'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <img
                    src="/placeholder.svg"
                    alt="Placeholder"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              

              {/* Amenities */}
              {spaceData.amenities && spaceData.amenities.length > 0 && (
                <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-black mb-4">Amenities</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {spaceData.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50">
                        <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: "#f69938" }} />
                        <span className="text-gray-700 text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Capacity Info */}
              {/* {spaceData.capacity && (
                <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-black mb-4">Capacity</h3>
                  <div className="flex items-center space-x-3">
                    <ShieldCheck className="w-5 h-5" style={{ color: "#f69938" }} />
                    <span className="text-gray-700">Up to {spaceData.capacity} people</span>
                  </div>
                </div>
              )} */}
            </div>

            {/* Right Column - Booking Form */}
            <div className="space-y-6">
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-6">
                <h3 className="text-xl font-semibold text-black mb-6">Book Your Space</h3>

                {/* Date Selection */}
                <div className="space-y-4 mb-6">
                  <label className="block text-sm font-medium text-black">Select Date</label>
                  <div className="relative">
                    <button
                      onClick={() => setShowCalendar(!showCalendar)}
                      className="w-full flex items-center justify-start px-3 py-2 text-left font-normal border-2 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#f69938] focus:ring-offset-2"
                      style={{
                        borderColor: selectedDate ? "#f69938" : "#d1d5db",
                      }}
                    >
                      <Calendar className="mr-2 h-4 w-4" style={{ color: "#f69938" }} />
                      {selectedDate ? formatDate(selectedDate) : "Select a date"}
                    </button>

                    {showCalendar && (
                      <div className="absolute top-full left-0 mt-2 z-50 bg-white border border-gray-200 rounded-md shadow-lg p-4">
                        <CalendarComponent
                          mode="single"
                          selected={selectedDate}
                          onSelect={handleDateSelect}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Number of Desks */}
                <div className="space-y-4 mb-6">
                  <label className="block text-sm font-medium text-black">No. of Desks</label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setNumberOfDesks(Math.max(1, numberOfDesks - 1))}
                      className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#f69938] focus:ring-offset-2"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={numberOfDesks}
                      onChange={(e) => setNumberOfDesks(Math.max(1, Number.parseInt(e.target.value) || 1))}
                      className="w-20 h-10 text-center border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f69938] focus:ring-offset-2"
                      min="1"
                      max={spaceData.capacity || 100}
                    />
                    <button
                      onClick={() => setNumberOfDesks(Math.min(spaceData.capacity || 100, numberOfDesks + 1))}
                      className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#f69938] focus:ring-offset-2"
                    >
                      +
                    </button>
                  </div>
                  {spaceData.capacity && (
                    <p className="text-xs text-gray-500">Maximum {spaceData.capacity} desks available</p>
                  )}
                </div>

                {/* Summary */}
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h4 className="text-lg font-semibold text-black mb-4">Booking Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Space:</span>
                      <span className="text-black font-medium">{spaceData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="text-black">{formatLocation(spaceData.location)}</span>
                    </div>
                    {selectedDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="text-black">{formatDate(selectedDate)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">No. of Desks:</span>
                      <span className="text-black">{numberOfDesks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price per desk:</span>
                      <span className="text-black">₹{spaceData.pricePerDay}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between font-semibold text-lg">
                        <span className="text-black">Total:</span>
                        <span className="text-black">₹{totalPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Book Now Button */}
                <button
                  className="w-full text-white font-semibold py-3 text-lg rounded-md transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "#f69938" }}
                  disabled={!selectedDate}
                >
                  Book Now
                </button>

                {!selectedDate && (
                  <p className="text-sm text-gray-500 text-center mt-2">Please select a date to continue</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Overlay for calendar */}
        {showCalendar && (
          <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setShowCalendar(false)} />
        )}
      </div>
    </ClientLayout>
  )
}