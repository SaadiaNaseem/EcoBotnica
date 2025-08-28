import jwt from "jsonwebtoken";

const plantCareAuth = (req, res, next) => {
  try {
    let token =
      req.headers.token ||
      req.headers.authorization ||
      req.headers["x-access-token"];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized for Plant Care, please login",
      });
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trim();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decoded.id || decoded._id }; // 👈 Plant Care ke liye required

    next();
  } catch (error) {
    console.error("PlantCareAuth error:", error);
    return res.status(401).json({
      success: false,
      message: "Unauthorized access to Plant Care",
    });
  }
};

export default plantCareAuth;
