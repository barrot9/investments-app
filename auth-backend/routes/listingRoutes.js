const express = require("express");
const { Pool } = require("pg");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// ✅ Auth middleware with logging
const verifyToken = (req, res, next) => {
  const token = req.cookies?.jwt;

  if (!token) {
    console.log("🚫 No JWT token found in cookies");
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("🔐 JWT user:", req.user);
    next();
  } catch (err) {
    console.log("🚫 Invalid JWT");
    return res.status(403).json({ message: "Invalid token" });
  }
};

// ✅ Create a new listing
router.post("/", verifyToken, async (req, res) => {
  const { title, description, price } = req.body;

  if (!title || !description || !price) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO listings (title, description, price, user_id) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, description, price, req.user.id]
    );

    res.status(201).json({ message: "Listing created", listing: result.rows[0] });
  } catch (error) {
    console.error("❌ Error creating listing:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Fetch all listings (public)
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT listings.*, users.username, users.email, users.avatar 
       FROM listings
       JOIN users ON listings.user_id = users.id
       ORDER BY listings.created_at DESC`
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching listings:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get one listing by ID
router.get("/:id", async (req, res) => {
  const listingId = req.params.id;

  try {
    const result = await pool.query(
      `SELECT listings.*, users.username, users.email, users.avatar
       FROM listings
       JOIN users ON listings.user_id = users.id
       WHERE listings.id = $1`,
      [listingId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error fetching listing:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Delete a listing
router.delete("/:id", verifyToken, async (req, res) => {
  const listingId = req.params.id;

  try {
    console.log("📝 Attempting to delete listing:", listingId, "by user:", req.user.id);

    const ownerCheck = await pool.query(
      "SELECT * FROM listings WHERE id = $1 AND user_id = $2",
      [listingId, req.user.id]
    );

    console.log("🔎 Owner check result:", ownerCheck.rows);

    if (ownerCheck.rows.length === 0) {
      return res.status(403).json({ message: "Forbidden - Not your listing" });
    }

    await pool.query("DELETE FROM listings WHERE id = $1", [listingId]);
    res.json({ message: "Listing deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting listing:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update a listing
router.put("/:id", verifyToken, async (req, res) => {
  const listingId = req.params.id;
  const { title, description, price } = req.body;

  try {
    console.log("📝 Attempting to update listing:", listingId, "by user:", req.user.id);

    const ownerCheck = await pool.query(
      "SELECT * FROM listings WHERE id = $1 AND user_id = $2",
      [listingId, req.user.id]
    );

    console.log("🔎 Owner check result:", ownerCheck.rows);

    if (ownerCheck.rows.length === 0) {
      return res.status(403).json({ message: "Forbidden - Not your listing" });
    }

    const result = await pool.query(
      `UPDATE listings 
       SET title = $1, description = $2, price = $3 
       WHERE id = $4 
       RETURNING *`,
      [title, description, price, listingId]
    );

    console.log("✅ Listing updated:", result.rows[0]);
    res.json({ message: "Listing updated", listing: result.rows[0] });
  } catch (error) {
    console.error("❌ Error updating listing:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
