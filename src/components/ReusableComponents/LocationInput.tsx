import type { LocationData, LocationSuggestion } from "@/types/location.type";
import { AlertCircle, MapPin, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function LocationInput({ 
  value, 
  onChange, 
  onBlur, 
  error, 
  placeholder = "Search for a location...",
  className = ""
}: {
  value: LocationData | null;
  onChange: (location: LocationData | null) => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
  className?: string;
}) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Update query when value changes externally
  useEffect(() => {
    if (value?.displayName) {
      setQuery(value.displayName);
    } else {
      setQuery('');
    }
  }, [value?.displayName]);


  const searchLocations = async (searchQuery: string) => {
    if (searchQuery.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&addressdetails=1&countrycodes=IN&accept-language=en`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }

      const data: LocationSuggestion[] = await response.json();
      setSuggestions(data);
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Error searching locations:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer
    debounceTimer.current = setTimeout(() => {
      searchLocations(newQuery);
    }, 300);
  };

  const handleSuggestionSelect = (suggestion: LocationSuggestion) => {
    const locationData: LocationData = {
      name: extractLocationName(suggestion),
      displayName: suggestion.display_name,
      zipCode: suggestion.address?.postcode || '',
      coordinates: [parseFloat(suggestion.lon), parseFloat(suggestion.lat)]
    };

    onChange(locationData);
    setQuery(suggestion.display_name);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const extractLocationName = (suggestion: LocationSuggestion): string => {
    const address = suggestion.address;
    if (!address) return suggestion.display_name.split(',')[0];
    
    return address.city || address.town || address.village || suggestion.display_name.split(',')[0];
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  useEffect(() => {
    if (selectedIndex >= 0 && suggestionRefs.current[selectedIndex]) {
      suggestionRefs.current[selectedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [selectedIndex]);

  const handleClear = () => {
    setQuery('');
    onChange(null);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative  w-full ${className}`}>
      <div className="relative w-full">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={onBlur}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          className={`w-full px-4 py-3 pl-10 pr-10 border rounded-md shadow-sm bg-white focus:ring-2 focus:outline-none transition-all text-sm ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-[#f69938]"
          }`}
          placeholder={placeholder}
          autoComplete="off"
        />
        
        {/* Search icon */}
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#f69938] border-t-transparent"></div>
          </div>
        )}
        
        {/* Clear button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-1 flex items-center text-sm text-red-600">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </div>
      )}

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.place_id}
              ref={el =>{
                suggestionRefs.current[index] = el
              }}
              onClick={() => handleSuggestionSelect(suggestion)}
              className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors ${
                index === selectedIndex
                  ? 'bg-orange-50 border-orange-200'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {extractLocationName(suggestion)}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {suggestion.display_name}
                  </p>
                  {suggestion.address?.postcode && (
                    <p className="text-xs text-gray-400">
                      PIN: {suggestion.address.postcode}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Selected location info */}
      {value && (
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
          <div className="flex items-center justify-between">
            <span>📍 {value.name}</span>
            <span className="text-green-600">
              {value.coordinates[1].toFixed(4)}, {value.coordinates[0].toFixed(4)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}