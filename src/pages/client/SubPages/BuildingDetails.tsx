import { Phone, Wifi, Car, Coffee, Users, ShieldCheck, Printer, MapPin, Clock } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import ClientLayout from "../ClientLayout";
import { clientService } from "@/services/clientServices";
import toast from "react-hot-toast";
import type { BuildingData  } from "@/types/building-form.type";
import MapSkeleton from "@/components/Skeletons/MapSkeleton";
import BuildingDetailsPageSkeleton from "@/components/Skeletons/BuildingDetailsPageSkeleton";
import OfferBadge from "@/components/OfferComponents/OfferBadge";
import { getErrorMessage } from "@/utils/errors/errorHandler";
const Map = lazy(()=> import("@/components/ReusableComponents/MapView"))
const ImageModal = lazy(()=> import("@/components/ReusableComponents/ImageModal"))

export default function BuildingDetailsPage() {
    const { buildingId } = useParams<{ buildingId: string }>();
    const [buildingData, setBuildingData] = useState<BuildingData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const navigate = useNavigate()

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });

        const fetchBuildingData = async () => {
            try {
                if (!buildingId) {
                    toast.error('Building ID not found');
                    setLoading(false);
                    return;
                }
                
                setLoading(true);
                const response = await clientService.getBuildingDetails(buildingId);
                console.log(response.data)
                if (!response.success) {
                    toast.error(response.message || 'Failed to fetch building data');
                    setLoading(false);
                    return;
                }
                
                setBuildingData(response.data);
            } catch (err: unknown) {
                console.log(err);
                toast.error(getErrorMessage(err));
            } finally {
                setLoading(false);
            }
        };

        fetchBuildingData();
    }, [buildingId]);

    const amenityIcons: Record<string, { icon: any; label: string }> = {
        NormalParking: { icon: Car, label: "Parking Available" },
        cafeteria: { icon: Coffee, label: "Cafeteria" },
        wifi: { icon: Wifi, label: "WiFi" },
        printer: { icon: Printer, label: "Printer Access" },
        lockers: { icon: ShieldCheck, label: "Personal Lockers" },
        security: { icon: ShieldCheck, label: "24/7 Security" },
        wheelchair: { icon: Users, label: "Wheelchair Accessible" }
    };

    const handleImageClick = (index: number) => {
        setSelectedImageIndex(index);
        setIsImageModalOpen(true);
    };

    const handleSeeMoreClick = () => {
        setSelectedImageIndex(0);
        setIsImageModalOpen(true);
    };

    if (loading) {
        return (
           <BuildingDetailsPageSkeleton/>
        );
    }

    if (!buildingData) {
        return (
            <ClientLayout>
                <div className="min-h-screen bg-white flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-gray-600 mb-4">Building not found</p>
                        <button 
                            onClick={() => window.history.back()} 
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </ClientLayout>
        );
    }

    const mainImage = buildingData.images && buildingData.images.length > 0 
        ? buildingData.images[0] 
        : "https://res.cloudinary.com/dnivctodr/image/upload/v1750089129/srptqnckz38fpjjxekdz.jpg";

    const displayImages = buildingData.images && buildingData.images.length > 0 
        ? buildingData.images.slice(0, 3)
        : [mainImage];

    return (
        <ClientLayout>
            <div className="min-h-screen bg-white">
                {/* Hero Section - Reduced height */}
                <div className="relative h-[300px] w-full">
                    <img
                        src={mainImage}
                        alt={buildingData.buildingName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://res.cloudinary.com/dnivctodr/image/upload/v1750089129/srptqnckz38fpjjxekdz.jpg";
                        }}
                    />
                    <div className="absolute inset-0 bg-black/50" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white px-4">
                            <h1 className="text-3xl md:text-6xl font-bold mb-4">
                                {buildingData.buildingName.toUpperCase()} - {buildingData.location.name.toUpperCase()}
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-8 py-8">
                    {/* Office Description Section */}
                    <div className="grid md:grid-cols-2 gap-14 mb-12">
                        <div>
                            <h2 className="text-4xl font-bold mb-4">{buildingData.buildingName}</h2>
                            <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                                {buildingData.description}
                            </p>
                            <div className="space-y-2">
                                <div className="flex-col items-center text-sm">
                                   <div className="text-sm space-y-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Phone size={15} />
                                        <h3 className="font-semibold text-base">Contact Us</h3>
                                    </div>
                                    <i className="ml-6">{buildingData.phone}</i>
                                   <p><i className="ml-6 text-blue-600">{buildingData.email}</i></p> 
                                    </div>
                                    <div className="flex items-center gap-2 text-sm mt-2">
                                        <MapPin size={15}/>
                                        <span><i>{buildingData.location.displayName}</i></span>
                                    </div>
                                    {buildingData.openingHours && (
                                        <div className="flex flex-col gap-2 text-sm mt-2">
                                            <div className="flex items-center gap-2">
                                            <Clock size={15} />
                                            <span>
                                                <i>Weekdays:</i>{' '}
                                                {buildingData.openingHours.weekdays?.is24Hour
                                                ? '24 Hour Access'
                                                : `${buildingData.openingHours.weekdays?.openTime} - ${buildingData.openingHours.weekdays?.closeTime}`}
                                            </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                            <Clock size={15} />
                                            <span>
                                                <i>Weekends:</i>{' '}
                                                {buildingData.openingHours.weekends?.is24Hour
                                                ? '24 Hour Access'
                                                : `${buildingData.openingHours.weekends?.openTime} - ${buildingData.openingHours.weekends?.closeTime}`}
                                            </span>
                                            </div>
                                        </div>
                                        )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="relative mt-5">
                            <Suspense fallback={<MapSkeleton className="w-full h-72 md:h-96 rounded-lg shadow-lg" />}>
                            <Map 
                                location={buildingData.location}
                                buildingName={buildingData.buildingName}
                                className="w-full h-72 md:h-96 rounded-lg shadow-lg"
                            />
                            </Suspense>
                        </div>
                    </div>

                    {/* Booking Options Section */}
                   <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-6">Available Spaces</h2>
                        {buildingData.spaces && buildingData.spaces.length > 0 ? (
                            <>
                            <div className="grid md:grid-cols-3 gap-6 mb-4">
                                {buildingData.spaces.slice(0, 3).map((space, i) => {
                                    const isUnavailable = !space.isAvailable;
                                    const hasNoCapacity = space.capacity === 0;
                                    const isNotClickable = isUnavailable || hasNoCapacity;
                                    
                                    return (
                                    <div
                                        key={space._id}
                                        className={`relative overflow-visible group rounded-lg shadow-md ${
                                            isNotClickable 
                                                ? 'cursor-not-allowed opacity-75' 
                                                : 'cursor-pointer'
                                        }`}
                                        onClick={isNotClickable ? undefined : () => navigate(`/book-space/${space._id}`)}
                                    >
                                        <div className="relative overflow-hidden rounded-t-lg">
                                        <img
                                            src={
                                            buildingData.images && buildingData.images[i % buildingData.images.length]
                                                ? buildingData.images[i % buildingData.images.length]
                                                : mainImage
                                            }
                                            alt={space.name}
                                            className={`w-full h-48 object-cover transition-transform duration-300 ${
                                                isNotClickable ? '' : 'group-hover:scale-115'
                                            }`}
                                            onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = mainImage;
                                            }}
                                        />
                                        <div className={`absolute inset-0 bg-gradient-to-t from-black/90 from-20% via-black/40 via-40% to-transparent transition-all duration-300 ${
                                            isNotClickable ? '' : 'group-hover:from-black/95'
                                        }`} />
                                        
                                        {/* Unavailability Overlay */}
                                        {isNotClickable && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                <div className="bg-red-600 text-white px-4 py-2 rounded-lg text-center">
                                                    <p className="font-semibold text-sm">
                                                        {isUnavailable ? 'Space Not Available Currently' : 'Zero Space Available'}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div className="absolute bottom-4 left-4">
                                            <span className="text-white text-2xl font-semibold tracking-wide block">
                                            {space.name.toUpperCase()}
                                            </span>
                                            <span className="text-white text-sm block">
                                            ₹{space.pricePerDay}/day • {space.capacity} available
                                            </span>
                                        </div>
                                        </div>

                                         {/* Offer Badge */}
                                        {space.offer && (
                                            <div className="absolute top-3 right-3 z-10">
                                                <OfferBadge 
                                                    offer={{
                                                        percentage: space.offer.discountPercentage,
                                                        title: space.offer.title,
                                                        description: space.offer.description || '',
                                                        startDate: space.offer.startDate,
                                                        endDate: space.offer.endDate
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    );
                                })}
                            </div>

                            {buildingData.spaces.length > 3 && (
                                <div className="text-right">
                                <button className="text-blue-600 hover:text-blue-800 underline">See More →</button>
                                </div>
                            )}
                            </>
                        ) : (
                            <div className="text-center py-8">
                            <p className="text-gray-500">No spaces available at the moment.</p>
                            </div>
                        )}
                    </div>

                    {/* Photos and Amenities Section */}
                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="md:col-span-2">
                        <h3 className="text-3xl font-bold mb-5 text-gray-800">PHOTOS</h3>

                        {/* Main Photo */}
                        <div className="relative h-60 md:h-80  overflow-hidden mb-4 rounded-lg">
                            <img
                                src={mainImage}
                                alt="Main"
                                className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => handleImageClick(0)}
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "https://res.cloudinary.com/dnivctodr/image/upload/v1750089129/srptqnckz38fpjjxekdz.jpg";
                                }}
                            />
                        </div>

                        {/* Thumbnails and See More */}
                        <div className="flex gap-3 items-center">
                            {displayImages.slice(1).map((image, index) => (
                                <div key={index} className="relative h-30 w-36 overflow-hidden rounded-lg flex-shrink-0">
                                    <img
                                        src={image}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                        onClick={() => handleImageClick(index + 1)}
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = mainImage;
                                        }}
                                    />
                                </div>
                            ))}
                            
                            {/* See More Button */}
                            <div className="flex items-center justify-center h-16 ml-auto">
                                <button 
                                    onClick={handleSeeMoreClick}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium whitespace-nowrap"
                                >
                                    SEE MORE →
                                </button>
                            </div>
                        </div>
                    </div>

    {/* AMENITIES SECTION  */}
    <div className="md:col-span-1">
        <h3 className="text-3xl font-bold mb-5 text-gray-800">AMENITIES</h3>
        <div className="space-y-3">
            {buildingData.amenities && buildingData.amenities.length > 0 ? (
                buildingData.amenities.map((amenity, index) => {
                    const amenityInfo = amenityIcons[amenity] || { 
                        icon: ShieldCheck, 
                        label: amenity.charAt(0).toUpperCase() + amenity.slice(1).replace(/([A-Z])/g, ' $1')
                    };
                    const IconComponent = amenityInfo.icon;
                    
                    return (
                        <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                            <IconComponent className="w-5 h-5 text-blue-600 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{amenityInfo.label}</span>
                        </div>
                    );
                })
            ) : (
                // Default amenities if none specified
                <>
                   <p>No amenities available</p>
                </>
            )}
        </div>
    </div>
</div>
                </div>

                {/* Image Modal */}
                 <Suspense fallback={<div className="h-72 md:h-96 bg-gray-100 rounded-lg animate-pulse" />}>
                <ImageModal
                    isOpen={isImageModalOpen}
                    images={buildingData.images || [mainImage]}
                    onClose={() => setIsImageModalOpen(false)}
                    initialIndex={selectedImageIndex}
                    title={buildingData.buildingName}
                    backgroundColor="blur"
                    showThumbnails={true}
                />
                </Suspense>
            </div>
        </ClientLayout>
    );
}