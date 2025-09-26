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



//socketss



import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

// Routes
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRouter.js";
import orderRouter from "./routes/orderRouter.js";
import plantCareRoutes from "./routes/plantCareRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

// Models
import Report from "./models/report.js";

// App Config
const app = express();
const port = process.env.PORT || 4000;
const server = http.createServer(app);

// ✅ Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH"],
  },
});

// Attach io to every request (so controllers can use req.io)
app.use((req, res, next) => {
  req.io = io;
  next();
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
app.use("/api/plantcare", plantCareRoutes);
app.use("/api/messages", messageRoutes);

// Report route
app.post("/api/report", async (req, res) => {
  try {
    const { reportedBy, reportedUser, reason, messageText } = req.body;
    const report = new Report({ reportedBy, reportedUser, reason, messageText });
    await report.save();
    res.json({ success: true, report });
  } catch (err) {
    console.error("❌ Error submitting report:", err.message);
    res.status(500).json({ error: "Failed to submit report" });
  }
});

// Test endpoint
app.get("/", (req, res) => {
  res.send("✅ API WORKING 🚀");
});

// ✅ SOCKET.IO EVENTS
io.on("connection", (socket) => {
  console.log(`⚡ User connected: ${socket.id}`);

  // Just rebroadcast events
  socket.on("sendMessage", (msgData) => {
    io.emit("newMessage", msgData);
  });

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

// Start server
server.listen(port, () => {
  console.log(`✅ Server with Socket.IO running on PORT: ${port}`);
});
