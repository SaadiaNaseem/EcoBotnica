import express from 'express';
import { addToCart, updateCart, getUserCart } from '../controllers/cartController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const cartRouter = express.Router();

cartRouter.post('/add', authMiddleware, addToCart);
cartRouter.post('/update', authMiddleware, updateCart);
cartRouter.post('/get', authMiddleware, getUserCart);

export default cartRouter;