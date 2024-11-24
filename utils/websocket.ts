import { useState, useEffect, useCallback } from 'react';

export function useWebSocket(userId: number) {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const websocket = new WebSocket(`ws://localhost:8081/ws/${userId}`);
    setWs(websocket);

    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => [...prev, message]);
    };

    return () => {
      websocket.close();
    };
  }, [userId]);

  const sendMessage = useCallback(
    (message: Message) => {
      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      }
    },
    [ws],
  );

  return { messages, sendMessage };
}
