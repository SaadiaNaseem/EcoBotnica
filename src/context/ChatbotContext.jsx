// src/context/ChatbotContext.jsx
import React, { createContext, useState } from "react";
import axios from "axios";

export const ChatbotContext = createContext();

export const ChatbotProvider = ({ children }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const resetChat = () => {
    setChatMessages([]);
  };

  const sendMessage = async (userMessage) => {
    if (!userMessage.trim()) return;

    setChatMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setLoading(true);

    try {
      const apiKey = "key here"; // Just the key, no 'Bearer'
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "openai/gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful assistant. Answer user queries clearly and concisely. Avoid long paragraphs. Stay relevant to the user’s question."
            },
            { role: "user", content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 200
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`
          }
        }
      );

      const botReply = response.data.choices[0].message.content;
      setChatMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (err) {
      console.error("Error calling OpenAI API:", err);
      setChatMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Sorry, something went wrong. Please try again." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatbotContext.Provider value={{ chatMessages, sendMessage, resetChat, loading }}>
      {children}
    </ChatbotContext.Provider>
  );
};