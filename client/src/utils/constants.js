export const BUG_STATUS = {
  OPEN: "open",
  IN_PROGRESS: "in-progress",
  RESOLVED: "resolved",
};

export const BUG_PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical",
};

export const STATUS_COLORS = {
  [BUG_STATUS.OPEN]: "#dc3545",
  [BUG_STATUS.IN_PROGRESS]: "#ffc107",
  [BUG_STATUS.RESOLVED]: "#28a745",
};

export const PRIORITY_COLORS = {
  [BUG_PRIORITY.LOW]: "#6c757d",
  [BUG_PRIORITY.MEDIUM]: "#007bff",
  [BUG_PRIORITY.HIGH]: "#fd7e14",
  [BUG_PRIORITY.CRITICAL]: "#dc3545",
};

export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";
