import { useState, useEffect } from "react"
import { Check, CheckCheck, Loader2 } from "lucide-react"
import type { Notification, NotificationResponse } from "@/types/notification.type";
import toast from "react-hot-toast";

  
interface NotificationsComponentProps {
   fetchNotifications: (page: number, filter: "unread" | "all") => Promise<NotificationResponse>;
   markAsRead: (id: string) => Promise<{ success: boolean }>; 
   clearNotifications: () => Promise<{ success: boolean }>; 
}

export default function NotificationsComponent({ fetchNotifications,markAsRead,clearNotifications  }: NotificationsComponentProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [activeTab, setActiveTab] = useState<"unread" | "all">("unread")
  const [currentPage, setCurrentPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [initialLoading, setInitialLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0); 

  useEffect(() => {
  loadInitialNotifications()
}, [activeTab])

const loadInitialNotifications = async () => {
  setInitialLoading(true)
  setCurrentPage(0)
  setHasMore(true)

  try {
    const { items, hasMore, unreadCount, totalCount } = await fetchNotifications(0, activeTab);
    setNotifications(items)
    setUnreadCount(unreadCount);
    setTotalCount(totalCount);
    setHasMore(hasMore);
  } catch (error) {
    console.error("Failed to load notifications:", error)
  } finally {
    setInitialLoading(false)
  }
}

const loadMoreNotifications = async () => {
  if (loading || !hasMore) return

  setLoading(true)
  const nextPage = currentPage + 1

  try {
   const { items, hasMore } = await fetchNotifications(nextPage, activeTab);

    setNotifications((prev) => [...prev, ...items]);
    setCurrentPage(nextPage);
    setHasMore(hasMore);
  } catch (error) {
    console.error("Failed to load more notifications:", error)
  } finally {
    setLoading(false)
  }
}

const handleMarkAsRead  = async (id: string) => {
    try {
  const response = await markAsRead(id);
  if(response.success){
     await loadInitialNotifications();
  }else{
      toast.error("Failed to update status of the notification. Please try again.")
  }
  } catch (error) {
  console.error("Error marking notification as read:", error);
  toast.error("Failed to update status of the notification. Please try again.");
  }
}

const handleClearAllRead = async()=>{
  try {
    const response = await clearNotifications();
    if(response.success){
      await loadInitialNotifications();
    }else{
      toast.error("Failed to clear notifications. Please try again.")
  }
  } catch (error) {
    console.error("Error clearing notification :", error);
  toast.error("Failed to clear notifications. Please try again.");
  }
}

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header */}
     <div className="p-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
          <p className="text-sm text-gray-500 mt-1">
            {unreadCount} unread message{unreadCount !== 1 ? "s" : ""}
          </p>
        </div>
        
        {/* Clear All Read Button */}
          {activeTab === "all" && (
          <button
            onClick={handleClearAllRead}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 border border-red-200 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-50 disabled:hover:text-red-600"
          >
            {loading ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                Clearing...
              </>
            ) : (
              <>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear Read
              </>
            )}
          </button>
        )}
      </div>
    </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("unread")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "unread"
              ? "text-[#f69938] border-b-2 border-[#f69938] bg-[#f69938]/10"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setActiveTab("all")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "all"
              ? "text-[#f69938] border-b-2 border-[#f69938] bg-[#f69938]/10"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          All ({totalCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {initialLoading ? (
          <div className="p-8 text-center">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#f69938]" />
            <p className="text-sm text-gray-500">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-sm">{activeTab === "unread" ? "No unread notifications" : "No notifications"}</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                    key={notification._id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${!notification.isRead ? "bg-blue-50/30" : ""}`}
                >
                    <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                        {!notification.isRead && <span className="w-2 h-2 bg-[#f69938] rounded-full flex-shrink-0" />}
                        <h3 className="text-sm font-medium text-gray-900 truncate">{notification.title}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{notification.body}</p>
                        <p className="text-xs text-gray-400">
                        {new Date(notification.createdAt).toLocaleString('en-IN', {
                            day: '2-digit',
                            month: 'long',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                        })}
                        </p>
                    </div>

                    {/* Mark as read button - use _id */}
                    <button
                        onClick={() => handleMarkAsRead (notification._id)}
                        disabled={notification.isRead}
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        notification.isRead
                            ? "bg-[#f69938] text-white cursor-default"
                            : "bg-gray-200 text-gray-500 hover:bg-gray-300 cursor-pointer"
                        }`}
                        title={notification.isRead ? "Read" : "Mark as read"}
                    >
                        {notification.isRead ? <CheckCheck className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                    </button>
                    </div>
                </div>
                ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={loadMoreNotifications}
                  disabled={loading}
                  className="w-full py-2 px-4 text-sm font-medium text-[#f69938] bg-[#f69938]/10 hover:bg-[#f69938]/5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More"
                  )}
                </button>
              </div>
            )}

            {/* End of list indicator */}
            {!hasMore && notifications.length > 0 && (
              <div className="p-4 text-center border-t border-gray-100">
                <p className="text-xs text-gray-400">{"You've reached the end"}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
