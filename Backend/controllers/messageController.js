import Message from "../models/message.js";

// ✅ Get all messages
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    console.error("❌ Error fetching messages:", error.message);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// ✅ Post a new message
export const postMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Message text is required" });
    }

    const user = req.user?.name || "Anonymous"; // fallback if no auth

    const newMessage = new Message({
      user,
      text,
      image,
    });

    await newMessage.save();

    // Broadcast via socket.io if available
    if (req.io) {
      req.io.emit("newMessage", newMessage);
    }

    res.json({ success: true, message: newMessage });
  } catch (error) {
    console.error("❌ Error sending message:", error.message);
    res.status(500).json({ error: "Failed to send message" });
  }
};

// ✅ Upvote/Downvote message
export const voteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body; // "up" or "down"

    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    if (type === "up") message.upvotes += 1;
    if (type === "down") message.downvotes += 1;

    await message.save();

    // Broadcast update
    if (req.io) {
      req.io.emit("updateMessage", message);
    }

    res.json({ success: true, message });
  } catch (error) {
    console.error("❌ Error voting message:", error.message);
    res.status(500).json({ error: "Failed to vote message" });
  }
};
