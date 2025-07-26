const mongoose = require("mongoose");

const bugSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Bug title is required"],
    trim: true,
    maxLength: [100, "Title cannot exceed 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Bug description is required"],
    trim: true,
    maxLength: [1000, "Description cannot exceed 1000 characters"],
  },
  status: {
    type: String,
    enum: ["open", "in-progress", "resolved"],
    default: "open",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "critical"],
    default: "medium",
  },
  reporter: {
    type: String,
    required: [true, "Reporter name is required"],
    trim: true,
  },
  assignee: {
    type: String,
    trim: true,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
bugSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Bug", bugSchema);
