const express = require("express");
const {
  getBugs,
  getBug,
  createBug,
  updateBug,
  deleteBug,
} = require("../controllers/bugController");

const {
  validateBugCreation,
  validateBugUpdate,
  handleValidationErrors,
} = require("../utils/validation");

const router = express.Router();

router
  .route("/")
  .get(getBugs)
  .post(validateBugCreation, handleValidationErrors, createBug);

router
  .route("/:id")
  .get(getBug)
  .put(validateBugUpdate, handleValidationErrors, updateBug)
  .delete(deleteBug);

module.exports = router;
