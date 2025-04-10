require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const crypto = require("crypto");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
<<<<<<< HEAD
const { StreamChat } = require("stream-chat");
=======
>>>>>>> 107d8c0f40a03b7a83a0ad82032e64828b578647

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Schema for Report
const reportSchema = new mongoose.Schema({
  abuserName: String,
  abuserGender: String,
  abuserAge: String,
  relationship: String,
  natureOfAbuse: String,
  historyOfAbuse: String,
  location: String,
  victimName: String,
  victimAge: String,
  victimGender: String,
  victimDisability: String,
  latitude: Number,
  longitude: Number,
  date: {
    type: Date,
    default: Date.now,
  },
  evidence: [
    {
      filename: String,
      base64: String,
    },
  ],
});

// Report Model
const Report = mongoose.model("Report", reportSchema);

// POST endpoint for submitting reports
app.post("/api/reports", async (req, res) => {
  try {
    const report = new Report(req.body);
    await report.save();
    res.status(201).json({ message: "Report submitted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to submit report", details: error.message });
  }
});

// User Model
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  avatar: { type: String },
});

const User = mongoose.model("User", UserSchema);

// Signup Route
app.post("/signup", async (req, res) => {
  try {
    console.log("➡️ Signup request received:", req.body);

    const { name, email, password, phone } = req.body;
    if (!email || !password) {
      console.warn("Missing email or password");
      return res.status(400).json({ error: "Missing email or password" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.warn("User already exists:", email);
      return res.status(400).json({ error: "User already exists" });
    }

    // Check if phone exists
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      console.warn("User already exists:", phone);
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password:", hashedPassword);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone: phone,
    });
    await user.save();
    console.log("User created successfully:", user);

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.error("Error during signup:", err);
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
});
<<<<<<< HEAD
// LOGIN ROUTE
=======

// Login Route
>>>>>>> 107d8c0f40a03b7a83a0ad82032e64828b578647
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

<<<<<<< HEAD
    console.log("📩 Login request:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.warn("❌ No user found");
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn("❌ Password mismatch");
      return res.status(400).json({ error: "Invalid email or password" });
    }

=======
    // Find user
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "Invalid email or password" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Invalid email or password" });

    // Create JWT token
>>>>>>> 107d8c0f40a03b7a83a0ad82032e64828b578647
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

<<<<<<< HEAD
    console.log("🔑 JWT generated");

    const streamChat = StreamChat.getInstance(
      process.env.STREAM_API_KEY,
      process.env.STREAM_API_SECRET
    );

    // Optional: create user on Stream
    await streamChat.upsertUser({
      id: user._id.toString(),
      name: user.name,
    });

    const chatToken = streamChat.createToken(user._id.toString());

    console.log("✅ Chat token created");

=======
>>>>>>> 107d8c0f40a03b7a83a0ad82032e64828b578647
    res.json({
      token,
      userId: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
<<<<<<< HEAD
      chatToken,
    });
  } catch (err) {
    console.error("🔥 Login Error:", err);
=======
    });
  } catch (err) {
>>>>>>> 107d8c0f40a03b7a83a0ad82032e64828b578647
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get User Profile
app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user data" });
  }
});

// Update Avatar
app.post("/api/users/:id/avatar", async (req, res) => {
  try {
    const { avatar } = req.body;
    await User.findByIdAndUpdate(req.params.id, { avatar });
    res.json({ message: "Avatar updated" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update avatar" });
  }
});

<<<<<<< HEAD
// Backend endpoint example
app.post("/chat/token", async (req, res) => {
  const { userId } = req.body;
  const token = StreamChat.getInstance(
    process.env.STREAM_API_KEY,
    process.env.STREAM_API_SECRET
  ).createToken(userId);
  res.json({ token });
});

=======
>>>>>>> 107d8c0f40a03b7a83a0ad82032e64828b578647
// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
