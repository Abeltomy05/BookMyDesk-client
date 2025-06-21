import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  className = "" 
}: PaginationProps) {

  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      
      if (currentPage <= 3) {
        for (let i = 2; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`
          flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200
          ${currentPage === 1 
            ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50' 
            : 'border-gray-300 text-gray-600 hover:border-[#f69938] hover:text-[#f69938] hover:bg-orange-50'
          }
        `}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((page, index) => {
        if (page === '...') {
          return (
            <span 
              key={`ellipsis-${index}`} 
              className="flex items-center justify-center w-10 h-10 text-gray-400"
            >
              ...
            </span>
          )
        }

        const pageNumber = page as number
        const isActive = pageNumber === currentPage

        return (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={`
              flex items-center justify-center w-10 h-10 rounded-lg border font-medium transition-all duration-200
              ${isActive
                ? 'bg-[#f69938] border-[#f69938] text-white shadow-md transform scale-105'
                : 'border-gray-300 text-gray-600 hover:border-[#f69938] hover:text-[#f69938] hover:bg-orange-50'
              }
            `}
          >
            {pageNumber}
          </button>
        )
      })}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`
          flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200
          ${currentPage === totalPages 
            ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50' 
            : 'border-gray-300 text-gray-600 hover:border-[#f69938] hover:text-[#f69938] hover:bg-orange-50'
          }
        `}
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Page Info */}
      <div className="ml-4 text-sm text-gray-500">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  )
}