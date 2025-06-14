import type { LocationData } from "./location.type"

export interface BasicInfo {
  name: string
  location: string
  openingHours: {
    weekdays: {
      is24_7: boolean
      openTime: string
      closeTime: string
    }
    weekends: {
      is24_7: boolean
      openTime: string
      closeTime: string
    }
  }
  photos: File[]
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
