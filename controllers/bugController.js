const Bug = require("../models/Bug");
const { sanitizeBugData } = require("../utils/validation");

// @desc    Get all bugs
// @route   GET /api/bugs
// @access  Public
const getBugs = async (req, res, next) => {
  try {
    console.log("Fetching all bugs...");

    const {
      status,
      priority,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    // Build query object
    const query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;

    // Build sort object
    const sortOrder = order === "asc" ? 1 : -1;
    const sortObj = { [sortBy]: sortOrder };

    const bugs = await Bug.find(query).sort(sortObj);

    console.log(`Found ${bugs.length} bugs`);

    res.status(200).json({
      success: true,
      count: bugs.length,
      data: bugs,
    });
  } catch (error) {
    console.error("Error in getBugs:", error);
    next(error);
  }
};

// @desc    Get single bug
// @route   GET /api/bugs/:id
// @access  Public
const getBug = async (req, res, next) => {
  try {
    console.log(`Fetching bug with ID: ${req.params.id}`);

    const bug = await Bug.findById(req.params.id);

    if (!bug) {
      return res.status(404).json({
        success: false,
        message: "Bug not found",
      });
    }

    console.log(`Bug found: ${bug.title}`);

    res.status(200).json({
      success: true,
      data: bug,
    });
  } catch (error) {
    console.error("Error in getBug:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid bug ID format",
      });
    }
    next(error);
  }
};

// @desc    Create new bug
// @route   POST /api/bugs
// @access  Public
const createBug = async (req, res, next) => {
  try {
    console.log("Creating new bug:", req.body);

    const sanitizedData = sanitizeBugData(req.body);
    const bug = await Bug.create(sanitizedData);

    console.log(`Bug created with ID: ${bug._id}`);

    res.status(201).json({
      success: true,
      data: bug,
    });
  } catch (error) {
    console.error("Error in createBug:", error);
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors)
        .map((err) => err.message)
        .join(", ");
      return res.status(400).json({
        success: false,
        message: `Validation Error: ${message}`,
      });
    }
    next(error);
  }
};

// @desc    Update bug
// @route   PUT /api/bugs/:id
// @access  Public
const updateBug = async (req, res, next) => {
  try {
    console.log(`Updating bug with ID: ${req.params.id}`, req.body);

    const sanitizedData = sanitizeBugData(req.body);

    const bug = await Bug.findByIdAndUpdate(req.params.id, sanitizedData, {
      new: true,
      runValidators: true,
    });

    if (!bug) {
      return res.status(404).json({
        success: false,
        message: "Bug not found",
      });
    }

    console.log(`Bug updated: ${bug.title}`);

    res.status(200).json({
      success: true,
      data: bug,
    });
  } catch (error) {
    console.error("Error in updateBug:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid bug ID format",
      });
    }
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors)
        .map((err) => err.message)
        .join(", ");
      return res.status(400).json({
        success: false,
        message: `Validation Error: ${message}`,
      });
    }
    next(error);
  }
};

// @desc    Delete bug
// @route   DELETE /api/bugs/:id
// @access  Public
const deleteBug = async (req, res, next) => {
  try {
    console.log(`Deleting bug with ID: ${req.params.id}`);

    const bug = await Bug.findByIdAndDelete(req.params.id);

    if (!bug) {
      return res.status(404).json({
        success: false,
        message: "Bug not found",
      });
    }

    console.log(`Bug deleted: ${bug.title}`);

    res.status(200).json({
      success: true,
      message: "Bug deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteBug:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid bug ID format",
      });
    }
    next(error);
  }
};

module.exports = {
  getBugs,
  getBug,
  createBug,
  updateBug,
  deleteBug,
};
