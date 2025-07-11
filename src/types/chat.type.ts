export interface User {
  id: string
  name: string
  avatar: string
  isOnline: boolean
  lastMessage?: string
  timestamp?: string
}

export interface Message {
  id: string
  senderId: string
  content: string
  timestamp: string
  type: "text" | "image" | "file"
}

export interface Chat {
  id: string
  userId: string
  messages: Message[]
}