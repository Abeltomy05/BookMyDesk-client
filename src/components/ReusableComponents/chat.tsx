import React, { useState, useEffect } from 'react';
import { type Message, type ChatSidebarItem, type ChatConfig, defaultClientConfig } from '@/types/chat.type';
import socketService from '@/services/socketService/socketService';
import { uploadImageCloudinary } from '@/utils/cloudinary/cloudinary';
import toast from 'react-hot-toast';
import { Sidebar } from '../ChatComponents/ChatSideBar';
import { ChatArea } from '../ChatComponents/ChatArea';

interface ReusableChatProps {
  config: ChatConfig;
  userId: string;
  initialUsers?: ChatSidebarItem[];
  initialMessages?: Message[];
  onUserSelect?: (sessionId: string) => void;
  onClearChat?: (sessionId: string) => void;
}

const ReusableChat: React.FC<ReusableChatProps> = ({
  config = defaultClientConfig,
  userId,
  initialUsers = [],
  initialMessages = [],
  onUserSelect,
  onClearChat,
}) => {
  const [sessions, setSessions] = useState<ChatSidebarItem[]>(initialUsers);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isUploading, setIsUploading] = useState(false);
  const [typingSessions, setTypingSessions] = useState<Record<string, boolean>>({});
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);

  const currentUserId = userId;

//connection useEffect
 useEffect(() => {
    if (config.userType === "building" && !socketService.isConnected()) {
      socketService.connect(currentUserId, config.userType);
    }

    const handleReceiveMessage = (data: any) => {
      console.log("Received message:", data);
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


  setSessions((prev) => {
    const updatedSessions = prev.map((session) =>
      session._id === data.sessionId
        ? {
            ...session,
            lastMessage: data.text || "Image",
            createdAt: "now",
          }
        : session
    );

    return updatedSessions.sort((a, b) => {
      if (a._id === data.sessionId) return -1; // Move updated session to top
      if (b._id === data.sessionId) return 1;
      return 0; 
    });
  });
    };

    socketService.onReceiveMessage(handleReceiveMessage);

    return () => {
      if (config.userType === "building") {
        socketService.disconnect();
      }
      socketService.getSocket()?.off("receiveMessage", handleReceiveMessage);
    };
  }, [currentUserId, config.userType, selectedSessionId]);

  // online presence useEffect
 useEffect(() => {
   const socket = socketService.getSocket();

    if (socket) {
    socket.emit("requestOnlineUsers");
  }

    if (config.userType === "building" && !socketService.isConnected()) {
      socketService.connect(currentUserId, config.userType);
      // socketService.getSocket()?.emit("requestOnlineUsers");
    }

    const handleOnlineUsers = (userIds: string[]) => {
      console.log("Received online users:", userIds);
      setOnlineUserIds(userIds);
    };

    const handleUserOnline = ({ userId }: { userId: string }) => {
      setOnlineUserIds(prev => (prev.includes(userId) ? prev : [...prev, userId]));
    };

    const handleUserOffline = ({ userId }: { userId: string }) => {
      setOnlineUserIds((prev) => prev.filter((id) => id !== userId));
    };

    socket?.on("onlineUsers", handleOnlineUsers);
    socket?.on("userOnline", handleUserOnline);
    socket?.on("userOffline", handleUserOffline);

    return () => {
      socket?.off("onlineUsers", handleOnlineUsers);
      socket?.off("userOnline", handleUserOnline);
      socket?.off("userOffline", handleUserOffline);
    };
  }, [currentUserId, config.userType]);

  // Typing useEffect
 useEffect(() => {
    const handleTyping = (data: any) => {
      if (data.sessionId) {
        setTypingSessions((prev) => ({ ...prev, [data.sessionId]: true }));
      }
    };

    const handleStopTyping = (data: any) => {
      console.log("stopTyping RECEIVED:", data);
      if (data.sessionId) {
        setTypingSessions((prev) => {
          const updated = { ...prev };
          delete updated[data.sessionId];
          return updated;
        });
      }
    };

    socketService.onTyping(handleTyping);
    socketService.onStopTyping(handleStopTyping);

    return () => {
      socketService.getSocket()?.off("typing", handleTyping);
      socketService.getSocket()?.off("stopTyping", handleStopTyping);
    };
  }, [selectedSessionId]);

useEffect(() => {
  const handleMessageDeleted = ({ messageId }: { messageId: string }) => {
    setMessages((prev) => prev.map((msg) => msg._id === messageId ? { ...msg, isDeleted: true } : msg ));
  };

  socketService.onMessageDeleted(handleMessageDeleted);

  return () => {
    socketService.getSocket()?.off("messageDeleted", handleMessageDeleted);
  };
}, []);

   useEffect(() => {
    setSessions(initialUsers);
  }, [initialUsers]);

  useEffect(() => {
    setMessages(initialMessages || []);
  }, [initialMessages]);

  useEffect(() => {
    if (selectedSessionId) {
      socketService.joinRoom(selectedSessionId);
    }
  }, [selectedSessionId]);

  const selectedSession = sessions.find((user) => user._id === selectedSessionId);

 const handleUserSelect = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setMessages([]); 
    onUserSelect?.(sessionId);

    setTypingSessions(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(key => (updated[key] = false));
      return updated;
    });
  };

  const handleSendMessage = async (text: string, image?: File) => {
    if (!text && !image) return;
    if (!selectedSessionId) return;

    const isClient = config.userType === 'client';
    let imageUrl: string | null = null;

    setIsUploading(true);

    try {
      if (image) {
        imageUrl = await uploadImageCloudinary(image);
      }

      const messageData = {
        sessionId: selectedSessionId,
        senderId: currentUserId,
        receiverId: selectedSession?.userId,
        text: text || null,
        image: imageUrl,
        senderModel: isClient ? 'Client' : 'Building',
        receiverModel: isClient ? 'Building' : 'Client',
      };
      
      socketService.sendMessage(messageData);
      socketService.emitStopTyping(selectedSessionId);
    } catch (error) {
      toast.error('Failed to send message.');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClearChat = () => {
     if (selectedSessionId) {
      onClearChat?.(selectedSessionId);
    }
  };

  

 return (
    <div className="flex h-full bg-gray-100">
      <Sidebar
        config={config}
        sessions={sessions}
        selectedSessionId={selectedSessionId}
        typingSessions={typingSessions}
        onlineUserIds={onlineUserIds}
        onUserSelect={handleUserSelect}
      />
      <ChatArea
        config={config}
        selectedSessionId={selectedSessionId}
        selectedSession={selectedSession}
        messages={messages}
        typingSessions={typingSessions}
        onlineUserIds={onlineUserIds}
        currentUserId={currentUserId}
        onSendMessage={handleSendMessage}
        onClearChat={handleClearChat}
        isUploading={isUploading}
      />
    </div>
  );
};

export { ReusableChat };
export type { ReusableChatProps };