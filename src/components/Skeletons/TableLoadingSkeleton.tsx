import { motion } from "framer-motion"

interface TableLoadingSkeletonProps {
  rows?: number
  columns?: number
  showActions?: boolean
  variant?: "light" | "dark"
}

interface SkeletonColors {
  border: string
  hover: string
  skeletonBase: string
  skeletonHighlight: string
  actionButton: string
}

export const TableLoadingSkeleton = ({ 
  rows = 4, 
  columns = 4, 
  showActions = true,
  variant = "light"
}: TableLoadingSkeletonProps) => {
  const getRandomWidth = () => {
    const widths = ["w-16", "w-20", "w-24", "w-28", "w-32", "w-36", "w-40"]
    return widths[Math.floor(Math.random() * widths.length)]
  }

  const getColumnSpan = (_index: number, totalColumns: number) => {
    if (totalColumns <= 3) return "col-span-4"
    if (totalColumns === 4) return "col-span-3"
    return "col-span-2"
  }

  const getColors = () => {
    if (variant === "dark") {
      return {
        border: "border-gray-700",
        hover: "hover:bg-gray-700/30",
        skeletonBase: "from-gray-600 via-gray-500 to-gray-600",
        skeletonHighlight: "from-transparent via-gray-400/40 to-transparent",
        actionButton: "from-gray-600 via-gray-500 to-gray-600"
      }
    }
    return {
      border: "border-gray-100",
      hover: "hover:bg-gray-50/50",
      skeletonBase: "from-gray-200 via-gray-300 to-gray-200",
      skeletonHighlight: "from-transparent via-white/60 to-transparent",
      actionButton: "from-gray-200 via-gray-300 to-gray-200"
    }
  }

  const colors = getColors()

  return (
    <div className="space-y-0">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <motion.div
          key={rowIndex}
          className={`grid grid-cols-12 p-4 ${colors.border} border-b items-center ${colors.hover}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: rowIndex * 0.05,
            duration: 0.3,
            ease: "easeOut"
          }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className={getColumnSpan(colIndex, columns)}>
              <SkeletonLine 
                width={getRandomWidth()} 
                height={colIndex === 0 ? "h-5" : "h-4"}
                delay={rowIndex * 0.1 + colIndex * 0.02}
                variant={variant}
                colors={colors}
              />
            </div>
          ))}
          {showActions && (
            <div className="col-span-1 flex justify-end">
              <motion.div 
                className={`w-8 h-8 bg-gradient-to-r ${colors.actionButton} rounded-full`}
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 1.5,
                  ease: "linear",
                  repeat: Infinity,
                  delay: rowIndex * 0.1
                }}
                style={{
                  backgroundSize: "200% 100%"
                }}
              />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}

const SkeletonLine = ({ 
  width = "w-24", 
  height = "h-4",
  delay = 0,
  colors
}: { 
  width?: string
  height?: string
  delay?: number
  variant?: "light" | "dark"
  colors: SkeletonColors
}) => {
  return (
    <motion.div 
      className={`${height} ${width} bg-gradient-to-r ${colors.skeletonBase} rounded-md relative overflow-hidden`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      <motion.div
        className={`absolute inset-0 bg-gradient-to-r ${colors.skeletonHighlight}`}
        animate={{
          x: ["-100%", "100%"]
        }}
        transition={{
          duration: 1.5,
          ease: "linear",
          repeat: Infinity,
          delay: delay + 0.5
        }}
      />
    </motion.div>
  )
}