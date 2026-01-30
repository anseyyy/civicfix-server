const UserModel = require("../models/userModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.UserData = async (req, res) => {
  console.log("Inside UserData Issue");

  try {
    const { name, email, phone, password, address, userType } = req.body;

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      name,
      email,
      mobile: phone, // Map phone to mobile field
      password: hashedPassword,
      userType: userType || "user", // default to 'user' if not provided
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      userType: newUser.userType,
    });
  } catch (err) {
    console.error("Error creating user:", err.message);
    res.status(500).json({ error: "Failed to create user" });
  }
};

exports.loginUser = async (req, res) => {
  console.log("Inside loginUser ");
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const jwt = require("jsonwebtoken"); // Make sure to require this at the top too if not present

    // Generate JWT Token
    const token = jwt.sign({ userId: user._id, email: user.email, userType: user.userType }, process.env.JWT_SECRET || 'supersecret123');

    res.status(200).json({
      message: "Login successful",
      userType: user.userType,
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Login failed" });
  }
};

// Admin can update a user's type (e.g., promote a user to worker)
exports.updateUserType = async (req, res) => {
  try {
    const userId = req.params.id;
    const { userType } = req.body;

    const allowed = ["user", "worker", "admin"];
    if (!allowed.includes(userType)) {
      return res.status(400).json({ error: "Invalid user type" });
    }

    const updateData = { userType };
    // Clear the request flag if they are approved to worker (or admin)
    if (userType === "worker" || userType === "admin") {
      updateData.workerRequest = false;
    }

    const user = await UserModel.findByIdAndUpdate(
      userId,
      updateData,
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ success: true, userType: user.userType });
  } catch (err) {
    console.error("Update user type error:", err.message);
    res.status(500).json({ error: "Failed to update user type" });
  }
};

// Get all users (for admin view)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({}, { password: 0 }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, users });
  } catch (err) {
    console.error("Get all users error:", err.message);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

exports.requestWorker = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { workerRequest: true },
      { new: true },
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Worker request submitted successfully" });
  } catch (err) {
    console.error("Worker request error:", err.message);
    res.status(500).json({ error: "Failed to submit worker request" });
  }
};
