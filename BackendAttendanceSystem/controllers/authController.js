const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


/* ================= REGISTER USER ================= */
const register = async (req, res) => {
  try {

    const { name, email, password, role, employeeId, department } = req.body;

    if (!name || !email || !password || !employeeId || !department) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // check duplicate email
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // check duplicate employee ID
    const employeeExists = await User.findOne({ employeeId });
    if (employeeExists) {
      return res.status(400).json({ message: "Employee ID already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "employee",
      employeeId,
      department
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId,
        department: user.department
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



/* ================= LOGIN USER ================= */
const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // create JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        employeeId: user.employeeId
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId,
        department: user.department
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



/* ================= GET LOGGED USER ================= */
const getMe = async (req, res) => {
  try {

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};



/* ================= EXPORTS ================= */
module.exports = {
  register,
  login,
  getMe
};
