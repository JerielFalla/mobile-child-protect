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

// // Setup GridFS
// let gfs;
// const conn = mongoose.connection;

// conn.once("open", () => {
//   const Grid = require("gridfs-stream");
//   gfs = Grid(conn.db, mongoose.mongo);
//   gfs.collection("uploads");
// });

// // Set up storage engine
// const storage = new GridFsStorage({
//   url: process.env.MONGO_URI,
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       crypto.randomBytes(16, (err, buf) => {
//         if (err) return reject(err);
//         const filename = buf.toString("hex") + path.extname(file.originalname);
//         const fileInfo = {
//           filename: filename,
//           bucketName: "uploads", // name of the GridFS bucket
//         };
//         resolve(fileInfo);
//       });
//     });
//   },
// });

// const upload = multer({ storage });

// // Endpoint to handle image upload
// app.post("/upload", upload.single("evidence"), (req, res) => {
//   res.json({ file: req.file });
// });

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
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);

// Signup Route
app.post("/signup", async (req, res) => {
  try {
    console.log("➡️ Signup request received:", req.body);

    const { email, password } = req.body;
    if (!email || !password) {
      console.warn("⚠️ Missing email or password");
      return res.status(400).json({ error: "Missing email or password" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.warn("⚠️ User already exists:", email);
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔑 Hashed Password:", hashedPassword);

    // Create user
    const user = new User({ email, password: hashedPassword });
    await user.save();
    console.log("✅ User created successfully:", user);

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.error("❌ Error during signup:", err);
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "Invalid email or password" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Invalid email or password" });

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
