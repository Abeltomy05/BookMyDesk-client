export interface BaseItem {
  _id: string
  [key: string]: any
}

export interface TableColumn<T> {
  key: string
  label: string
  width: string 
  render: (item: T) => React.ReactNode
  responsive?: "hidden" | "block" 
  sortable?: boolean
}

export interface TableAction<T> {
  label: string | ((item: T) => string)
  icon?: React.ReactNode | ((item: T) => React.ReactNode)
  onClick: (item: T) => void | Promise<void>
  condition?: (item: T) => boolean
  variant?: "default" | "danger" | "warning" | "success"
  separator?: boolean 
}

export interface TableFilter {
  key: string
  label: string
  value: string | number
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalItems?: number
  itemsPerPage: number
}

export interface TableConfiguration<T> {
  title: string
  columns: TableColumn<T>[]
  actions?: TableAction<T>[]
  filters?: TableFilter[]
  searchPlaceholder?: string
  itemsPerPage?: number
  enableSearch?: boolean
  enablePagination?: boolean
  enableActions?: boolean
  emptyMessage?: string
  loadingMessage?: string
}