import React, { useState, useRef, useEffect } from "react";
import Title from "../compononts/Title";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getUser } from "../utils/getUserId.js";
import { io } from "socket.io-client";
import { FiInfo } from "react-icons/fi"; // Info icon
import CommunityRule from "../compononts/CommunityRule.jsx"; // Dialog component

function CommunityChat() {
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [messages, setMessages] = useState([
    {
      user: "EcoBotanica Team",
      text: "Welcome to EcoBotanica Community! 🌱 Share your plant tips here.",
      upvotes: 0,
      downvotes: 0,
      timestamp: new Date().toISOString(),
      _id: "system-welcome",
    },
  ]);
  const [reportingIndex, setReportingIndex] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [rulesOpen, setRulesOpen] = useState(false); // Rules dialog state

  const chatEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const socketRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("http://localhost:4000/api/messages");
      const fetchedMessages = res.data.map((msg) => ({
        ...msg,
        timestamp: msg.timestamp || msg.createdAt || new Date().toISOString(),
      }));

      setMessages([
        {
          user: "EcoBotanica Team",
          text: "Welcome to EcoBotanica Community! 🌱 Share your plant tips here.",
          upvotes: 0,
          downvotes: 0,
          timestamp: new Date().toISOString(),
          _id: "system-welcome",
        },
        ...fetchedMessages,
      ]);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    } finally {
      setIsLoading(false);
      setTimeout(scrollToBottom, 100);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      setJoined(true);
      fetchMessages();

      socketRef.current = io("http://localhost:4000");

      socketRef.current.on("connect", () => {
        socketRef.current.emit("joinChat");
      });

      socketRef.current.on("newMessage", (newMsg) => {
        setMessages((prev) => [...prev, newMsg]);
        setTimeout(scrollToBottom, 50);
      });

      socketRef.current.on("updateMessage", (updatedMsg) => {
        setMessages((prev) =>
          prev.map((msg) => (msg._id === updatedMsg._id ? updatedMsg : msg))
        );
      });

      return () => {
        if (socketRef.current) socketRef.current.disconnect();
      };
    }
  }, [navigate]);

  useEffect(() => {
    if (!isLoading) scrollToBottom();
  }, [isLoading, messages]);

  const handleSend = async () => {
    if (!message.trim() && !image) return;

    const user = getUser();
    if (!user) return navigate("/login");

    const messageData = {
      text: message,
      userId: user._id,
      userName: user.name,
      image: image,
      timestamp: new Date().toISOString(),
    };

    try {
      await axios.post("http://localhost:4000/api/messages", messageData);
      setMessage("");
      setImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Failed to send message. Please try again.");
    }
  };

  const handleVote = async (index, type) => {
    const msg = messages[index];
    if (!msg._id || msg._id === "system-welcome") return;

    try {
      await axios.patch(
        `http://localhost:4000/api/messages/${msg._id}/vote`,
        { type }
      );
    } catch (err) {
      console.error("Failed to vote", err);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleReportSubmit = async (index) => {
    if (!reportReason) {
      alert("Please select a reason to report.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const msg = messages[index];
    const reasonToSave = reportReason === "other" ? customReason : reportReason;

    try {
      await axios.post(
        "http://localhost:4000/api/report",
        {
          reportedUser: msg.user,
          reason: reasonToSave,
          messageText: msg.text,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Report submitted successfully!");
    } catch (err) {
      console.error("Failed to submit report", err);
      alert("Failed to submit report. Please try again.");
    }

    setReportingIndex(null);
    setReportReason("");
    setCustomReason("");
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "Now";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (!joined) return null;

  return (
    <div className="w-full min-h-screen pt-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-2xl mb-4 bg">
          <Title text1="COMMUNITY" text2="CHAT" />
        </div>

        <div className="flex flex-col h-[80vh] bg-white rounded-xl shadow-lg border border-green-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-300 to-green-600 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-white text-lg">🌿</span>
                <h1 className="text-white font-semibold">Community Chat</h1>
              </div>
              <div className="flex items-center space-x-2 bg-green-100 px-2 py-1 rounded">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-700 text-xs">{messages.length} messages</span>
                <FiInfo
                  className="ml-2 text-green-700 cursor-pointer hover:text-green-900"
                  onClick={() => setRulesOpen(true)}
                  title="See Rules"
                />
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto bg-green-50 p-3 space-y-2"
          >
            {isLoading
              ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isCurrentUser = msg.user === getUser()?.name;
                  const isSystem = msg.user === "EcoBotanica Team";

                  return (
                    <div
                      key={msg._id || index}
                      className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[90%] rounded-lg p-3 ${
                          isSystem
                            ? "bg-yellow-100 border border-yellow-200"
                            : isCurrentUser
                              ? "bg-green-400 text-white"
                              : "bg-white border border-green-200"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`text-xs font-semibold ${
                              isSystem
                                ? "text-yellow-700"
                                : isCurrentUser
                                  ? "text-green-100"
                                  : "text-green-700"
                            }`}
                          >
                            {msg.user}
                          </span>
                          <span
                            className={`text-xs ${
                              isSystem
                                ? "text-yellow-600"
                                : isCurrentUser
                                  ? "text-green-100"
                                  : "text-gray-500"
                            }`}
                          >
                            {formatTime(msg.timestamp)}
                          </span>
                        </div>

                        {msg.text && (
                          <p
                            className={`text-sm whitespace-pre-wrap break-words ${
                              isCurrentUser ? "text-white" : "text-gray-700"
                            }`}
                          >
                            {msg.text}
                          </p>
                        )}

                        {msg.image && (
                          <div className="mt-2">
                            <img
                              src={msg.image}
                              alt="Uploaded content"
                              className="rounded max-h-48 max-w-full object-contain border"
                            />
                          </div>
                        )}

                        {!isSystem && (
                          <div
                            className={`flex items-center gap-3 mt-2 text-xs ${
                              isCurrentUser ? "text-green-100" : "text-gray-500"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleVote(index, "up")}
                                className="flex items-center gap-1 hover:scale-110 transition-transform"
                              >
                                👍 <span>{msg.upvotes || 0}</span>
                              </button>
                              <button
                                onClick={() => handleVote(index, "down")}
                                className="flex items-center gap-1 hover:scale-110 transition-transform"
                              >
                                👎 <span>{msg.downvotes || 0}</span>
                              </button>
                            </div>

                            {!isCurrentUser && (
                              <button
                                onClick={() =>
                                  setReportingIndex(reportingIndex === index ? null : index)
                                }
                                className="text-red-500 hover:text-red-600 text-xs"
                              >
                                Report
                              </button>
                            )}
                          </div>
                        )}

                        {reportingIndex === index && (
                          <div className="mt-2 p-2 bg-white rounded border border-red-200">
                            <select
                              value={reportReason}
                              onChange={(e) => setReportReason(e.target.value)}
                              className="w-full text-xs rounded px-2 py-1 border border-gray-300 mb-1"
                            >
                              <option value="">Select reason...</option>
                              <option value="spam">Spam</option>
                              <option value="abuse">Abusive Content</option>
                              <option value="misinfo">Misinformation</option>
                              <option value="other">Other</option>
                            </select>

                            {reportReason === "other" && (
                              <input
                                type="text"
                                placeholder="Specify reason..."
                                value={customReason}
                                onChange={(e) => setCustomReason(e.target.value)}
                                className="w-full text-xs rounded px-2 py-1 border border-gray-300 mb-1"
                              />
                            )}

                            <div className="flex gap-1">
                              <button
                                onClick={() => handleReportSubmit(index)}
                                className="flex-1 bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                              >
                                Submit
                              </button>
                              <button
                                onClick={() => setReportingIndex(null)}
                                className="flex-1 bg-gray-300 px-2 py-1 rounded text-xs hover:bg-gray-400"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-green-200 bg-white p-3">
            {image && (
              <div className="flex items-center gap-2 p-2 bg-green-50 rounded border border-green-200 mb-2">
                <img
                  src={image}
                  alt="Preview"
                  className="h-10 w-10 object-cover rounded border"
                />
                <span className="text-green-700 text-xs flex-1">Image ready</span>
                <button
                  onClick={removeImage}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  ×
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="upload"
              />
              <label
                htmlFor="upload"
                className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-500 rounded cursor-pointer hover:bg-green-200 text-sm"
              >
                📎
              </label>

              <input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                className="flex-1 border border-green-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
              />

              <button
                onClick={handleSend}
                disabled={!message.trim() && !image}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-1"
              >
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Community Rules Dialog */}
      <CommunityRule open={rulesOpen} onClose={() => setRulesOpen(false)} />
    </div>
  );
}

export default CommunityChat;
