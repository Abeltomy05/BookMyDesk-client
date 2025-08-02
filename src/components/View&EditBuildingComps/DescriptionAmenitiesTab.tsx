import type React from "react"
import { useState, useRef, useEffect } from "react"
import { X, ImageIcon, FileText, Star, Upload, ChevronUp, ChevronDown } from "lucide-react"
import type { Building } from "@/types/view&editBuilding"
import { vendorService } from "@/services/vendorServices"

interface DescriptionAmenitiesStepProps {
  building: Building
  setBuilding: React.Dispatch<React.SetStateAction<Building | null>>
}

interface Amenity {
  _id: string
  name: string
}

export function DescriptionAmenitiesStep({ building, setBuilding}: DescriptionAmenitiesStepProps) {
  const [uploadingImages, setUploadingImages] = useState<boolean[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([]) 
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [availableAmenities, setAvailableAmenities] = useState<Amenity[]>([])
  const [displayedAmenities, setDisplayedAmenities] = useState<Amenity[]>([])
  const [showMore, setShowMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMoreAmenities, setHasMoreAmenities] = useState(true)

const updateBuilding = (field: keyof Building, value: string) => {
  setBuilding((prev) => {
    if (!prev) return prev;
    return { ...prev, [field]: value };
  });
};

const fetchAmenities = async (page: number = 1, append: boolean = false) => {
  setLoading(true)
  try {
    const response = await vendorService.getAllAmenities(page, 8, '', true)
    if (response.success && response.data) {
      const newAmenities = response.data
      
      if (append) {
        setAvailableAmenities(prev => [...prev, ...newAmenities])
        setDisplayedAmenities(prev => [...prev, ...newAmenities])
      } else {
        setAvailableAmenities(newAmenities)
        setDisplayedAmenities(newAmenities)
      }
      
      setHasMoreAmenities(newAmenities.length === 8)
    }
  } catch (error) {
    console.error('Error fetching amenities:', error)
  } finally {
    setLoading(false)
  }
}

useEffect(() => {
  fetchAmenities(1, false)
}, [])

const handleShowMore = () => {
  if (!showMore) {
    setShowMore(true)
    if (hasMoreAmenities && availableAmenities.length <= 8) {
      const nextPage = currentPage + 1
      setCurrentPage(nextPage)
      fetchAmenities(nextPage, true)
    }
  } else {
    setShowMore(false)
    setDisplayedAmenities(availableAmenities.slice(0, 8))
  }
}

const isAmenitySelected = (amenityName: string) => {
  return building.amenities.includes(amenityName)
}

const toggleAmenity = (amenity: Amenity) => {
  setBuilding((prev) => {
    if (!prev) return prev;
    
    const isSelected = prev.amenities.includes(amenity.name)
    
    if (isSelected) {
      return {
        ...prev,
        amenities: prev.amenities.filter(name => name !== amenity.name),
      };
    } else {
      return {
        ...prev,
        amenities: [...prev.amenities, amenity.name],
      };
    }
  });
};


const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const files = event.target.files;
  if (!files) return;

  const newFiles = Array.from(files).filter(file => file.type.startsWith('image/'));

  newFiles.forEach((file) => {
    setUploadingImages((prev) => [...prev, true]);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;

      setBuilding((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          images: [...prev.images, result],
        };
      });

      setImageFiles((prev) => [...prev, file]);
      setUploadingImages((prev) => prev.slice(0, -1));
    };
    reader.readAsDataURL(file);
  });

  if (fileInputRef.current) {
    fileInputRef.current.value = '';
  }
};

  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

const removeImage = (index: number) => {
  setBuilding((prev) => {
    if (!prev) return prev;
    return {
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    };
  });
};

useEffect(() => {
  setBuilding((prev) => {
    if (!prev) return prev;
    return { ...prev, imageFiles };
  });
}, [imageFiles, setBuilding]);

 return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Description & Amenities</h2>
        <p className="text-gray-600">Add detailed description, amenities, and images for your building</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Description and Amenities */}
        <div className="space-y-8">
          {/* Description */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#f69938]" />
              Building Description
            </h3>
            <textarea
              value={building.description}
              onChange={(e) => updateBuilding("description", e.target.value)}
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f69938] focus:border-transparent resize-none transition-all duration-200"
              placeholder="Describe your building, its location, unique features, and what makes it special for potential renters..."
            />
            <div className="mt-2 text-sm text-gray-500">{building.description?.length}/500 characters</div>
          </div>

          {/* Building Amenities */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-[#f69938]" />
              Building Amenities
            </h3>
            
            {/* Available Amenities Grid */}
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-700 mb-3">Select from available amenities:</h4>
              
              {loading && displayedAmenities.length === 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[...Array(8)].map((_, index) => (
                    <div key={index} className="h-16 bg-gray-200 rounded-xl animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {(showMore ? availableAmenities : displayedAmenities.slice(0, 8)).map((amenity) => (
                      <button
                        key={amenity._id}
                        onClick={() => toggleAmenity(amenity)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                          isAmenitySelected(amenity.name)
                            ? 'border-[#f69938] bg-[#f69938] text-white shadow-lg'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-[#f69938] hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                            <Star className={`w-5 h-5 ${isAmenitySelected(amenity.name) ? 'text-white' : 'text-gray-400'}`} />
                          <span className="text-sm font-medium">{amenity.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  {/* Show More/Less Button */}
                  {(availableAmenities.length > 8 || hasMoreAmenities) && (
                    <div className="mt-4 text-center">
                      <button
                        onClick={handleShowMore}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-4 py-2 text-[#f69938] hover:text-[#e5862f] font-medium transition-colors disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-[#f69938] border-t-transparent rounded-full animate-spin"></div>
                            Loading...
                          </>
                        ) : showMore ? (
                          <>
                            <ChevronUp className="w-4 h-4" />
                            Show Less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            Show More
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Images */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#f69938]" />
            Building Images
          </h3>
          
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />

          <div className="grid grid-cols-2 gap-4 mb-6">
            {building.images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={
                    image.startsWith("data:")
                      ? image
                      : `${import.meta.env.VITE_CLOUDINARY_SAVE_URL}${image}`
                  }
                  alt={`Building ${index + 1}`}
                  className="w-full h-32 object-cover rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-200"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                  Image {index + 1}
                </div>
              </div>
            ))}
            
            {/* Show uploading placeholders */}
            {uploadingImages.map((_, index) => (
              <div key={`uploading-${index}`} className="relative">
                <div className="w-full h-32 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <Upload className="w-6 h-6 animate-pulse" />
                    <span className="text-xs">Uploading...</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={triggerFileUpload}
            className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-gray-600 hover:border-[#f69938] hover:text-[#f69938] hover:bg-gray-50 transition-all duration-200 flex flex-col items-center justify-center gap-3 font-medium"
          >
            <div className="bg-gray-100 rounded-full p-4">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <div className="font-semibold">Upload Images</div>
              <div className="text-sm text-gray-500">Select photos from your device</div>
              <div className="text-xs text-gray-400 mt-1">Supports JPG, PNG, GIF</div>
            </div>
          </button>

          {building.images.length === 0 && uploadingImages.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No images added yet</p>
              <p className="text-xs">Upload some photos to showcase your building</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}