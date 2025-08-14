import { io, Socket } from "socket.io-client";

class NotificationSocketService {
  private socket: Socket | null = null;

  connect(userId: string, userType: 'client' | 'vendor') {
    if (this.socket?.connected) {
      this.disconnect();
    }

    const serverUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

    this.socket = io(serverUrl, {
      path: "/notification-socket",
      auth: {
        userId,
        userType,
      },
      transports: ["websocket"],
    });

    this.socket.on("connect", () => {
      console.log("🔔 Connected to notification socket:", this.socket?.id);
    });

    this.socket.on("disconnect", () => {
      console.log("🔌 Notification socket disconnected");
    });

    this.socket.on("connect_error", (err) => {
      console.error("❌ Notification socket connection error:", err);
    });
  }

  onNotification(callback: (payload: {type?:'chat' | 'general'}) => void) {
    this.socket?.on("newNotification", callback);
  }

  removeAllListeners() {
    this.socket?.removeAllListeners();
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const notificationSocketService = new NotificationSocketService();
export default notificationSocketService;