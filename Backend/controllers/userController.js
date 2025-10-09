// import userModel from "../models/userModel.js";
// import validator from "validator";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";

// const createToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET)
// }

// //Route for user login
// const loginUser = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         const user = await userModel.findOne({ email });
//         if (!user) {
//             return res.json({ success: false, message: "user does not exist" })
//         }
//         const isMatch = await bcrypt.compare(password, user.password);

//         if (isMatch) {
//             const token = createToken(user._id)
//             res.json({ success: true, token })
//         }
//         else {
//             res.json({ success: false, message: "invalid credentials" })
//         }
//     }
//     catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message })
//     }
// }

// //Route for user registration
// const registerUser = async (req, res) => {
//     try {
//         const { name, email, password } = req.body;
//         //checking if user already exist
//         const exists = await userModel.findOne({ email })
//         if (exists) {
//             return res.json({ success: false, message: "user already exist" })

//         }
//         //validating email and strong password
//         if (!validator.isEmail(email)) {
//             return res.json({ success: false, message: "Enter the valid Email" })
//         }
//         if (password.length < 8) {
//             return res.json({ success: false, message: "Enter a strong password" })
//         }
//         //hashing user password
//         const salt = await bcrypt.genSalt(10)
//         const hashedPassword = await bcrypt.hash(password, salt)

//         const newUser = new userModel({
//             name,
//             email,
//             password: hashedPassword
//         })

//         const user = await newUser.save()

//         const token = createToken(user._id)
//         res.json({ success: true, token })
//     }
//     catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message })
//     }
// }

// //route for admin login
// const adminLogin = async (req, res) => {
//     try {
//         const { email, password } = req.body
//         if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
//             // const token = jwt.sign(email + password, process.env.JWT_SECRET);
//             const token = jwt.sign(
//                 { email: process.env.ADMIN_EMAIL },
//                 process.env.JWT_SECRET
//             );
//             res.json({ success: true, token })
//         }
//         else {
//             res.json({ success: false, message: "invalidcredentials" })

//         }
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message })
//     }

// }

// export { loginUser, registerUser, adminLogin }

// controllers/userController.js
import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" }); // 7 din ka expiry (optional)
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

    // if (isMatch) {
    //     const token = createToken(user._id);
    //     // user password remove for security
    //     const userData = {
    //         _id: user._id,
    //         name: user.name,
    //         email: user.email,
    //     };
    //     res.json({ success: true, token, user: userData });
    // } else {
    //     res.json({ success: false, message: "Invalid credentials" });
    // }

    if (isMatch) {
      const token = createToken(user._id);
      const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
      };
    //   console.log("Sending User Data:", userData); // Debugging log
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

export { loginUser, registerUser, adminLogin };
