import React, { useState, useRef, useEffect } from 'react';
import { Users, Search, MoreVertical, Trash2, Send, Paperclip, MessageCircle } from 'lucide-react';
import type { Message, ChatSidebarItem } from '@/types/chat.type';
import socketService from '@/services/socketService';
import { uploadImageCloudinary } from '@/utils/cloudinary/cloudinary';
import toast from 'react-hot-toast';

interface ChatConfig {
  userType: 'client' | 'building';
  primaryColor: string;
  primaryColorHover: string;
  primaryColorLight: string;
  title: string;
  searchPlaceholder: string;
  messagePlaceholder: string;
}

interface ReusableChatProps {
  config: ChatConfig;
  userId: string;
  initialUsers?: ChatSidebarItem[];
  initialMessages?: Message[];
  onUserSelect?: (sessionId: string) => void;
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

const defaultBuildingConfig: ChatConfig = {
  userType: 'building',
  primaryColor: '#f69938',
  primaryColorHover: '#e38b2d',
  primaryColorLight: '#fff5e6',
  title: 'Client Messages',
  searchPlaceholder: 'Search clients...',
  messagePlaceholder: 'Type your response...'
};

const ReusableChat: React.FC<ReusableChatProps> = ({
  config = defaultClientConfig,
  userId,
  initialUsers = [],
  initialMessages = [],
  onUserSelect,
}) => {
  const [sessions, setSessions] = useState<ChatSidebarItem[]>(initialUsers);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isUploading, setIsUploading] = useState(false);
  const [typingSessions, setTypingSessions] = useState<Record<string, boolean>>({});


  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentUserId = userId;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: "smooth",
      block: "end",
      inline: "nearest"
    });
  };

  const isMyMessage = (message: Message) => {
    return message.senderId === currentUserId;
  };

