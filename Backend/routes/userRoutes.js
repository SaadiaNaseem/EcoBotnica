// routes/userRoutes.js (yeh use karo)
import express from 'express';
import { 
  loginUser, 
  registerUser, 
  adminLogin, 
  forgotPassword, 
  verifyOTP, 
  resetPassword 
} from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import userModel from '../models/userModel.js';

const userRouter = express.Router();

// Auth routes
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);

// Password reset routes
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/verify-otp', verifyOTP);
userRouter.post('/reset-password', resetPassword);

// Profile route (jo dusri file mein tha)
userRouter.get('/me', authMiddleware, async (req, res) => {
  try {
    const userDoc = await userModel.findById(req.user.id).select('-password');
    if (!userDoc) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.json({ success: true, user: userDoc });
  } catch (error) {
    console.error("Error in /user/me:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default userRouter;