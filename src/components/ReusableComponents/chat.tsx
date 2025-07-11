import React, { useState, useRef, useEffect } from 'react';
import { Users, Search, MoreVertical, Trash2, Send, Paperclip, Smile, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  lastMessage: string;
  createdAt: string;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
}

interface Chat {
  id: string;
  userId: string;
  messages: Message[];
}

interface ChatConfig {
  userType: 'client' | 'vendor';
  primaryColor: string;
  primaryColorHover: string;
  primaryColorLight: string;
  title: string;
  searchPlaceholder: string;
  messagePlaceholder: string;
}

interface ReusableChatProps {
  config: ChatConfig;
  initialUsers?: User[];
  initialChats?: Chat[];
  onUserSelect?: (userId: string) => void;
  onMessageSend?: (message: Message, userId: string) => void;
  onClearChat?: (userId: string) => void;
}

const defaultClientConfig: ChatConfig = {
  userType: 'client',
  primaryColor: '#f69938',
  primaryColorHover: '#e38b2d',
  primaryColorLight: '#fff5e6',
  title: 'Messages',
  searchPlaceholder: 'Search vendors...',
  messagePlaceholder: 'Type a message...'
};

const defaultVendorConfig: ChatConfig = {
  userType: 'vendor',
  primaryColor: '#3b82f6',
  primaryColorHover: '#2563eb',
  primaryColorLight: '#eff6ff',
  title: 'Client Messages',
  searchPlaceholder: 'Search clients...',
  messagePlaceholder: 'Type your response...'
};

