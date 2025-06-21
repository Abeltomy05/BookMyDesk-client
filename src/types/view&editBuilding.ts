import type { LocationData } from "@/types/location.type"

export interface OpeningHours {
  is24Hour: boolean
  openTime: string
  closeTime: string
}

export interface Space {
  _id: string
  name: string
  capacity: number
  pricePerDay: number
  amenities: string[]
  isAvailable: boolean
  buildingId?:string
}

export interface LocalSpace extends Space {
  localId?: string; 
}

export interface Building {
  _id: string
  buildingName: string
  status: "approved" | "pending" | "archived" | "rejected"
  location: LocationData | null
  createdAt: string
  email: string
  phone: string
  openingHours: {
    weekdays: OpeningHours
    weekends: OpeningHours
  }
  spaces: Space[]
  description: string
  amenities: string[]
  images: string[]
  imageFiles?: File[]
}