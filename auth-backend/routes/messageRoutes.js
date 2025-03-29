const express = require("express");
const { Pool } = require("pg");
const jwt = require("jsonwebtoken");

const router = express.Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// ✅ Middleware to verify JWT from cookies
const verifyToken = (req, res, next) => {
  const token = req.cookies?.jwt;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

// ✅ POST /api/messages — Send a message
router.post("/", verifyToken, async (req, res) => {
  const { recipient_id, content } = req.body;
  const sender_id = req.user.id;

  if (!recipient_id || !content) {
    return res.status(400).json({ message: "Recipient and content required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO messages (sender_id, recipient_id, content)
       VALUES ($1, $2, $3) RETURNING *`,
      [sender_id, recipient_id, content]
    );

    res.status(201).json({ message: "Message sent", messageData: result.rows[0] });
  } catch (err) {
    console.error("❌ Error sending message:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET /api/messages/:userId — Get conversation
router.get("/:userId", verifyToken, async (req, res) => {
  const userId = parseInt(req.params.userId);
  const currentUserId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT * FROM messages 
       WHERE (sender_id = $1 AND recipient_id = $2)
          OR (sender_id = $2 AND recipient_id = $1)
       ORDER BY created_at ASC`,
      [currentUserId, userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching messages:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET /api/messages - Get unique conversation partners for the logged-in user
router.get("/", verifyToken, async (req, res) => {
    const userId = req.user.id;
  
    try {
      const result = await pool.query(
        `
        SELECT DISTINCT ON (u.id) 
          u.id AS user_id, u.username, u.email,
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
      console.error("❌ Error fetching inbox:", err);
      res.status(500).json({ message: "Server error" });
    }
  });
  
module.exports = router;
