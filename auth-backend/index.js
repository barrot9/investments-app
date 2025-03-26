require("dotenv").config();
const { Pool } = require("pg");
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, // ✅ Allow cookies
};

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware setup — order matters!
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser()); // ✅ Must come BEFORE your routes

// ✅ Auth routes
app.use("/api/auth", authRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Auth Backend is Running!");
});

// ✅ Start DB + server
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("Database connection error", err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
