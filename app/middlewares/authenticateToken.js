const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      statusValue: "Bạn chưa nhập token!",
    });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        statusValue: "Mã token không hợp lệ!",
      });
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