const ReusableChat: React.FC<ReusableChatProps> = ({
  config = defaultClientConfig,
  initialUsers = [],
  initialChats = [],
  onUserSelect,
  onMessageSend,
  onClearChat
}) => {
  const navigate = useNavigate()  
  const [users, setUsers] = useState<User[]>(initialUsers.length > 0 ? initialUsers : [
    {
      id: "1",
      name: config.userType === 'client' ? "Sarah Johnson" : "Mike Chen",
      avatar: "https://res.cloudinary.com/dnivctodr/image/upload/v1748161273/BMS-logo_hcz5ww.png",
      isOnline: true,
      lastMessage: config.userType === 'client' ? "Hey, are you available for a consultation?" : "I'm interested in your services",
      createdAt: "2 min ago",
    },
    {
      id: "2",
      name: config.userType === 'client' ? "Mike Chen" : "Sarah Johnson",
      avatar: "https://res.cloudinary.com/dnivctodr/image/upload/v1748161273/BMS-logo_hcz5ww.png",
      isOnline: false,
      lastMessage: "Thanks for the quick response!",
      createdAt: "1 hour ago",
    },
    {
      id: "3",
      name: config.userType === 'client' ? "Emma Davis" : "Emma Davis",
      avatar: "https://res.cloudinary.com/dnivctodr/image/upload/v1748161273/BMS-logo_hcz5ww.png",
      isOnline: true,
      lastMessage: "Can we schedule a meeting?",
      createdAt: "3 hours ago",
    },
  ]);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState<Chat[]>(initialChats.length > 0 ? initialChats : [
    {
      id: "1",
      userId: "1",
      messages: [
        {
          id: "1",
          senderId: "1",
          content: config.userType === 'client' ? "Hey, are you available for a consultation?" : "I'm interested in your services",
          timestamp: "10:30 AM",
          type: "text",
        },
        {
          id: "2",
          senderId: "me",
          content: config.userType === 'client' ? "Yes, I'm available. What would you like to discuss?" : "Great! I'd love to help you. What do you need?",
          timestamp: "10:32 AM",
          type: "text",
        },
        {
          id: "3",
          senderId: "1",
          content: config.userType === 'client' ? "I need help with my business strategy." : "I need help with marketing strategy.",
          timestamp: "10:35 AM",
          type: "text",
        },
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: "smooth",
      block: "end",
      inline: "nearest"
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats, selectedUserId]);

  const filteredUsers = users.filter((user) => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedUser = users.find((user) => user.id === selectedUserId);
  const currentChat = chats.find((chat) => chat.userId === selectedUserId);

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
    onUserSelect?.(userId);
  };

  const handleSendMessage = () => {
    if (!message.trim() || !selectedUserId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: "me",
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "text",
    };

    setChats((prevChats) => {
      const existingChatIndex = prevChats.findIndex((chat) => chat.userId === selectedUserId);
      if (existingChatIndex >= 0) {
        const updatedChats = [...prevChats];
        updatedChats[existingChatIndex].messages.push(newMessage);
        return updatedChats;
      } else {
        return [
          ...prevChats,
          {
            id: selectedUserId,
            userId: selectedUserId,
            messages: [newMessage],
          },
        ];
      }
    });

    onMessageSend?.(newMessage, selectedUserId);
    setMessage("");
  };

  const handleClearChat = () => {
    if (!selectedUserId) return;
    setChats((prevChats) => prevChats.filter((chat) => chat.userId !== selectedUserId));
    onClearChat?.(selectedUserId);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-full bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-100 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6" style={{ color: config.primaryColor }} />
            <h1 className="text-xl font-semibold text-gray-800">{config.title}</h1>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={config.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ 
                '--tw-ring-color': config.primaryColor,
                focusRingColor: config.primaryColor
              } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Users className="w-12 h-12 mb-2 text-gray-300" />
              <p className="text-sm">No users available</p>
            </div>
          ) : (
            <div className="p-2">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleUserSelect(user.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedUserId === user.id 
                      ? "border" 
                      : "hover:bg-gray-50"
                  }`}
                  style={selectedUserId === user.id ? {
                    backgroundColor: config.primaryColorLight,
                    borderColor: config.primaryColor
                  } : {}}
                >
                  <div className="relative">
                    <img
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {user.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{user.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{user.lastMessage}</p>
                    <p className="text-xs text-gray-400">{user.createdAt}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {filteredUsers.length === 0 || !selectedUserId ? (
          /* Common No User Selected State */
          <div className="flex-1 flex flex-col items-center justify-center bg-white">
            <div className="text-center">
              <div className="relative mb-6">
                <MessageCircle className="w-16 h-16 mx-auto" style={{ color: config.primaryColor }} />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">{filteredUsers.length === 0 
                  ? "No User to Chat" 
                  : "Select a user"
                }</h2>
              <p className="text-gray-600">
                {filteredUsers.length === 0 
                  ? "No users available for conversation" 
                  : "Select a user from the sidebar to start chatting"
                }
              </p>
            </div>
          </div>
        ) : (
          /* Chat Selected State */
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={selectedUser?.avatar || "/placeholder.svg"}
                    alt={selectedUser?.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {selectedUser?.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-800">{selectedUser?.name}</h2>
                  <p className="text-sm text-gray-500">{selectedUser?.isOnline ? "Online" : "Offline"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearChat}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Clear chat"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-4" style={{ scrollBehavior: 'smooth' }}>
              <div className="space-y-4">
                {currentChat?.messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.senderId === "me" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.senderId === "me"
                          ? "text-white"
                          : "bg-white text-gray-800 border border-gray-200"
                      }`}
                      style={msg.senderId === "me" ? { backgroundColor: config.primaryColor } : {}}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.senderId === "me" ? "text-gray-100" : "text-gray-500"}`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} style={{ height: '1px' }} />
              </div>
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-end gap-3">
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>

                <div className="flex-1 relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={config.messagePlaceholder}
                    rows={1}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent resize-none"
                    style={{
                        minHeight: '40px',
                        maxHeight: '120px',
                        '--tw-ring-color': config.primaryColor
                    } as React.CSSProperties & Record<string, string>}
                    />
                </div>

                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <Smile className="w-5 h-5" />
                </button>

                <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="p-2 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    style={{
                        backgroundColor: message.trim() ? config.primaryColor : undefined,
                        '--hover-bg': config.primaryColorHover
                    } as React.CSSProperties & Record<string, string>}
                    onMouseEnter={(e) => {
                        if (message.trim()) {
                        e.currentTarget.style.backgroundColor = config.primaryColorHover;
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (message.trim()) {
                        e.currentTarget.style.backgroundColor = config.primaryColor;
                        }
                    }}
                    >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export { ReusableChat, defaultClientConfig, defaultVendorConfig };
export type { ChatConfig, User, Message, Chat, ReusableChatProps };