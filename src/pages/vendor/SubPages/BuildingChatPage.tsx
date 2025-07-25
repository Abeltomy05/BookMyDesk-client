import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {  ReusableChat} from '@/components/ReusableComponents/chat';
import { defaultBuildingConfig, type ChatConfig, type ChatSidebarItem, type Message } from '@/types/chat.type';
import { formatTimeAgo } from '@/utils/formatters/time-ago';
import toast from 'react-hot-toast';
import ChatSkeleton from '@/components/Skeletons/ChatSkeleton';
import type { ChatSessionDto, GetMessageDTO } from '@/pages/client/SubPages/ClientChatPage';
import { vendorService } from '@/services/vendorServices';

const BuildingChatPage: React.FC = () => {
  const { buildingId } = useParams<{ buildingId: string }>();
  
  const buildingConfig: ChatConfig = {
    ...defaultBuildingConfig,
    title: 'Client Messages',
    searchPlaceholder: 'Search for clients...',
  };
  
  const [users, setUsers] = useState<ChatSidebarItem[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const transformChatSessionsToBuildings = (sessions: ChatSessionDto[]): ChatSidebarItem[] => {
    return sessions.map((session) => ({
      _id: session._id,
      userId: session.clientId?._id!,
      name: session.clientId?.name || 'Unknown Client',
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
      receiverId: msg.receiverId,
      text: msg.text,
      image: msg.image,
      isDeleted: msg.isDeleted,
      createdAt: new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) 
    }));
  };

  useEffect(() => {
    if (!buildingId) {
      toast.error("Building ID is required");
      setLoading(false);
      return;
    }

    const loadUsers = async () => {
      try {
        const response = await vendorService.getChats(buildingId);

        if (response.success && response.data) {
          // console.log("Response",response.data)
          const transformedUsers = transformChatSessionsToBuildings(response.data);
          // console.log(transformedUsers)
          setUsers(transformedUsers);
        } else {
          console.error("Failed to fetch chat users:", response.message);
          toast.error("Failed to fetch chat users");
          setUsers([]);
        }  
      } catch (error) {
        console.error("Failed to fetch chat users", error);
        toast.error("Failed to fetch chat users");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [buildingId]);

  const handleUserSelect = async (sessionId: string) => {
    try {
      const response = await vendorService.getChatMessages(sessionId);
      if (response.success && response.data) {
        console.log(response.data);
        const transformedMessages = transformMessagesToChat(response.data);
        console.log("transformed messages: ", transformedMessages);
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
    const response = await vendorService.clearChat(sessionId);
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
        <div className="min-h-screen bg-gray-50 py-13 px-4">
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

  if (!buildingId) {
    return (
        <div className="min-h-screen bg-gray-50 py-13 px-4">
          <div className="max-w-7xl mx-auto py-9">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="h-[calc(100vh-160px)] flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Invalid Building ID</h2>
                  <p className="text-gray-600">Please provide a valid building ID to access the chat.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50 py-13 px-4">
        <div className="max-w-7xl mx-auto py-9">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="h-[calc(100vh-160px)]">
              <ReusableChat
                config={buildingConfig}
                userId={buildingId!}
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

export default BuildingChatPage;