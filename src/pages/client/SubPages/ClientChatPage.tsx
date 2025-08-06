import React, { useEffect, useState } from 'react';
import { ReusableChat } from '@/components/ReusableComponents/chat';
import { clientService } from '@/services/clientServices';
import { defaultClientConfig, type ChatConfig, type ChatSidebarItem, type Message } from '@/types/chat.type';
import { formatTimeAgo } from '@/utils/formatters/time-ago';
import toast from 'react-hot-toast';
import ChatSkeleton from '@/components/Skeletons/ChatSkeleton';
import type { RootState } from '@/store/store';
import { useSelector } from 'react-redux';

export interface ChatSessionDto {
  _id: string;
  clientId?: {
    _id: string;
    name: string;
    avatar?: string;
  };
  buildingId?: {
    _id: string;
    buildingName: string;
  };
  lastMessage?: string;
  lastMessageAt?: Date;
}

export interface GetMessageDTO {
  _id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  image?: string;
  isDeleted?: boolean;
  createdAt: Date;
}

const ClientChatPage: React.FC = () => {
  const clientConfig: ChatConfig = {
    ...defaultClientConfig,
    title: 'My Messages',
    searchPlaceholder: 'Search for buildings...',
  };
  const [users, setUsers] = useState<ChatSidebarItem[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const user = useSelector((state: RootState) => state.client.client);

  const transformChatSessionsToUsers = (sessions: ChatSessionDto[]): ChatSidebarItem[] => {
    return sessions
    .sort((a, b) => {
      const dateA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
      const dateB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
      return dateB - dateA;
    })
    .map((session) => ({
      _id: session._id,
      userId: session.buildingId?._id!,
      name: session.buildingId?.buildingName || 'Unknown Building',
      avatar: session.clientId?.avatar,
      isOnline: false,
      lastMessage: session.lastMessage,
      createdAt: formatTimeAgo(session.lastMessageAt),
    }));
  };

  const transformMessagesToChat = (messages: GetMessageDTO[]): Message[] => {
    return messages.map((msg) => ({
      _id: msg._id,
      senderId: msg.senderId,
      receiverId : msg.receiverId,
      text: msg.text,
      image: msg.image,
      isDeleted: msg.isDeleted,
      createdAt: new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) 
    }));
  };

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await clientService.getChats();

        if (response.success && response.data) {
          const transformedUsers = transformChatSessionsToUsers(response.data);
          setUsers(transformedUsers);
        } else {
          console.error("Failed to fetch chat users:", response.message);
          toast.error("Failed to fetch chat users");
          setUsers([]);
        }  
      } catch (error) {
        console.error("Failed to fetch chat users", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleUserSelect = async (sessionId: string) => {
    try {
      const response = await clientService.getChatMessages(sessionId);
      if (response.success && response.data) {
        // console.log("Messages",response.data)
        const transformedMessages = transformMessagesToChat(response.data);
        // console.log("transformed messages: ", transformedMessages);
        setMessages(transformedMessages);
      } else {
        console.error("Failed to fetch messages:", response.message);
        toast.error("Failed to fetch messages");
      }
    } catch (error) {
      console.error("Failed to fetch messages.", error);
      toast.error("Failed to fetch messages");
    }
  };

  const handleClearChat = async (sessionId: string) => {
  try {
    const response = await clientService.clearChat(sessionId);
    if (response.success) {
      toast.success("Chat cleared successfully");
      setMessages([]); 
    } else {
      toast.error("Failed to clear chat");
    }
  } catch (error) {
    console.error("Clear chat error", error);
    toast.error("Something went wrong while clearing chat");
  }
};


  if (loading) {
    return (
        <div className="min-h-screen bg-gray-50 py-1 px-4">
          <div className="max-w-7xl mx-auto py-9">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="h-[calc(100vh-160px)]">
                <ChatSkeleton />
              </div>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50 py-1 px-4">
        <div className="max-w-7xl mx-auto py-9">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="h-[calc(100vh-160px)]">
              <ReusableChat
                config={clientConfig}
                userId={user?._id!}
                initialUsers={users}
                initialMessages={messages}
                onUserSelect={handleUserSelect}
                onClearChat={handleClearChat}
              />
            </div>
          </div>
        </div>
      </div>

  );
};

export default ClientChatPage;