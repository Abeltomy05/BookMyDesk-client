import React from 'react';
import ClientLayout from '../ClientLayout';
import  { defaultClientConfig, ReusableChat, type ChatConfig } from '@/components/ReusableComponents/chat';

const ClientChatPage: React.FC = () => {
  const clientConfig: ChatConfig = {
    ...defaultClientConfig,
    title: 'My Messages',
    searchPlaceholder: 'Search for vendors...',
  };


  const handleUserSelect = (userId: string) => {
    console.log('User selected:', userId);
  };

  const handleMessageSend = (message: any, userId: string) => {
    console.log('Message sent:', message, 'to user:', userId);
  };

  const handleClearChat = (userId: string) => {
    console.log('Clear chat for user:', userId);
  };

  return (
    <ClientLayout activeMenuItem="messages">
      <div className="min-h-screen bg-gray-50 py-1 px-4">
        <div className="max-w-7xl mx-auto py-9">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="h-[calc(100vh-160px)]">
              <ReusableChat
                config={clientConfig}
                onUserSelect={handleUserSelect}
                onMessageSend={handleMessageSend}
                onClearChat={handleClearChat}
              />
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default ClientChatPage;