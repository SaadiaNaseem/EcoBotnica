import React, { useState } from "react";
import { Send } from "lucide-react";

const ChatbotPanel = ({ chatMessages, setChatMessages }) => {
  const [chatInput, setChatInput] = useState("");

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userMessage = { sender: "user", text: chatInput };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { sender: "bot", text: `Bot reply to: ${userMessage.text}` },
      ]);
    }, 500);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md w-full">
      <h2 className="text-xl font-semibold text-green-800 mb-4">Chatbot</h2>
      <div className="h-96 overflow-y-auto bg-[#f0f0f0] p-4 rounded-md mb-2 space-y-2">
        {chatMessages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-md max-w-[80%] ${
              msg.sender === "user"
                ? "bg-green-700 text-white ml-auto"
                : "bg-gray-300 text-black border-l-4 border-green-700"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="w-full max-w-full flex">
        <input
          type="text"
          placeholder="Type your message..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          className="flex-grow p-2 border border-r-0 rounded-l-md min-w-0"
        />
        <button
          onClick={handleSendMessage}
          className="bg-green-700 hover:bg-green-800 text-white px-4 rounded-r-md shrink-0"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatbotPanel;
