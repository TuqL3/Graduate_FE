'use client';

import { newRequest } from '@/lib/newRequest';
import { useAppSelector } from '@/lib/redux/hooks';
import { useWebSocket } from '@/utils/websocket';
import { useState, useEffect } from 'react';

export default function Chat() {
  const user = useAppSelector((state: any) => state.auth.user);
  const currentUserId = user.id;

  const { messages: wsMessages, sendMessage } = useWebSocket(currentUserId);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [conversationMessages, setConversationMessages] = useState<Message[]>(
    [],
  );
  const [newMessage, setNewMessage] = useState('');

  // Fetch conversations when component mounts
  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch messages when a conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  // Handle WebSocket messages for real-time updates
  useEffect(() => {
    wsMessages.forEach((message: Message) => {
      if (message.conversation_id === selectedConversation?.id) {
        setConversationMessages((prevMessages) => [...prevMessages, message]);
      }
    });
  }, [wsMessages, selectedConversation]);

  // Fetch all conversations
  const fetchConversations = async () => {
    try {
      const response = await newRequest.get('/api/v1/conversation/');
      const data: Conversation[] = response.data.data;

      // Filter conversations where the current user is either sender or receiver
      const filteredConversations = data.filter(
        (conv) =>
          conv.sender_id === currentUserId ||
          conv.receiver_id === currentUserId,
      );

      setConversations(filteredConversations);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    }
  };

  // Fetch messages for the selected conversation
  const fetchMessages = async (conversationId: number) => {
    try {
      const response = await newRequest.get(
        `/api/v1/message/${conversationId}`,
      );
      const data = await response.data.data;
      setConversationMessages(data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  // Send a new message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      conversation_id: selectedConversation.id,
      sender_id: currentUserId,
      receiver_id:
        selectedConversation.sender_id === currentUserId
          ? selectedConversation.receiver_id
          : selectedConversation.sender_id,
      content: newMessage,
      created_at: new Date().toISOString(),
    };

    sendMessage(message); // Send message via WebSocket
    setConversationMessages((prevMessages) => [...prevMessages, message]); // Update UI immediately
    setNewMessage('');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Conversation List */}
      <div className="w-1/4 bg-white border-r">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Messages</h2>
          <div className="space-y-2">
            {conversations.map((conv) => {
              const otherUser =
                conv.sender_id === currentUserId ? conv.receiver : conv.sender;
              return (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`w-full p-3 text-left rounded hover:bg-gray-100 ${
                    selectedConversation?.id === conv.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="font-medium">{otherUser.full_name}</div>
                  {conv.last_message && (
                    <div className="text-sm text-gray-500 truncate">
                      {conv.last_message}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="p-4 bg-white border-b">
              <h3 className="font-bold">
                {selectedConversation.sender_id === currentUserId
                  ? selectedConversation.receiver.name
                  : selectedConversation.sender.name}
              </h3>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
              {conversationMessages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 flex ${
                    message.sender_id === currentUserId
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.sender_id === currentUserId
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleSendMessage}
              className="p-4 bg-white border-t"
            >
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded"
                  placeholder="Type a message..."
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Send
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
