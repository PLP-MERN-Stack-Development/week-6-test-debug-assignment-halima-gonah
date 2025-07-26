import React, { useState } from "react";
import { BUG_PRIORITY } from "../utils/constants";

const BugForm = ({ onSubmit, initialData = null, isLoading = false }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    priority: initialData?.priority || BUG_PRIORITY.MEDIUM,
    reporter: initialData?.reporter || "",
    assignee: initialData?.assignee || "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    } else if (formData.title.trim().length > 100) {
      newErrors.title = "Title must not exceed 100 characters";
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    } else if (formData.description.trim().length > 1000) {
      newErrors.description = "Description must not exceed 1000 characters";
    }

    // Reporter validation
    if (!formData.reporter.trim()) {
      newErrors.reporter = "Reporter name is required";
    } else if (formData.reporter.trim().length < 2) {
      newErrors.reporter = "Reporter name must be at least 2 characters";
    }

    // Assignee validation (optional)
    if (formData.assignee && formData.assignee.trim().length < 2) {
      newErrors.assignee = "Assignee name must be at least 2 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Form submitted with data:", formData);

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      priority: BUG_PRIORITY.MEDIUM,
      reporter: "",
      assignee: "",
    });
    setErrors({});
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: "600px", margin: "0 auto" }}
    >
      <h2>{initialData ? "Update Bug" : "Report New Bug"}</h2>

      <div style={{ marginBottom: "15px" }}>
        <label
          htmlFor="title"
          style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}
        >
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "8px",
            border: errors.title ? "2px solid #dc3545" : "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "14px",
          }}
          placeholder="Enter bug title"
          disabled={isLoading}
        />
        {errors.title && (
          <span style={{ color: "#dc3545", fontSize: "12px" }}>
            {errors.title}
          </span>
        )}
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label
          htmlFor="description"
          style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}
        >
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          style={{
            width: "100%",
            padding: "8px",
            border: errors.description ? "2px solid #dc3545" : "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "14px",
            resize: "vertical",
          }}
          placeholder="Describe the bug in detail"
          disabled={isLoading}
        />
        {errors.description && (
          <span style={{ color: "#dc3545", fontSize: "12px" }}>
            {errors.description}
          </span>
        )}
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label
          htmlFor="priority"
          style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}
        >
          Priority
        </label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "14px",
          }}
          disabled={isLoading}
        >
          <option value={BUG_PRIORITY.LOW}>Low</option>
          <option value={BUG_PRIORITY.MEDIUM}>Medium</option>
          <option value={BUG_PRIORITY.HIGH}>High</option>
          <option value={BUG_PRIORITY.CRITICAL}>Critical</option>
        </select>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label
          htmlFor="reporter"
          style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}
        >
          Reporter *
        </label>
        <input
          type="text"
          id="reporter"
          name="reporter"
          value={formData.reporter}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "8px",
            border: errors.reporter ? "2px solid #dc3545" : "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "14px",
          }}
          placeholder="Your name"
          disabled={isLoading}
        />
        {errors.reporter && (
          <span style={{ color: "#dc3545", fontSize: "12px" }}>
            {errors.reporter}
          </span>
        )}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label
          htmlFor="assignee"
          style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}
        >
          Assignee
        </label>
        <input
          type="text"
          id="assignee"
          name="assignee"
          value={formData.assignee}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "8px",
            border: errors.assignee ? "2px solid #dc3545" : "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "14px",
          }}
          placeholder="Assign to (optional)"
          disabled={isLoading}
        />
        {errors.assignee && (
          <span style={{ color: "#dc3545", fontSize: "12px" }}>
            {errors.assignee}
          </span>
        )}
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: "10px 20px",
            backgroundColor: isLoading ? "#6c757d" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isLoading ? "not-allowed" : "pointer",
            fontSize: "14px",
          }}
        >
          {isLoading
            ? "Processing..."
            : initialData
            ? "Update Bug"
            : "Report Bug"}
        </button>

        {!initialData && (
          <button
            type="button"
            onClick={resetForm}
            disabled={isLoading}
            style={{
              padding: "10px 20px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: isLoading ? "not-allowed" : "pointer",
              fontSize: "14px",
            }}
          >
            Reset
          </button>
        )}
      </div>
    </form>
  );
};

export default BugForm;
