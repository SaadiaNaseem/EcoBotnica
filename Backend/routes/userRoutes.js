// backend/routes/userRoutes.js
import express from 'express';
import { loginUser, registerUser, adminLogin } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import User from '../models/userModel.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin', adminLogin);

// Return logged-in user (use protect middleware which sets req.user)
router.get('/me', protect, async (req, res) => {
  try {
    // protect sets req.user and req.userId
    const userDoc = req.user || (req.userId ? await User.findById(req.userId).select('-password') : null);
    if (!userDoc) return res.status(404).json({ success: false, message: 'User not found' });
    return res.json({ success: true, user: userDoc });
  } catch (error) {
    console.error("Error in /user/me:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
