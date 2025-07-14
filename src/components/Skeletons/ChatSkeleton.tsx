import { Skeleton } from "@/components/ui/skeleton"

export default function ChatSkeleton() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Skeleton */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar Header Skeleton */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="w-6 h-6 rounded" />
            <Skeleton className="h-6 w-32" />
          </div>
          {/* Search Skeleton */}
          <Skeleton className="w-full h-10 rounded-lg" />
        </div>

        {/* Chat List Skeleton */}
        <div className="flex-1 overflow-y-auto p-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3 p-3 rounded-lg mb-2">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area Skeleton */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header Skeleton */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="w-8 h-8 rounded-lg" />
          </div>
        </div>

        {/* Messages Area Skeleton */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
          <div className="space-y-4">
            {/* Received message */}
            <div className="flex justify-start">
              <div className="space-y-2">
                <Skeleton className="h-12 w-48 rounded-lg" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>

            {/* Sent message */}
            <div className="flex justify-end">
              <div className="space-y-2">
                <Skeleton className="h-12 w-40 rounded-lg" />
                <Skeleton className="h-3 w-12 ml-auto" />
              </div>
            </div>

            {/* Received message */}
            <div className="flex justify-start">
              <div className="space-y-2">
                <Skeleton className="h-16 w-56 rounded-lg" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>

            {/* Sent message */}
            <div className="flex justify-end">
              <div className="space-y-2">
                <Skeleton className="h-8 w-32 rounded-lg" />
                <Skeleton className="h-3 w-12 ml-auto" />
              </div>
            </div>

            {/* Received message */}
            <div className="flex justify-start">
              <div className="space-y-2">
                <Skeleton className="h-10 w-44 rounded-lg" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
        </div>

        {/* Input Area Skeleton */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="flex-1 h-10 rounded-lg" />
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="w-8 h-8 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
