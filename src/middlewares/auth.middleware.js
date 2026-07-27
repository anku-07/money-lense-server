const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const protect = async (req, res, next) => {
  try {
    let token = null;

    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    console.log("Token:", token);

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized, no token provided",
        status: "failed",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded:", decoded);
    const user = await userModel.findById(decoded.userId).select("-password");

console.log("User:", user);

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized, user not found",
        status: "failed",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(401).json({
      message: "Unauthorized, invalid or expired token",
      status: "failed",
    });
  }
};

module.exports = { protect };
