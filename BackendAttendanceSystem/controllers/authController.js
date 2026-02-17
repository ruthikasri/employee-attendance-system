const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { name, email, password, role, employeeId, department } = req.body;

    if (!name || !email || !password || !employeeId || !department) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) return res.status(400).json({ message: "Email already registered" });

    const employeeExists = await User.findOne({ employeeId });
    if (employeeExists) return res.status(400).json({ message: "Employee ID already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "employee",
      employeeId,
      department,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign(
      { id: user._id, role: user.role, employeeId: user.employeeId },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const User = require("../models/User");

    const user = await User.findById(req.user.id).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

module.exports = { register, login, getMe };

