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
import reportRoutes from './routes/reports.js'; // Reports routes

// Models
import Report from "./models/report.js";

// App Config
const app = express();
const port = process.env.PORT || 4000;
const server = http.createServer(app);

// ✅ Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
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

// ✅ Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.originalUrl}`);
  next();
});

// API Endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/plantcare", plantCareRoutes);
app.use("/api/messages", messageRoutes);
app.use('/api/reports', reportRoutes); // Reports API

// ✅ REPORT ROUTE - WORKING VERSION
app.post("/api/report", async (req, res) => {
  try {
    const { reportedUser, reason, messageText } = req.body;
    
    console.log("📩 New report received:", { reportedUser, reason, messageText });

    // Create and save report
    const report = new Report({ 
      reportedBy: "User", // You can change this to get from token if needed
      reportedUser, 
      reason, 
      messageText 
    });
    
    const savedReport = await report.save();
    console.log("✅ Report saved successfully:", savedReport._id);

    // Send success response
    res.json({ 
      success: true, 
      message: "Report submitted successfully",
      reportId: savedReport._id
    });

  } catch (err) {
    console.error("❌ Error submitting report:", err.message);
    res.status(500).json({ error: "Failed to submit report" });
  }
});

// ✅ Get all reports (for debugging)
app.get("/api/all-reports", async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: reports.length,
      reports: reports
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Test endpoint for reports
app.get("/api/reports-test", (req, res) => {
  res.json({ 
    message: "Reports API is working! ✅",
    routes: [
      "GET /api/reports",
      "DELETE /api/reports/resolve-message/:id", 
      "DELETE /api/reports/resolve-user/:id",
      "DELETE /api/reports/:id"
    ]
  });
});

// Test endpoint
app.get("/", (req, res) => {
  res.send("✅ API WORKING 🚀");
});

// ✅ SOCKET.IO EVENTS
io.on("connection", (socket) => {
  console.log(`⚡ User connected: ${socket.id}`);

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
  console.log("🟢 Available Report Routes:");
  console.log("   GET    /api/reports");
  console.log("   DELETE /api/reports/resolve-message/:id");
  console.log("   DELETE /api/reports/resolve-user/:id"); 
  console.log("   DELETE /api/reports/:id");
  console.log("   GET    /api/reports-test (for testing)");
  console.log("   GET    /api/all-reports (for debugging)");
});