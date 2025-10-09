// controllers/userController.js - COMPLETE UPDATED
import userModel from "../models/userModel.js";
import OTPSchema from "../models/OTP.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// Email Configuration
let transporter;

try {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ Email credentials missing in environment variables');
    throw new Error('Email credentials not configured');
  }

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    secure: false,
    requireTLS: true,
    port: 587,
    tls: {
      rejectUnauthorized: false
    }
  });
  console.log('✅ Email transporter configured successfully');
} catch (error) {
  console.error('❌ Email configuration failed:', error.message);
  transporter = null;
}

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Route for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = createToken(user._id);
      const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
      };
      res.json({ success: true, token, user: userData });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for user registration
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // checking if user already exist
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exist" });
    }

    // validating email and strong password
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid Email" });
    }
    if (password.length < 8) {
      return res.json({ success: false, message: "Enter a strong password" });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    const token = createToken(user._id);

    // remove password from user object in response
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    res.json({ success: true, token, user: userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { email: process.env.ADMIN_EMAIL },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );
      res.json({
        success: true,
        token,
        admin: { email: process.env.ADMIN_EMAIL },
      });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Forgot Password - Send OTP
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    console.log('📧 Forgot password request for:', email);

    if (!transporter) {
      return res.json({ 
        success: false, 
        message: "Email service is temporarily unavailable." 
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    console.log('🔐 Generated OTP:', otp);

    // Save OTP to database
    const savedOTP = await OTPSchema.findOneAndUpdate(
      { email: email },
      { 
        otp: otp, 
        expiresAt: expiresAt,
        used: false 
      },
      { 
        upsert: true, 
        new: true
      }
    );

    console.log('💾 OTP saved to database');

    // Send email with OTP
    const mailOptions = {
      from: {
        name: 'Eco Botanica',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: "Password Reset OTP - Eco Botanica",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="text-align: center; background: #000; padding: 20px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Eco Botanica</h1>
          </div>
          
          <div style="padding: 20px;">
            <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
            <p>Hello,</p>
            <p>You requested to reset your password. Use the OTP below to proceed:</p>
            
            <div style="background: #f8f9fa; padding: 20px; text-align: center; margin: 25px 0; border-radius: 8px; border: 2px dashed #000;">
              <h1 style="color: #000; margin: 0; font-size: 36px; letter-spacing: 8px; font-weight: bold;">${otp}</h1>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              <strong>Important:</strong> This OTP will expire in 10 minutes.
            </p>
            
            <p>If you didn't request this, please ignore this email.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ OTP email sent successfully to:', email);

    res.json({
      success: true,
      message: "OTP sent to your email successfully",
    });

  } catch (error) {
    console.log('❌ Forgot password error:', error);
    res.json({
      success: false,
      message: "Error sending OTP. Please try again.",
    });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    console.log('🔍 Verifying OTP for:', email);

    if (!email || !otp) {
      return res.json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const otpRecord = await OTPSchema.findOne({ email: email });
    
    if (!otpRecord) {
      return res.json({
        success: false,
        message: "No OTP found. Please request a new OTP.",
      });
    }

    if (otpRecord.used) {
      return res.json({
        success: false,
        message: "OTP has already been used. Please request a new OTP.",
      });
    }

    if (new Date() > otpRecord.expiresAt) {
      return res.json({
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    if (otpRecord.otp !== otp) {
      return res.json({
        success: false,
        message: "Invalid OTP. Please check the code and try again.",
      });
    }

    // Mark OTP as used
    otpRecord.used = true;
    await otpRecord.save();
    console.log('✅ OTP verified successfully');

    res.json({
      success: true,
      message: "OTP verified successfully",
    });

  } catch (error) {
    console.log('❌ Verify OTP error:', error);
    res.json({
      success: false,
      message: "Error verifying OTP",
    });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    console.log('🔄 Reset password for:', email);

    if (!email || !newPassword) {
      return res.json({
        success: false,
        message: "Email and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res.json({ 
        success: false, 
        message: "Password must be at least 8 characters long" 
      });
    }

    // Find user - if exists update, else create new
    let user = await userModel.findOne({ email });
    
    if (user) {
      // User exists - update password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
      await user.save();
      console.log('✅ Password updated for existing user');
    } else {
      // Create new account
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      user = new userModel({
        name: email.split('@')[0],
        email: email,
        password: hashedPassword,
      });
      
      await user.save();
      console.log('✅ New user created with reset password');
    }

    // Delete OTP record
    await OTPSchema.deleteOne({ email: email });
    console.log('🗑️ OTP deleted after password reset');

    res.json({
      success: true,
      message: "Password reset successfully. You can now login with your new password.",
    });

  } catch (error) {
    console.log('❌ Reset password error:', error);
    res.json({
      success: false,
      message: "Error resetting password",
    });
  }
};

export { 
  loginUser, 
  registerUser, 
  adminLogin, 
  forgotPassword, 
  verifyOTP, 
  resetPassword 
};