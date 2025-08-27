// import express from 'express'
// import cors from 'cors'
// import 'dotenv/config' 
// import connectDB from './config/mongodb.js'
// import connectCloudinary from './config/cloudinary.js'
// import userRouter from './routes/userRoute.js'
// import productRouter from './routes/productRoute.js'
// import cartRouter from './routes/cartRouter.js'
// import orderRouter from './routes/orderRouter.js'

// //App Config

// const app = express()
// const port = process.env.PORT || 4000
// connectDB()
// connectCloudinary()

// //Middllewares
// app.use(express.json())
// app.use(cors())

// //API endpoints 
// app.use('/api/user',userRouter)
// app.use('/api/product',productRouter)

// app.use('/api/cart',cartRouter)

// app.use('/api/order',orderRouter)

// app.get('/',(req,res)=>{
//     res.send("API WORKING")
// })

// app.listen(port, ()=> console.log('Server started on PORT :'+ port)
// )




// scokettttsssss



import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

// Existing routes
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRouter.js";
import orderRouter from "./routes/orderRouter.js";

// Community chat models
import Message from "../models/Message.js";
import Report from "../models/Report.js";

// App Config
const app = express();
const port = process.env.PORT || 4000;

// Create HTTP server for socket.io
const server = http.createServer(app);

// ✅ Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Connect DB + Cloudinary
connectDB();
connectCloudinary();

// Middlewares
app.use(express.json());
app.use(cors());

// API Endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// Community Chat REST API
app.get("/api/messages", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

app.post("/api/report", async (req, res) => {
  try {
    const { reportedBy, reportedUser, reason, messageText } = req.body;
    const report = new Report({ reportedBy, reportedUser, reason, messageText });
    await report.save();
    res.json({ success: true, report });
  } catch (err) {
    res.status(500).json({ error: "Failed to submit report" });
  }
});

// Test endpoint
app.get("/", (req, res) => {
  res.send("API WORKING 🚀");
});

// ✅ SOCKET.IO EVENTS
io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  // Send message
  socket.on("sendMessage", async (msgData) => {
    const newMsg = new Message(msgData);
    await newMsg.save();
    io.emit("newMessage", newMsg); // broadcast to all
  });

  // Handle votes
  socket.on("voteMessage", async ({ id, type }) => {
    const msg = await Message.findById(id);
    if (!msg) return;
    if (type === "up") msg.upvotes++;
    else msg.downvotes++;
    await msg.save();
    io.emit("updateMessage", msg);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// Start server
server.listen(port, () =>
  console.log(`✅ Server with Socket.IO running on PORT: ${port}`)
);
