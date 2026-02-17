const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded;

      next();
    } catch (error) {
      return res.status(401).json({ message: "Token invalid or expired" });
    }
  } else {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
};

module.exports = authMiddleware;
