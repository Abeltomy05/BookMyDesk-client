export interface SpaceType{
  type:string;
  count:string;
}

export interface Building {
  _id: string
  name: string
  availableSpaces: SpaceType[]
  status: "approved" | "pending" | "archived"
  address: string
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