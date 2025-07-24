import type { LocationData } from "./location.type";


export interface Building {
  _id: string
  buildingName: string
  summarizedSpaces: {
    name:string;
    count:number;
  }[];
  status: "approved" | "pending" | "archived"
   location: {
    type?: string
    name?: string
    displayName?: string
    zipCode?: string
    coordinates?: number[]
  }
  createdAt: string
  updatedAt?: string
}

export interface GetBuildingsParams {
  page?: number
  limit?: number
  search?: string
  status?: "approved" | "pending" | "archived" | "all"
}

export interface GetAllBuildingsResponse {
  success: boolean
  buildings: Building[]
  totalPages: number
  currentPage: number
  totalItems?: number
  message?: string
}

export interface BuildingRegistrationData {
  name: string;
  location: LocationData | null
  openingHours: {
    weekdays: {
      is24Hour: boolean;
      openTime: string;
      closeTime: string;
    };
    weekends: {
      is24Hour: boolean;
      openTime: string;
      closeTime: string;
    };
  };
  photos: string[];
  facilities: string[];
  phone: string;
  email: string;
  spaceTypes: Array<{
    name: string
    totalSeats: number
    pricePerDay: number
    amenities: string[]
  }>;
}

export type BuildingStatus = "pending" | "approved" | "archived" | "rejected"

