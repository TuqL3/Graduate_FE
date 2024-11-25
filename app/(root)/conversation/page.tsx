'use client';

import { newRequest } from '@/lib/newRequest';
import { useAppSelector } from '@/lib/redux/hooks';
import { useState, useEffect, useRef } from 'react';
import { formatDistance } from 'date-fns';
import { toast } from 'react-hot-toast';
import { useWebSocket } from '@/utils/websocket';
import { Conversation, Message } from '@/utils';

export default function Chat() {
  const user = useAppSelector((state: any) => state.auth.user);
  const currentUserId = user.id;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages: wsMessages, sendMessage, isConnected } = useWebSocket(currentUserId);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [conversationMessages, setConversationMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const pendingMessagesRef = useRef<Set<string>>(new Set());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationMessages]);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    if (wsMessages.length > 0) {
      const lastMessage = wsMessages[wsMessages.length - 1];
      
      const messageKey = `${lastMessage.sender_id}-${lastMessage.created_at}`;
      const isPendingMessage = pendingMessagesRef.current.has(messageKey);
      
      if (lastMessage.conversation_id === selectedConversation?.id) {
        setConversationMessages((prevMessages) => {
          const messageExists = prevMessages.some(
            (msg) => 
              msg.created_at === lastMessage.created_at && 
              msg.sender_id === lastMessage.sender_id
          );
          
          if (!messageExists) {
            if (isPendingMessage) {
              pendingMessagesRef.current.delete(messageKey);
            }
            updateConversationWithLatestMessage(lastMessage);
            return [...prevMessages, lastMessage];
          }
          return prevMessages;
        });
      } else {
        updateConversationWithLatestMessage(lastMessage);
      }
    }
  }, [wsMessages, selectedConversation?.id]);

  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      const response = await newRequest.get('/api/v1/conversation/');
      const data: Conversation[] = response.data.data;

      const filteredConversations = data
        .filter((conv) => conv.sender_id === currentUserId || conv.receiver_id === currentUserId)
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

      setConversations(filteredConversations);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (conversationId: number) => {
    try {
      setIsLoading(true);
      const response = await newRequest.get(`/api/v1/message/${conversationId}`);
      const data = response.data.data;
      setConversationMessages(data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  const updateConversationWithLatestMessage = (message: Message) => {
    setConversations((prevConversations) => 
      prevConversations.map((conv) => {
        if (conv.id === message.conversation_id) {
          return {
            ...conv,
            last_message: message.content,
            updated_at: message.created_at
          };
        }
        return conv;
      })
    );
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      conversation_id: selectedConversation.id,
      sender_id: currentUserId,
      receiver_id:
        selectedConversation.sender_id === currentUserId
          ? selectedConversation.receiver_id
          : selectedConversation.sender_id,
      content: newMessage.trim(),
      created_at: new Date().toISOString(),
    };

    try {
      const messageKey = `${message.sender_id}-${message.created_at}`;
      pendingMessagesRef.current.add(messageKey);
      
      setConversationMessages((prev) => [...prev, message]);
      setNewMessage('');
      
      sendMessage(message);

      await newRequest.post('/api/v1/message/', message);
      
      updateConversationWithLatestMessage(message);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
      
      const messageKey = `${message.sender_id}-${message.created_at}`;
      pendingMessagesRef.current.delete(messageKey);
      setConversationMessages((prev) => 
        prev.filter(msg => msg.created_at !== message.created_at)
      );
    }
  };

  const getOtherUser = (conversation: Conversation) => {
    return conversation.sender_id === currentUserId ? conversation.receiver : conversation.sender;
  };

  const formatMessageTime = (timestamp: string) => {
    return formatDistance(new Date(timestamp), new Date(), { addSuffix: true });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 bg-white border-r overflow-y-auto">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Messages</h2>
          {isLoading && conversations.length === 0 ? (
            <div className="text-center text-gray-500">Loading conversations...</div>
          ) : (
            <div className="space-y-2">
              {conversations.map((conv) => {
                const otherUser = getOtherUser(conv);
                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`w-full p-3 text-left rounded hover:bg-gray-100 transition-colors ${
                      selectedConversation?.id === conv.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="font-medium">{otherUser.full_name}</div>
                    {conv.last_message && (
                      <div className="text-sm text-gray-500 truncate">
                        {conv.last_message}
                      </div>
                    )}
                    <div className="text-xs text-gray-400 mt-1">
                      {formatMessageTime(conv.updated_at)}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="p-4 bg-white border-b flex items-center justify-between">
              <h3 className="font-bold">
                {getOtherUser(selectedConversation).full_name}
              </h3>
              {!isConnected && (
                <span className="text-sm text-red-500">Disconnected</span>
              )}
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
              {isLoading ? (
                <div className="text-center text-gray-500">Loading messages...</div>
              ) : (
                conversationMessages.map((message, index) => (
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
                      <div>{message.content}</div>
                      <div 
                        className={`text-xs mt-1 ${
                          message.sender_id === currentUserId
                            ? 'text-blue-100'
                            : 'text-gray-500'
                        }`}
                      >
                        {formatMessageTime(message.created_at)}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
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
                  className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type a message..."
                  disabled={!isConnected}
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-gray-400"
                  disabled={!isConnected || !newMessage.trim()}
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