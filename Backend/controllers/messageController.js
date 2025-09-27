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
// export const postMessage = async (req, res) => {
//   try {
//     const { text, image,userName } = req.body;
//     if (!text) {
//       return res.status(400).json({ error: "Message text is required" });
//     }

//    const newMessage = new Message({
//       user: userName || "Anonymous",
//       text,
//       image,
//     });
//     await newMessage.save();

//     // Broadcast via socket.io if available
//     if (req.io) {
//       req.io.emit("newMessage", newMessage);
//     }

//     res.json({ success: true, message: newMessage });
//   } catch (error) {
//     console.error("❌ Error sending message:", error.message);
//     res.status(500).json({ error: "Failed to send message" });
//   }
// };

export const postMessage = async (req, res) => {
  try {
    console.log("📩 Incoming request body:", req.body);

    const { text, image, userName } = req.body;
    if (!text) {
      console.log("⚠️ No text provided in request");
      return res.status(400).json({ error: "Message text is required" });
    }

    console.log("👤 Extracted userName:", userName);

    const newMessage = new Message({
      user: userName || "Anonymous",
      text,
      image,
    });

    console.log("🆕 New message object before save:", newMessage);

    await newMessage.save();
    console.log("✅ Message saved successfully:", newMessage);

    // Broadcast via socket.io if available
    if (req.io) {
      console.log("📡 Emitting socket event: newMessage");
      req.io.emit("newMessage", newMessage);
    } else {
      console.log("⚠️ req.io not found, socket not emitting");
    }
console.log("✅ Message saved, sending response:", newMessage);
// res.json({ success: true, message: newMessage });

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
