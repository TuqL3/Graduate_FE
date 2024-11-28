import { useAppSelector } from '@/lib/redux/hooks';
import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

export interface Message {
  content: string;
  sender: string;
}

interface WebSocketContextType {
  messages: Message[];
  sendMessage: (message: Message) => void;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const token = useAppSelector((state: any) => state.auth.token); 
  const user = useAppSelector((state: any) => state.auth.user);


  const connectWebSocket = useCallback(() => {
    if (!token) return;

    const ws = new WebSocket(`ws://localhost:8081/ws/${user.id}`);
    
    ws.onopen = () => {
      console.log('WebSocket Connected');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        setMessages((prev) => [...prev, message]);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket Disconnected');
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, [token]);

  useEffect(() => {
    if (token) {
      connectWebSocket();
    }

    return () => {
      wsRef.current?.close();
    };
  }, [connectWebSocket, token]);

  const sendMessage = useCallback((message: Message) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }, []);

  return (
    <WebSocketContext.Provider value={{ messages, sendMessage, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
