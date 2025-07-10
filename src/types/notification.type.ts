export interface Notification {
  _id: string;
  title: string;
  body: string;
  isRead: boolean;
  metaData: object;
  createdAt: Date;
}

export interface NotificationResponse {
  items: Notification[];
  totalCount: number;
  unreadCount: number;
  hasMore: boolean;
}