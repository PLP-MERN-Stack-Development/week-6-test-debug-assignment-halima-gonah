const { body, validationResult } = require("express-validator");

// Validation rules for bug creation
const validateBugCreation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high", "critical"])
    .withMessage("Priority must be one of: low, medium, high, critical"),

  body("reporter")
    .trim()
    .notEmpty()
    .withMessage("Reporter name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Reporter name must be between 2 and 50 characters"),

  body("assignee")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Assignee name must be between 2 and 50 characters"),
];

// Validation rules for bug updates
const validateBugUpdate = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters"),

  body("status")
    .optional()
    .isIn(["open", "in-progress", "resolved"])
    .withMessage("Status must be one of: open, in-progress, resolved"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high", "critical"])
    .withMessage("Priority must be one of: low, medium, high, critical"),

  body("assignee")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Assignee name must be between 2 and 50 characters"),
];

// Helper function to check validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

// Utility function to sanitize bug data
const sanitizeBugData = (data) => {
  const sanitized = {};

  if (data.title) sanitized.title = data.title.trim();
  if (data.description) sanitized.description = data.description.trim();
  if (data.status) sanitized.status = data.status;
  if (data.priority) sanitized.priority = data.priority;
  if (data.reporter) sanitized.reporter = data.reporter.trim();
  if (data.assignee) sanitized.assignee = data.assignee.trim();

  return sanitized;
};

module.exports = {
  validateBugCreation,
  validateBugUpdate,
  handleValidationErrors,
  sanitizeBugData,
};