useEffect(() => {
  socketService.onTyping((data) => {
    if (data.sessionId) {
      setTypingSessions((prev) => ({ ...prev, [data.sessionId]: true }));
    } 
  });

  socketService.onStopTyping((data) => {
    if (data.sessionId) {
      setTypingSessions((prev) => {
        const copy = { ...prev };
        delete copy[data.sessionId];
        return copy;
      });

    }
  });

  return () => {
    socketService.getSocket()?.off("typing");
    socketService.getSocket()?.off("stopTyping");
  };
}, [selectedSessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedSessionId]);

  useEffect(() => {
    setSessions(initialUsers);
  }, [initialUsers]);

  useEffect(() => {
    setMessages(initialMessages || []);
  }, [initialMessages]);

  useEffect(() => {
    if (!socketService.isConnected()) {
      socketService.connect(currentUserId, config.userType);
    }

    const handleReceiveMessage = (data: any) => {
      console.log("Received message:",data)
      const newMessage: Message = {
        _id: data._id,
        senderId: data.senderId,
        receiverId: data.receiverId,
        text: data.text,
        image: data.image,
        createdAt: new Date(data.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      if (selectedSessionId && data.sessionId === selectedSessionId) {
        setMessages((prev) => [...prev, newMessage]);
      }

      setSessions((prev) =>
        prev.map((session) =>
          session._id === data.sessionId
            ? {
                ...session,
                lastMessage: data.text || "Image",
                createdAt: "now",
              }
            : session
        )
      );
    };

    socketService.onReceiveMessage(handleReceiveMessage);

    return () => {
      socketService.getSocket()?.off("receiveMessage", handleReceiveMessage);
    };
  }, [currentUserId, config.userType, selectedSessionId]);

  useEffect(() => {
    if (selectedSessionId) {
      socketService.joinRoom(selectedSessionId);
    }
  }, [selectedSessionId]);
  
  const filteredSessions = sessions.filter((session) => 
    session.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedSession = sessions.find((user) => user._id === selectedSessionId);

  const handleUserSelect = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setMessages([]); 
    onUserSelect?.(sessionId);
  };

  const handleSendMessage = () => {
    if (!input.trim() || !selectedSessionId) return;
    const isClient = config.userType === 'client';

    const messageData = {
      sessionId: selectedSessionId,
      senderId: currentUserId,
      receiverId: selectedSession?.userId,
      text: input.trim(),
      image: null,
      senderModel: isClient ? 'Client' : 'Building',
      receiverModel: isClient ? 'Building' : 'Client',
    };

    socketService.sendMessage(messageData);
    setInput('');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file || !selectedSessionId) return;

  const isClient = config.userType === 'client';

  setIsUploading(true);
  
  try {
    const imageUrl = await uploadImageCloudinary(file);
    
    const messageData = {
      sessionId: selectedSessionId,
      senderId: currentUserId,
      receiverId: selectedSession?.userId,
      text: null,
      image: imageUrl,
      senderModel: isClient ? 'Client' : 'Building',
      receiverModel: isClient ? 'Building' : 'Client',
    };

    socketService.sendMessage(messageData);
  } catch (error) {
    console.error('Failed to upload image:', error);
    toast.error("Failed to upload image.")
  } finally {
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }
};

  const handleClearChat = () => {

  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);

   if (selectedSessionId) {
    socketService.emitTyping(selectedSessionId);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketService.emitStopTyping(selectedSessionId);
    }, 2000);
  }
  };

  return (
    <div className="flex h-full bg-gray-100">
      {/* Sidebar */}
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
                  onClick={() => handleUserSelect(session._id)}
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
                        src={session.avatar}
                        alt={session.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-500 text-white flex items-center justify-center font-semibold">
                        {session.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {session.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{session.name}</h3>
                    <p className="text-sm text-gray-500 truncate">
                      {typingSessions[session._id] ? "Typing..." : session.lastMessage}
                    </p>
                    <p className="text-xs text-gray-400">{session.createdAt}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {!selectedSessionId ? (
          <div className="flex-1 flex items-center justify-center bg-white text-center px-6">
            <div>
              <MessageCircle className="w-16 h-16 mx-auto mb-4" style={{ color: config.primaryColor }} />
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Select a user</h2>
              <p className="text-gray-600">Choose a user from the sidebar to start chatting.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {selectedSession?.avatar ? (
                    <img
                      src={selectedSession.avatar}
                      alt={selectedSession.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-500 text-white flex items-center justify-center font-semibold">
                      {selectedSession?.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {selectedSession?.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-800">{selectedSession?.name}</h2>
                  <p className="text-sm text-gray-500">
                    {selectedSession?.isOnline ? 'Online' : 'Offline'}
                  </p>
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

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg._id} className={`flex ${isMyMessage(msg) ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        isMyMessage(msg)
                          ? 'text-white'
                          : 'bg-white text-gray-800 border border-gray-200'
                      }`}
                      style={isMyMessage(msg) ? { backgroundColor: config.primaryColor } : {}}
                    >
                      {msg.text && <p className="text-sm">{msg.text}</p>}
                      {msg.image && (
                        <img 
                          src={msg.image} 
                          alt="Shared image" 
                          className="max-w-full h-auto rounded-lg mt-1"
                          style={{ maxHeight: '200px' }}
                        />
                      )}
                      <p className={`text-xs mt-1 ${isMyMessage(msg) ? 'text-gray-100' : 'text-gray-500'}`}>
                        {msg.createdAt}
                      </p>
                    </div>
                  </div>
                ))}

                  {selectedSessionId && typingSessions[selectedSessionId] && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 italic">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <span className="ml-2">Typing...</span>
                    </div>
                  )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex items-end gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                    title={isUploading ? "Uploading..." : "Upload image"}
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <div className="flex-1 relative">
                    <textarea
                      value={input}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyPress}
                      placeholder={config.messagePlaceholder}
                      rows={1}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:border-transparent"
                      style={{ '--tw-ring-color': config.primaryColor } as React.CSSProperties}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isUploading}
                    className="p-2 text-white rounded-lg transition-colors disabled:bg-gray-300"
                    style={{
                      backgroundColor: (input.trim() && !isUploading) ? config.primaryColor : undefined
                    }}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                {isUploading && (
                  <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                    Loading image...
                  </div>
                )}
              </div>
          </>
        )}
      </div>
    </div>
  );
};

export { ReusableChat, defaultClientConfig, defaultBuildingConfig };
export type { ChatConfig, ReusableChatProps };