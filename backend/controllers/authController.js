const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const JWT_SECRET = process.env.JWT_SECRET;

//const validDistricts = ["MH24", "2", "3"];
const register = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      role = "user",
      employeeId,
      districtCode,
    } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email and password are required" });
    }

    const trimmedUsername = username.trim();
    const normalizedEmail = email.trim().toLowerCase();

    // Check existing email
    const existingEmail = await User.findOne({
      email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") },
    });
    if (existingEmail) {
      return res
        .status(400)
        .json({ message: "An account with this email already exists" });
    }

    // Check existing username
    const existingUsername = await User.findOne({
      username: { $regex: new RegExp(`^${trimmedUsername}$`, "i") },
    });
    if (existingUsername) {
      return res.status(400).json({
        message: `Username "${trimmedUsername}" is already taken. Please choose another username.`,
      });
    }

    // Validate admin registration
    if (role === "admin") {
      if (!employeeId || !districtCode) {
        return res.status(400).json({
          message: "Employee ID and district code are required for admins",
        });
      }

      // Validate government email
      if (!normalizedEmail.endsWith("@gov.in") && !normalizedEmail.endsWith("@nic.in")) {
        return res.status(403).json({
          message: "Only official government emails allowed for admins (@gov.in or @nic.in)",
        });
      }

      // Check if admin already exists for this district
      const trimmedDistrict = districtCode.trim();
      const existingAdmin = await User.findOne({ role: "admin", districtCode: trimmedDistrict });
      if (existingAdmin) {
        return res.status(400).json({
          message: `Admin already exists for district ${trimmedDistrict}`,
        });
      }
    }

    // Create new user
    const newUser = new User({
      username: trimmedUsername,
      email: normalizedEmail,
      password,
      role,
      ...(role === "admin" && {
        employeeId: employeeId.trim(),
        districtCode: districtCode.trim(),
      }),
    });

    await newUser.save();

    // Generate token using id (not userId)
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        districtCode: newUser.districtCode || null,
      },
      details: newUser,
    });
  } catch (error) {
    console.error("Registration error:", error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || "field";
      return res.status(400).json({
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} is already taken. Please choose another.`,
        error: error.message,
      });
    }
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({
      email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") },
    }).select("+password");

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });

      res.status(200).json({
        message: "User logged in successfully",
        token,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          districtCode: user.districtCode || null,
        },
        details: user,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
};
