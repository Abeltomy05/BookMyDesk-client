import socketService from "@/services/socketService";
import type { ChatConfig, ChatSidebarItem, Message } from "@/types/chat.type";
import { MessageCircle, MoreVertical, Paperclip, Send, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ConfirmModal from "../ReusableComponents/ConfirmModal";

interface ChatAreaProps {
  config: ChatConfig;
  selectedSessionId: string | null;
  selectedSession: ChatSidebarItem | undefined;
  messages: Message[];
  typingSessions: Record<string, boolean>;
  onlineUserIds: string[];
  currentUserId: string;
  onSendMessage: (text: string, image?: File) => void;
  onClearChat: () => void;
  isUploading: boolean;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  config,
  selectedSessionId,
  selectedSession,
  messages,
  typingSessions,
  onlineUserIds,
  currentUserId,
  onSendMessage,
  onClearChat,
  isUploading,
}) => {
  const [input, setInput] = useState('');
  const [imagePreview, setImagePreview] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [showClearChatModal, setShowClearChatModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isUserOnline = (userId: string) => onlineUserIds.includes(userId);

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
   const images = document.querySelectorAll<HTMLImageElement>('.chat-message-image');
  if (images.length === 0) {
    scrollToBottom();
    return;
  }

  let loadedCount = 0;
  images.forEach((img) => {
    if (img.complete) {
      loadedCount++;
      if (loadedCount === images.length) scrollToBottom();
    } else {
      img.onload = () => {
        loadedCount++;
        if (loadedCount === images.length) scrollToBottom();
      };
    }
  });
  }, [messages, selectedSessionId, typingSessions]);

  const handleSendMessage = async () => {
    if (!input.trim() && !imagePreview) return;
    if (!selectedSessionId) return;

    onSendMessage(input.trim(), imagePreview || undefined);
    setInput('');
    setImagePreview(null);
    setImagePreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImagePreview(file);
    setImagePreviewUrl(URL.createObjectURL(file)); 
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

      const sessionId = selectedSessionId; 

      typingTimeoutRef.current = setTimeout(() => {
        socketService.emitStopTyping(sessionId);
      }, 1000);
    }
  };

  const confirmClearChat = () => {
    onClearChat();
    setShowClearChatModal(false);
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessageToDelete(messageId);
  };

  const confirmDeleteMessage = () => {
    if (messageToDelete && selectedSessionId) {
        socketService.deleteMessage({ messageId: messageToDelete, sessionId: selectedSessionId });
    }
    setMessageToDelete(null);
  };


  if (!selectedSessionId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white text-center px-6">
        <div>
          <MessageCircle className="w-16 h-16 mx-auto mb-4" style={{ color: config.primaryColor }} />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Select a user</h2>
          <p className="text-gray-600">Choose a user from the sidebar to start chatting.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
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
            {isUserOnline(selectedSession?.userId || '') && (
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
            )}
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">{selectedSession?.name}</h2>
            <p className="text-sm text-gray-500">
              {isUserOnline(selectedSession?.userId || '') ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowClearChatModal(true)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Clear chat"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          {/* <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button> */}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
       <div key={msg._id} className={`flex ${isMyMessage(msg) ? 'justify-end' : 'justify-start'}`}>
        {msg.isDeleted ? (
        // Deleted message UI
            <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gray-100 border border-gray-200">
                <p className="text-sm text-gray-500 italic">Message deleted</p>
                <p className="text-xs mt-1 text-gray-400">{msg.createdAt}</p>
            </div>
                ) : (
            <div className="relative group max-w-xs lg:max-w-md px-4 py-2 rounded-lg transition-colors"
                style={isMyMessage(msg) ? { backgroundColor: config.primaryColor, color: '#fff' } : { backgroundColor: '#fff' }}>
                
                {msg.text && <p className="text-sm">{msg.text}</p>}
                {msg.image && <img src={msg.image} alt="Shared" className="chat-message-image max-w-full h-auto mt-1 rounded-lg" />}
                <p className="text-xs mt-1 text-gray-300">{msg.createdAt}</p>

                {isMyMessage(msg) && (
                <button
                    onClick={() => handleDeleteMessage(msg._id)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110"
                    title="Delete Message"
                >
                    <Trash2 className="w-3 h-3" />
                </button>
                )}
            </div>
            )}
        </div>
        ))}

        {selectedSessionId && typingSessions[selectedSessionId] && (
        <div className="flex justify-start">
            <div className="bg-[#f69938] rounded-lg px-3 py-2 shadow-sm">
            <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
            </div>
            </div>
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
            {imagePreviewUrl && (
              <div className="mb-2 relative w-fit">
                <img
                  src={imagePreviewUrl}
                  alt="Preview"
                  className="max-h-32 rounded-lg border border-gray-300"
                />
                <button
                  onClick={() => {
                    setImagePreview(null);
                    setImagePreviewUrl(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="absolute top-1 right-1 bg-white text-gray-700 border border-gray-300 rounded-full p-1 hover:bg-red-100 hover:text-red-600"
                  title="Remove image"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
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
            disabled={(!input.trim() && !imagePreview) || isUploading}
            className="p-2 text-white rounded-lg transition-colors disabled:bg-gray-300"
            style={{
              backgroundColor: (input.trim() || imagePreview) && !isUploading ? config.primaryColor : undefined
            }}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        {isUploading && (
          <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            Sending image...
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showClearChatModal}
        onClose={() => setShowClearChatModal(false)}
        onConfirm={confirmClearChat}
        title="Clear Chat"
        message="Are you sure you want to clear this chat? This will only remove it for you."
        variant="warning"
        confirmText="Clear"
        />

        <ConfirmModal
            isOpen={!!messageToDelete}
            onClose={() => setMessageToDelete(null)}
            onConfirm={confirmDeleteMessage}
            title="Delete Message"
            message="Are you sure you want to delete this message?"
            variant="danger"
            confirmText="Delete"
         />
    </div>
  );
};