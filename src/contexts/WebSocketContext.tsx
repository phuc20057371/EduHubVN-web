import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import WebSocketService from '../services/WebSocketService';
import type { UserProfile } from '../types/UserProfile';

interface WebSocketContextType {
  isConnected: boolean;
  sendMessage: (destination: string, body: string) => void;
  disconnect: () => void;
  messages: string[];
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const userProfile = useSelector((state: { userProfile: UserProfile }) => state.userProfile);

  useEffect(() => {
    if (userProfile) {
      WebSocketService.connect(
        userProfile,
        () => {
          console.log("✅ WebSocket connected via Provider");
          setIsConnected(true);
        },
        (message: string) => {
          console.log("📨 Received message via Provider:", message);
          setMessages(prev => [...prev, message]);
        }
      );
    }

    return () => {
      WebSocketService.disconnect();
      setIsConnected(false);
    };
  }, [userProfile]);

  const sendMessage = (destination: string, body: string) => {
    WebSocketService.send(destination, body);
  };

  const disconnect = () => {
    WebSocketService.disconnect();
    setIsConnected(false);
  };

  const value: WebSocketContextType = {
    isConnected,
    sendMessage,
    disconnect,
    messages,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
};
