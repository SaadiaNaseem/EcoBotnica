import express from 'express';
import { placeOrder, placeOrderStripe, allOrders, userOrders, updateStatus, verifyStripe } from '../controllers/orderController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import adminAuth from '../middleware/adminAuth.js'; // Keep if you have admin auth

const orderRouter = express.Router();

orderRouter.post('/place', authMiddleware, placeOrder);
orderRouter.post('/stripe', authMiddleware, placeOrderStripe);
orderRouter.post('/verifyStripe', authMiddleware, verifyStripe);
orderRouter.post('/userorders', authMiddleware, userOrders);

// Admin routes
orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);

export default orderRouter;