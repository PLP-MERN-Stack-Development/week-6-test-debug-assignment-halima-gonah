const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bugRoutes = require("./routes/bugRoutes");
const errorHandler = require("./middleware/errorHandler");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Debug middleware for request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/bugs", bugRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;
