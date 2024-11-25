export interface User {
  id: number;
  full_name: string;
  name: string;
}

export interface Message {
  id?: number;
  conversation_id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  created_at: string;
}

export interface Conversation {
  id: number;
  sender_id: number;
  receiver_id: number;
  sender: User;
  receiver: User;
  last_message?: string;
  created_at: string;
  updated_at: string;
}