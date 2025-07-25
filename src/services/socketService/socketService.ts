import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private _userId: string | null = null;
  private _userType: 'client' | 'building' | null = null;

  connect(userId: string, userType: 'client' | 'building') {
    if (this.socket?.connected) {
      this.disconnect();
    }

    const serverUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
    
    this.socket = io(serverUrl, {
      auth: {
        userId,
        userType,
      },
      transports: ['websocket']
    });

    this._userId = userId;
    this._userType = userType;
    console.debug("Socket connected with:", this._userId, this._userType);

    this.socket.on('connect', () => {
      console.log('Connected to socket server:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this._userId = null;
      this._userType = null;
    }
  }

  getSocket() {
    return this.socket;
  }

  isConnected() {
    return this.socket?.connected || false;
  }

  // Chat related methods
  joinRoom(sessionId: string) {
    if (this.socket) {
      this.socket.emit('joinRoom', sessionId);
    }
  }

  sendMessage(data: any) {
    if (this.socket) {
      this.socket.emit('sendMessage', data);
    }
  }

  onReceiveMessage(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('receiveMessage', callback);
    }
  }

  onTyping(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on("typing", callback);
    }
  }

  emitTyping(sessionId: string) {
    if (this.socket) {
      this.socket.emit('typing', { sessionId });
    }
  }

  onStopTyping(callback: (data: any) => void) {
    if (this.socket) {
      console.log("reached frontend")
      this.socket.on("stopTyping", callback);
    }
  }

  emitStopTyping(sessionId: string) {
    if (this.socket) {
      this.socket.emit('stopTyping', { sessionId });
    }
  }

  deleteMessage(data: { messageId: string; sessionId: string }) {
  if (this.socket) {
    this.socket.emit("deleteMessage", data);
  }
  }

  onMessageDeleted(callback: (data: { messageId: string }) => void) {
    if (this.socket) {
      this.socket.on("messageDeleted", callback);
    }
  }

  onMessageRead(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('messageRead', callback);
    }
  }

  emitMessageRead(sessionId: string, user: any) {
    if (this.socket) {
      this.socket.emit('messageRead', { sessionId, user });
    }
  }

   onNotification(callback: () => void) {
    this.socket?.on("newNotification", callback);
  }

  // Clean up listeners
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }
}

export const socketService = new SocketService();
export default socketService;