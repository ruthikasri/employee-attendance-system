// middleware/authorizeManager.js

const authorizeManager = (req, res, next) => {
  try {
    // user must be logged in first
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // allow only manager role
    if (req.user.role !== "manager") {
      return res.status(403).json({ message: "Managers only access" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Authorization error" });
  }
};

module.exports = authorizeManager;
