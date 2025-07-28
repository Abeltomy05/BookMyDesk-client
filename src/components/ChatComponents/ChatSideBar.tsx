import type { ChatConfig, ChatSidebarItem } from "@/types/chat.type";
import { Image, Search, Users } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  config: ChatConfig;
  sessions: ChatSidebarItem[];
  selectedSessionId: string | null;
  typingSessions: Record<string, boolean>;
  onlineUserIds: string[];
  onUserSelect: (sessionId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  config,
  sessions,
  selectedSessionId,
  typingSessions,
  onlineUserIds,
  onUserSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const isUserOnline = (userId: string) => onlineUserIds.includes(userId);

  const filteredSessions = sessions.filter((session) => 
    session.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-6 h-6" style={{ color: config.primaryColor }} />
          <h1 className="text-xl font-semibold text-gray-800">{config.title}</h1>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={config.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
            style={{ '--tw-ring-color': config.primaryColor } as React.CSSProperties}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Users className="w-12 h-12 mb-2 text-gray-300" />
            <p className="text-sm">No users available</p>
          </div>
        ) : (
          <div className="p-2">
            {filteredSessions.map((session) => (
              <div
                key={session._id}
                onClick={() => onUserSelect(session._id)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedSessionId === session._id
                    ? 'border'
                    : 'hover:bg-gray-200'
                }`}
                style={
                  selectedSessionId === session._id
                    ? {
                        backgroundColor: config.primaryColorLight,
                        borderColor: config.primaryColor
                      }
                    : {}
                }
              >
                <div className="relative">
                  {session.avatar ? (
                    <img
                      src={`${import.meta.env.VITE_CLOUDINARY_SAVE_URL}${session.avatar}`}
                      alt={session.name}
                      className="w-12 h-12 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-500 text-white flex items-center justify-center font-semibold">
                      {session.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {isUserOnline(session.userId) && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{session.name}</h3>
                  <p className={`text-sm truncate font-medium ${
                    typingSessions[session._id] ? 'text-green-500' : 'text-gray-500'
                  }`}>
                    {typingSessions[session._id] ? (
                      "Typing..."
                    ) : session.lastMessage === "Image" ? (
                      <span className="flex items-center gap-1">
                        <Image className="w-4 h-4" /> Image
                      </span>
                    ) : (
                      session.lastMessage
                    )}
                  </p>
                  {
                  typingSessions[session._id] || 
                  (<p className="text-xs text-gray-400">{session.createdAt}</p>)
                  }
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};