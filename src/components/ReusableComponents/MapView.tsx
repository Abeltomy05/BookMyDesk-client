import React, { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import type { LocationData } from '@/types/location.type';


interface BuildingMapProps {
    location: LocationData;
    buildingName: string;
    className?: string;
}

declare global {
    interface Window {
        L: any;
    }
}

const BuildingMap: React.FC<BuildingMapProps> = ({ 
    location, 
    buildingName, 
    className = "w-full h-64 md:h-80 rounded-lg" 
}) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markerRef = useRef<any>(null);

    useEffect(() => {
        const loadLeaflet = async () => {
            if (window.L) {
                initializeMap();
                return;
            }

            const cssLink = document.createElement('link');
            cssLink.rel = 'stylesheet';
            cssLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
            document.head.appendChild(cssLink);

            // Load Leaflet JS
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
            script.onload = () => {
                initializeMap();
            };
            document.head.appendChild(script);
        };

        const initializeMap = () => {
            if (!mapRef.current || !location.coordinates || !window.L) return;

            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
            }

            const [lng, lat] = location.coordinates;

            // Initialize map
            const map = window.L.map(mapRef.current).setView([lat, lng], 15);

            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19
            }).addTo(map);

            // Custom marker icon
            const customIcon = window.L.divIcon({
                html: `
                    <div style="
                        background-color: #2563eb;
                        width: 32px;
                        height: 32px;
                        border-radius: 50% 50% 50% 0;
                        transform: rotate(-45deg);
                        border: 3px solid white;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">
                        <div style="
                            color: white;
                            transform: rotate(45deg);
                            font-size: 14px;
                            font-weight: bold;
                        ">📍</div>
                    </div>
                `,
                className: 'custom-div-icon',
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32]
            });

            // Add marker
            const marker = window.L.marker([lat, lng], { icon: customIcon }).addTo(map);

            // Add popup
            marker.bindPopup(`
                <div style="font-family: system-ui, -apple-system, sans-serif;">
                    <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1f2937;">
                        ${buildingName}
                    </h3>
                    <p style="margin: 0; font-size: 14px; color: #6b7280; line-height: 1.4;">
                        ${location.displayName}
                    </p>
                    <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb;">
                        <a 
                            href="https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=15" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style="color: #2563eb; text-decoration: none; font-size: 12px; display: inline-flex; align-items: center; gap: 4px;"
                        >
                            View on OpenStreetMap →
                        </a>
                    </div>
                </div>
            `);

            mapInstanceRef.current = map;
            markerRef.current = marker;

            setTimeout(() => {
                marker.openPopup();
            }, 500);
        };

        loadLeaflet();

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [location, buildingName]);

    if (!location.coordinates || location.coordinates.length !== 2) {
        return (
            <div className={`${className} bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300`}>
                <div className="text-center text-gray-500">
                    <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Location not available</p>
                    <p className="text-xs mt-1">{location.displayName}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            <div 
                ref={mapRef} 
                className={className}
                style={{ 
                    minHeight: '200px',
                    backgroundColor: '#f3f4f6' 
                }}
            />
            
            {/* Map overlay info */}
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md ">
                <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">
                        {location.name}
                    </span>
                </div>
            </div>
            
            {/* Get directions button */}
            <div className="absolute bottom-3 right-3 ">
                <button
                    onClick={() => {
                        const [lng, lat] = location.coordinates;
                        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
                        window.open(googleMapsUrl, '_blank');
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-md transition-colors duration-200 flex items-center gap-2"
                >
                    <MapPin className="w-4 h-4" />
                    Directions
                </button>
            </div>
        </div>
    );
};

export default BuildingMap;