"use client"
import React, { useState } from "react";
import { FiSend } from "react-icons/fi";
import { BsCircleFill } from "react-icons/bs";
import { format } from "date-fns";

const ChatInterface = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const dummyUsers = [
    {
      id: 1,
      name: "John Doe",
      image: "images.unsplash.com/photo-1633332755192-727a05c4013d",
      status: "online",
      lastSeen: "2 mins ago"
    },
    {
      id: 2,
      name: "Jane Smith",
      image: "images.unsplash.com/photo-1494790108377-be9c29b29330",
      status: "offline",
      lastSeen: "1 hour ago"
    },
    {
      id: 3,
      name: "Mike Johnson",
      image: "images.unsplash.com/photo-1599566150163-29194dcaad36",
      status: "online",
      lastSeen: "just now"
    }
  ];

  const dummyMessages = [
    {
      id: 1,
      senderId: 1,
      receiverId: 2,
      text: "Hey, how are you?",
      timestamp: new Date(2024, 0, 1, 14, 30)
    },
    {
      id: 2,
      senderId: 2,
      receiverId: 1,
      text: "I'm good, thanks! How about you?",
      timestamp: new Date(2024, 0, 1, 14, 32)
    }
  ];

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setError("");
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError("Message cannot be empty");
      return;
    }
    setMessage("");
    setError("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* User Selection Sidebar */}
      <div className="w-1/4 bg-white rounded-l-lg shadow-lg overflow-hidden">
        <div className="p-4 bg-indigo-600">
          <h2 className="text-white text-xl font-semibold">Contacts</h2>
        </div>
        <div className="overflow-y-auto h-[calc(100%-4rem)]">
          {dummyUsers.map((user) => (
            <button
              key={user.id}
              onClick={() => handleUserSelect(user)}
              className={`w-full p-4 flex items-center space-x-4 hover:bg-gray-50 transition-colors duration-200 ${
                selectedUser?.id === user.id ? "bg-gray-100" : ""
              }`}
              aria-label={`Chat with ${user.name}`}
            >
              <div className="relative">
                <img
                  src={`https://${user.image}`}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1633332755192-727a05c4013d";
                  }}
                />
                <BsCircleFill
                  className={`absolute bottom-0 right-0 text-${
                    user.status === "online" ? "green" : "gray"
                  }-500`}
                  size={12}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.lastSeen}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white rounded-r-lg shadow-lg flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center space-x-4">
              <img
                src={`https://${selectedUser.image}`}
                alt={selectedUser.name}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1633332755192-727a05c4013d";
                }}
              />
              <div>
                <h2 className="font-semibold text-gray-800">
                  {selectedUser.name}
                </h2>
                <p className="text-sm text-gray-500">{selectedUser.status}</p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {dummyMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.senderId === 1 ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      msg.senderId === 1
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.senderId === 1 ? "text-indigo-200" : "text-gray-500"
                      }`}
                    >
                      {format(msg.timestamp, "HH:mm")}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center space-x-2 text-gray-500">
                  <span className="text-sm">Typing</span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t bg-white"
            >
              <div className="relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className={`w-full p-3 pr-12 rounded-lg border ${
                    error ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:border-indigo-500 resize-none`}
                  rows="1"
                  aria-label="Message input"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
                  aria-label="Send message"
                >
                  <FiSend size={20} />
                </button>
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-500" role="alert">
                  {error}
                </p>
              )}
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <p>Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;