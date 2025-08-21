import { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import WebSocketService from '../services/WebSocketService';
import type { UserProfile } from '../types/UserProfile';

interface UseWebSocketProps {
  onMessage?: (message: string) => void;
  onConnected?: () => void;
}

export const useWebSocket = ({ onMessage, onConnected }: UseWebSocketProps = {}) => {
  const userProfile = useSelector((state: { userProfile: UserProfile }) => state.userProfile);

  const sendMessage = useCallback((destination: string, body: string) => {
    WebSocketService.send(destination, body);
  }, []);

  const disconnect = useCallback(() => {
    WebSocketService.disconnect();
  }, []);

  useEffect(() => {
    if (userProfile) {
      WebSocketService.connect(userProfile, onConnected, onMessage);
    }

    return () => {
      WebSocketService.disconnect();
    };
  }, [userProfile, onMessage, onConnected]);

  return {
    sendMessage,
    disconnect,
    isConnected: WebSocketService['client']?.connected || false
  };
};
