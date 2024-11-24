interface User {
    id: number;
    name: string;
  }
  
  interface Message {
    conversation_id: number;
    sender_id: number;
    receiver_id: number;
    content: string;
    created_at: string;
  }
  
  interface Conversation {
    id: number;
    sender_id: number;
    receiver_id: number;
    last_message: string;
    sender: User;
    receiver: User;
  }