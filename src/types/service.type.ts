import type { AllBuildingsData } from "@/pages/admin/sub-pages/BuildingListing";
import type { BookingData } from "@/types/booking.type";

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface ApiResponseWithPagination extends ApiResponse{
  total?:number;
  page?:number;
  limit?:number;
  totalPages?:number;
}


export interface LoginData {
  email: string;
  password: string;
  role:string;
  fcmToken?:string;
}

export interface SignupData {
  username: string;
  email: string;
  phone: string;
  password: string;
  role: string;
}

export interface VendorFormData extends SignupData{
  companyName: string
  companyAddress: string
  idProof: string
}

export interface GetBookingResponse {
  success: boolean;
  data?: BookingData[];
  totalItems?: number;
  totalPages?: number;
  currentPage?: number;
  message?: string
}

export type BuildingStatus = "approved" | "archived";
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed" | "failed";
export type ClientStatus = "active" | "blocked";
export type VendorStatus = "pending" | "approved" | "rejected" | "blocked";
export type AmenityStatus = "active" | "non-active" 

export interface GetUsersParams {
  role?: "client" | "vendor";
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  excludeStatus?: string | string[];
}

export interface GetAllUsersResponse {
  success: boolean;
  users: ClientData[] | VendorData[];
  totalPages: number;
  currentPage: number;
  message?: string
}


interface ClientData {
  _id: string
  username: string
  email: string
  phone: string
  status: ClientStatus
  avatar?: string
  createdAt?: string;
  updatedAt?: string;
}

interface VendorData{
  _id: string;
  username: string;
  email: string;
  phone: string;
  status: VendorStatus
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
  companyName?: string;
  companyAddress?: string;
  banner?: string;
  description?: string;
  idProof?: string;
}

export interface Amenities{
  _id:string,
  name:string,
  status:AmenityStatus,
}

export interface GetAllAmenities{
  success:boolean;
  message:string;
  data: Amenities[];
  totalPages:number;
  currentPage:number;
  totalItems?:number;
}

export interface GetAllBuildingResponse{
  success: boolean;
  buildings: AllBuildingsData[];
  totalPages: number;
  currentPage: number;
  totalItems?: number;
  message?: string;
}