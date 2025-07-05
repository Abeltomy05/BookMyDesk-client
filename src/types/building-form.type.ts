import type { LocationData } from "./location.type"

export interface BuildingData {
    amenities: string[];
    buildingName: string;
    createdAt: string;
    description: string;
    email: string;
    images: string[];
    location: LocationData;
    openingHours: OpeningHours;
    phone: string;
    spaces: SpaceData[];
    status: string;
    summarizedSpaces: SummarizedSpace[];
    vendorId: string;
    _id: string;
}

export interface OfferPreview {
  discountPercentage: number;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
}

export interface SpaceData {
  _id: string;
  name: string;
  capacity: number;
  pricePerDay: number;
  amenities: string[];
  isAvailable:boolean;

  offer?: OfferPreview;
}

export interface SummarizedSpace {
    count: number;
    name: string;
    price: number;
    _id: string;
}

export interface BasicInfo {
  name: string
  location: string
  openingHours: OpeningHours
  photos: File[]
}

export interface OpeningHours {
    weekdays: {
        closeTime: string;
        is24Hour: boolean;
        openTime: string;
    };
    weekends: {
        closeTime: string;
        is24Hour: boolean;
        openTime: string;
    };
}

export interface UpdatedBasicInfo extends Omit<BasicInfo, 'location'> {
  location: LocationData | null;
}

export interface Facilities {
  bicycleParking: boolean
  normalParking: boolean
  garden: boolean
  swimmingPool: boolean
  gym: boolean
  cafeteria: boolean
  wifi: boolean
  airConditioning: boolean
}

export interface ContactInfo {
  phone: string
  email: string
}

export interface SpaceType {
  _id: string
  name: string
  totalSeats: number
  pricePerDay: number
  amenities: string[]
  isExpanded: boolean
}

export interface PricingPlans {
  spaceTypes: SpaceType[]
}

export interface BuildingFormData {
  basicInfo: UpdatedBasicInfo
  facilities: Facilities
  contactInfo: ContactInfo
  pricingPlans: PricingPlans
}
