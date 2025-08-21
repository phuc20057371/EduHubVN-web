import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import WebSocketService from '../services/WebSocketService';
import type { UserProfile } from '../types/UserProfile';

// Global WebSocket manager để tránh reconnect không cần thiết
class GlobalWebSocketManager {
  private static instance: GlobalWebSocketManager;
  private isInitialized = false;
  private currentUserProfile: UserProfile | null = null;

  static getInstance(): GlobalWebSocketManager {
    if (!GlobalWebSocketManager.instance) {
      GlobalWebSocketManager.instance = new GlobalWebSocketManager();
    }
    return GlobalWebSocketManager.instance;
  }

  initializeConnection(userProfile: UserProfile) {
    if (this.isInitialized && this.currentUserProfile?.id === userProfile.id) {
      console.log("✅ WebSocket already initialized for this user");
      return;
    }

    console.log("🚀 Initializing WebSocket connection for user:", userProfile.id);
    
    WebSocketService.connect(
      userProfile,
      () => {
        console.log("✅ Global WebSocket connected");
        this.isInitialized = true;
        this.currentUserProfile = userProfile;
      },
      (message) => {
        console.log("📨 Global WebSocket received message:", message);
        // Có thể dispatch event hoặc update global state ở đây
        window.dispatchEvent(new CustomEvent('websocket-message', { detail: message }));
      }
    );
  }

  disconnect() {
    console.log("🔌 Disconnecting global WebSocket");
    WebSocketService.disconnect();
    this.isInitialized = false;
    this.currentUserProfile = null;
  }

  sendMessage(destination: string, body: string) {
    WebSocketService.send(destination, body);
  }

  isConnected(): boolean {
    return this.isInitialized && WebSocketService.isConnected();
  }
}

export const useGlobalWebSocket = () => {
  const userProfile = useSelector((state: { userProfile: UserProfile }) => state.userProfile);
  const managerRef = useRef(GlobalWebSocketManager.getInstance());

  useEffect(() => {
    if (userProfile) {
      managerRef.current.initializeConnection(userProfile);
    }
  }, [userProfile?.id]); // Chỉ phụ thuộc vào user ID

  return {
    sendMessage: (destination: string, body: string) => managerRef.current.sendMessage(destination, body),
    disconnect: () => managerRef.current.disconnect(),
    isConnected: () => managerRef.current.isConnected(),
  };
};
