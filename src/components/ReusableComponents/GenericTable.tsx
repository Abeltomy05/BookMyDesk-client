import { useState, useEffect, useImperativeHandle, forwardRef } from "react"
import { motion } from "framer-motion"
import { Search, MoreVertical, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"
import { type BaseItem, type TableConfiguration, type PaginationInfo, type TableAction} from "@/types/table.type"
import type { ApiResponse, FetchParams } from "@/types/api.type"
import { TableLoadingSkeleton } from "@/components/Skeletons/TableLoadingSkeleton"
import type { TableRef } from "./LightGenericTable"

interface GenericTableProps<T extends BaseItem> extends TableConfiguration<T> {
  fetchData: (params: FetchParams) => Promise<ApiResponse<T>>
  onRefresh?: () => void
  className?: string
  onFilterChange?: (filterValue: string) => void
}

function GenericTableInner<T extends BaseItem>({
  title,
  columns,
  actions = [],
  filters = [],
  searchPlaceholder = "Search...",
  itemsPerPage = 4,
  enableSearch = true,
  enablePagination = true,
  enableActions = true,
  emptyMessage = "No data found",
  loadingMessage = "Loading...",
  fetchData,
  onRefresh,
  className = "",
  onFilterChange
}: GenericTableProps<T>,
ref: React.Ref<TableRef<T>>) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>(filters[0]?.value.toString() || "all")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage
  })

  useImperativeHandle(ref, () => ({
    updateItemOptimistically: (id: string, updates: Partial<T>) => {
      setData(prevData =>
        prevData.map(item =>
          item._id === id ? { ...item, ...updates } : item
        )
      )
    },
    refreshData: () => {
      loadData(pagination.currentPage, searchQuery)
    }
  }))

  const loadData = async (page: number = 1, search: string = "") => {
    setLoading(true)
    setError(null)
    
    try {
      const params: FetchParams = {
        page,
        limit: itemsPerPage,
        ...(enableSearch && search && { search })
      }
      
      const response = await fetchData(params)
      
      if (response.success) {
        let items = response.users || []
        console.log("Fetched Data",items)
        
        
        setData(items)
        setPagination({
          currentPage: response.currentPage || page,
          totalPages: response.totalPages || 0,
          totalItems: items.length, 
          itemsPerPage
        })
      } else {
        setError(response.message || "Failed to fetch data")
        setData([])
        setPagination(prev => ({ ...prev, totalPages: 0, totalItems: 0 }))
      }
    } catch (err) {
      setError("An error occurred while fetching data")
      setData([])
      setPagination(prev => ({ ...prev, totalPages: 0, totalItems: 0 }))
      console.error("Fetch error:", err)
    } finally {
         setLoading(false);
    }
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      loadData(1, searchQuery)
    }, 500)
    return () => clearTimeout(debounceTimer)
  }, [activeFilter, searchQuery])

  const handleFilterChange = (value: string) => {
  setActiveFilter(value)
  onFilterChange?.(value)
}

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      loadData(page, searchQuery)
    }
  }

  const handleActionClick = async (action: TableAction<T>, item: T) => {
    setActiveDropdown(null)
    try {
      await action.onClick(item)

     if (action.refreshAfter !== false) {
        if (onRefresh) {
          onRefresh()
        } else {
          loadData(pagination.currentPage, searchQuery)
        }
      }
    } catch (error) {
      console.error("Action failed:", error)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown) {
        setActiveDropdown(null)
      }
    }
    
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [activeDropdown])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  return (
    <motion.div
      className={`bg-black text-white p-6 rounded-xl max-w-7xl mx-auto ${className}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1 className="text-2xl font-bold mb-2 text-[#f69938]" variants={itemVariants}>
        {title}
      </motion.h1>

      {/* Search and Filters */}
      <motion.div className="flex flex-col md:flex-row justify-between mb-6 gap-4" variants={itemVariants}>
        {/* Search Bar */}
        {enableSearch && (
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f69938] focus:border-transparent text-white"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        )}

        {/* Filter Tabs */}
        {filters.length > 0 && (
          <div className="flex flex-wrap space-x-1 bg-gray-900 p-1 rounded-lg">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => handleFilterChange(filter.value.toString())}
                className={`px-3 py-2 rounded-md capitalize transition-all duration-200 text-sm ${
                  activeFilter === filter.value.toString()
                    ? "bg-[#f69938] text-black font-medium"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div 
          className="bg-red-900/30 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center gap-2"
          variants={itemVariants}
        >
          <AlertCircle size={18} />
          {error}
        </motion.div>
      )}

      {/* Table */}
      <motion.div
        className="bg-gray-900 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(246,153,56,0.15)] min-h-[400px]"
        variants={itemVariants}
      >
        {/* Table Header */}
        <div className="grid grid-cols-12 bg-gray-800 p-4 font-medium text-sm text-gray-300">
          {columns.map((column) => (
            <div 
              key={column.key} 
              className={`${column.width} ${column.responsive === "hidden" ? "hidden md:block" : ""}`}
            >
              {column.label}
            </div>
          ))}
          {enableActions && actions.length > 0 && (
            <div className="col-span-1 text-right">Actions</div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <TableLoadingSkeleton 
            rows={itemsPerPage} 
            columns={columns.length} 
            showActions={enableActions && actions.length > 0} 
            variant="dark"
          />
        )}

        {/* Data Rows */}
        {!loading && data.length > 0 ? (
          data.map((item) => (
            <motion.div
              key={item._id}
              className="grid grid-cols-12 p-4 border-b border-gray-800 items-center hover:bg-gray-800/50 transition-colors"
              variants={itemVariants}
              whileHover={{ scale: 1.002 }}
            >
              {columns.map((column) => (
                <div 
                  key={column.key} 
                  className={`${column.width} ${column.responsive === "hidden" ? "hidden md:block" : ""}`}
                >
                  {column.render(item)}
                </div>
              ))}

              {/* Actions */}
              {enableActions && actions.length > 0 && (
                <div className="col-span-1 text-right relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveDropdown(activeDropdown === item._id ? null : item._id)
                    }}
                    className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <MoreVertical size={18} className="text-gray-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {activeDropdown === item._id && (
                    <motion.div
                      className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-10"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      {actions
                        .filter(action => !action.condition || action.condition(item))
                        .map((action, index) => (
                          <div key={index}>
                            {action.separator && index > 0 && (
                              <div className="border-t border-gray-700 my-1"></div>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleActionClick(action, item)
                              }}
                              className={`w-full text-left px-4 py-2 hover:bg-gray-700 text-sm flex items-center gap-2 transition-colors ${
                                index === 0 ? 'rounded-t-lg' : ''
                              } ${
                                index === actions.length - 1 ? 'rounded-b-lg' : ''
                              } ${
                                action.variant === 'danger' ? 'text-red-400 hover:text-red-300' :
                                action.variant === 'warning' ? 'text-yellow-400 hover:text-yellow-300' :
                                action.variant === 'success' ? 'text-green-400 hover:text-green-300' :
                                'text-white'
                              }`}
                            >
                              {typeof action.icon === 'function' ? action.icon(item) : action.icon}
                              <span>
                                {typeof action.label === 'function' ? action.label(item) : action.label}
                              </span>
                            </button>
                          </div>
                        ))}
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          ))
        ) : !loading ? (
          <div className="p-8 text-center text-gray-400">
            {emptyMessage}
          </div>
        ) : null}
      </motion.div>

      {/* Pagination */}
      {enablePagination && !loading && pagination.totalPages > 1 && (
        <motion.div 
          className="flex items-center justify-between mt-6"
          variants={itemVariants}
        >
          <div className="text-sm text-gray-400">
            Page {pagination.currentPage} of {pagination.totalPages}
            {pagination.totalItems && (
              <span className="ml-2">({pagination.totalItems} total items)</span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pagination.currentPage === 1
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-gray-800 text-white hover:bg-gray-700"
              }`}
            >
              <ChevronLeft size={16} className="mr-1" />
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1
                } else if (pagination.currentPage <= 3) {
                  pageNum = i + 1
                } else if (pagination.currentPage >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i
                } else {
                  pageNum = pagination.currentPage - 2 + i
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pagination.currentPage === pageNum
                        ? "bg-[#f69938] text-black"
                        : "bg-gray-800 text-white hover:bg-gray-700"
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pagination.currentPage === pagination.totalPages
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-gray-800 text-white hover:bg-gray-700"
              }`}
            >
              Next
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export const GenericTable = forwardRef(GenericTableInner) as <T extends BaseItem>(
  props: GenericTableProps<T> & { ref?: React.Ref<TableRef<T>> }
) => React.ReactElement;