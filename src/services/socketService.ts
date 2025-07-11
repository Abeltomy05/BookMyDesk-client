import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private _userId: string | null = null;
  private _userType: 'client' | 'vendor' | null = null;

  connect(userId: string, userType: 'client' | 'vendor') {
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
  joinRoom(roomId: string) {
    if (this.socket) {
      this.socket.emit('joinRoom', roomId);
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

  onTyping(callback: (user: any) => void) {
    if (this.socket) {
      this.socket.on('typing', callback);
    }
  }

  emitTyping(roomId: string, user: any) {
    if (this.socket) {
      this.socket.emit('typing', roomId, user);
    }
  }

  onMessageRead(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('messageRead', callback);
    }
  }

  emitMessageRead(roomId: string, user: any) {
    if (this.socket) {
      this.socket.emit('messageRead', { roomId, user });
    }
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