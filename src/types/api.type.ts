export interface ApiResponse<T> {
  success: boolean
  users: T[] 
  currentPage?: number
  totalPages?: number
  message?: string
  totalItems?: number;
}


export interface FetchParams {
  page?: number
  limit?: number
  search?: string
  filter?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  role?: string
  [key: string]: any
}
