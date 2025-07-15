export interface ChatSidebarItem  {
  _id: string
  userId: string
  name: string
  avatar?: string
  isOnline: boolean
  lastMessage?: string
  createdAt?: string
}

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text?: string | null;
  image?: string | null;
  isDeleted?: boolean;
  createdAt?: string;
}

// chat reusable component types

export interface ChatConfig {
  userType: 'client' | 'building';
  primaryColor: string;
  primaryColorHover: string;
  primaryColorLight: string;
  title: string;
  searchPlaceholder: string;
  messagePlaceholder: string;
}

export const defaultClientConfig: ChatConfig = {
  userType: 'client',
  primaryColor: '#f69938',
  primaryColorHover: '#e38b2d',
  primaryColorLight: '#fff5e6',
  title: 'Messages',
  searchPlaceholder: 'Search vendors...',
  messagePlaceholder: 'Type a message...'
};

export const defaultBuildingConfig: ChatConfig = {
  userType: 'building',
  primaryColor: '#f69938',
  primaryColorHover: '#e38b2d',
  primaryColorLight: '#fff5e6',
  title: 'Client Messages',
  searchPlaceholder: 'Search clients...',
  messagePlaceholder: 'Type your response...'
};