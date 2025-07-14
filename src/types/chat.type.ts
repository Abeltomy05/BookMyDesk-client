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
  createdAt?: string;
}
