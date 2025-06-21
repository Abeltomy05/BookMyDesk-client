import React from 'react';
import { MapPin } from 'lucide-react';

interface MapSkeletonProps {
    className?: string;
}

const MapSkeleton: React.FC<MapSkeletonProps> = ({ 
    className = "w-full h-72 md:h-96 rounded-lg" 
}) => {
    return (
        <div className={`${className} bg-gray-100 relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
            
            <div className="absolute inset-0 opacity-20">
                <div 
                    className="w-full h-full"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>
            
            <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-300 rounded animate-pulse" />
                    <div className="w-20 h-4 bg-gray-300 rounded animate-pulse" />
                </div>
            </div>
            
            <div className="absolute bottom-3 right-3">
                <div className="bg-gray-300 px-3 py-2 rounded-lg flex items-center gap-2 animate-pulse">
                    <div className="w-4 h-4 bg-gray-400 rounded" />
                    <div className="w-16 h-4 bg-gray-400 rounded" />
                </div>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative mb-4">
                        <MapPin 
                            className="w-12 h-12 text-blue-400 mx-auto animate-bounce" 
                            fill="currentColor"
                        />
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="w-16 h-16 border-2 border-blue-300 rounded-full animate-ping opacity-75" />
                            <div className="absolute top-2 left-2 w-12 h-12 border-2 border-blue-400 rounded-full animate-ping opacity-50 animation-delay-200" />
                        </div>
                    </div>
                    
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md">
                        <p className="text-gray-600 text-sm font-medium">Loading map...</p>
                        <div className="flex justify-center mt-2">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce animation-delay-100" />
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce animation-delay-200" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
    );
};

export default MapSkeleton;