"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Plus, X, ImageIcon, FileText, Star, Upload } from "lucide-react"
import type { Building } from "@/types/view&editBuilding"

interface DescriptionAmenitiesStepProps {
  building: Building
  setBuilding: React.Dispatch<React.SetStateAction<Building | null>>
}

export function DescriptionAmenitiesStep({ building, setBuilding}: DescriptionAmenitiesStepProps) {
  const [newAmenity, setNewAmenity] = useState("")
  const [uploadingImages, setUploadingImages] = useState<boolean[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([]) 
  const fileInputRef = useRef<HTMLInputElement>(null)

const updateBuilding = (field: keyof Building, value: any) => {
  setBuilding((prev) => {
    if (!prev) return prev;
    return { ...prev, [field]: value };
  });
};

const addAmenity = () => {
  if (newAmenity.trim()) {
    setBuilding((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()],
      };
    });
    setNewAmenity("");
  }
};

const removeAmenity = (index: number) => {
  setBuilding((prev) => {
    if (!prev) return prev;
    return {
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
    };
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
            <div className="flex flex-wrap gap-3 mb-4">
              {building.amenities.map((amenity, index) => (
                <span
                  key={index}
                  className="bg-gradient-to-r from-[#f69938] to-[#e5862f] text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  {amenity}
                  <button
                    onClick={() => removeAmenity(index)}
                    className="hover:bg-white/20 rounded-full p-1 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="Add new amenity (e.g., Parking, WiFi, Security)"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f69938] transition-all duration-200"
                onKeyPress={(e) => e.key === "Enter" && addAmenity()}
              />
              <button
                onClick={addAmenity}
                className="bg-[#f69938] text-white px-6 py-3 rounded-xl hover:bg-[#e5862f] transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                <Plus className="w-4 h-4" />
              </button>
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
                  src={image}
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