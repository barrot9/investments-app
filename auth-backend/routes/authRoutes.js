const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const router = express.Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

/* ✅ Middleware to verify JWT from HTTP-only cookies */
const verifyToken = (req, res, next) => {
  console.log("🔍 Checking for JWT token in cookies:", req.cookies);

  if (!req.cookies || !req.cookies.jwt) {
    return res.status(401).json({ message: "Unauthorized - No token provided" });
  }

  const token = req.cookies.jwt;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `avatar_${req.user.id}_${Date.now()}${ext}`;
    cb(null, filename);
  },
});

// File filter (accept images only)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

const upload = multer({ storage, fileFilter });

/* ✅ Register Route */
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into database
    const newUser = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email",
      [username, email, hashedPassword]
    );

    res.status(201).json({
      message: "User registered successfully",
      user: newUser.rows[0],
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ✅ Login Route */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Received login request for:", email);

    const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userCheck.rows.length === 0) {
      console.log("❌ User not found:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = userCheck.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log("❌ Invalid password for:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ✅ Cookie settings updated for local dev (send from localhost:3000 to localhost:5000)
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: false,       // ✅ false for HTTP (localhost)
      sameSite: "Lax",     // ✅ allows cross-origin GETs with cookies
      maxAge: 60 * 60 * 1000,
    });

    console.log("✅ Login successful for:", email);
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ✅ Logout Route */
router.post("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ message: "Logged out successfully" });
});

/* ✅ Protected route to get user details */
router.get("/user", verifyToken, async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT id, username, email, avatar  FROM users WHERE id = $1",
      [req.user.id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const u = user.rows[0];
    if (u.avatar) {
      u.avatar = `/uploads/${u.avatar}`;
    }

    res.json(user.rows[0]);
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET /api/users/:id — Get user info by ID
router.get("/users/:id", async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const result = await pool.query(
      "SELECT id, username, email FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error fetching user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get all listings for a specific user
router.get("/users/:id/listings", async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    const result = await pool.query(
      `SELECT * FROM listings WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching user listings:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get all conversation partners for a specific user
router.get("/users/:id/conversations", async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    const result = await pool.query(
      `
      SELECT DISTINCT ON (u.id)
        u.id, u.username, u.email,
        m.content AS last_message,
        m.created_at
      FROM (
        SELECT * FROM messages 
        WHERE sender_id = $1 OR recipient_id = $1
        ORDER BY created_at DESC
      ) m
      JOIN users u
        ON u.id = CASE 
          WHEN m.sender_id = $1 THEN m.recipient_id 
          ELSE m.sender_id 
        END
      ORDER BY u.id, m.created_at DESC
      `,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching user conversations:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update user info (must match logged-in user)
router.put("/users/:id", verifyToken, async (req, res) => {
  const userId = parseInt(req.params.id);
  const { username, email } = req.body;

  if (userId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden - You can only update your own profile" });
  }

  try {
    const result = await pool.query(
      `UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING id, username, email`,
      [username, email, userId]
    );
    res.json({ message: "User updated", user: result.rows[0] });
  } catch (err) {
    console.error("❌ Error updating user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//upload avatar route
router.post("/upload-avatar", verifyToken, upload.single("avatar"), async (req, res) => {
  try {
    const avatarPath = `/uploads/${req.file.filename}`;

    await pool.query(
      "UPDATE users SET avatar_url = $1 WHERE id = $2",
      [avatarPath, req.user.id]
    );

    res.json({ message: "Avatar uploaded successfully", avatarUrl: avatarPath });
  } catch (error) {
    console.error("❌ Error uploading avatar:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ PUT /api/auth/user — Update profile
router.put("/user", verifyToken, upload.single("avatar"), async (req, res) => {
  const { username, email, password } = req.body;
  const userId = req.user.id;
  const avatar = req.file?.filename;

  try {
    // Check if user exists
    const userRes = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : userRes.rows[0].password;

    const result = await pool.query(
      `UPDATE users 
       SET username = $1, email = $2, password = $3, avatar = COALESCE($4, avatar)
       WHERE id = $5 
       RETURNING id, username, email, avatar`,
      [username, email, hashedPassword, avatar, userId]
    );

    res.json({ message: "Profile updated", user: result.rows[0] });
  } catch (err) {
    console.error("❌ Error updating profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});



/* ✅ Export the router */
module.exports = router;
