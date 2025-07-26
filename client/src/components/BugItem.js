import React, { useState } from "react";
import { BUG_STATUS, STATUS_COLORS, PRIORITY_COLORS } from "../utils/constants";

const BugItem = ({ bug, onUpdate, onDelete, isLoading = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleStatusChange = async (newStatus) => {
    console.log(`Updating bug ${bug._id} status to ${newStatus}`);
    try {
      await onUpdate(bug._id, { status: newStatus });
    } catch (error) {
      console.error("Failed to update bug status:", error);
    }
  };

  const handleDelete = async () => {
    console.log(`Deleting bug ${bug._id}`);
    try {
      await onDelete(bug._id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Failed to delete bug:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => (
    <span
      style={{
        padding: "4px 8px",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: "bold",
        color: "white",
        backgroundColor: STATUS_COLORS[status],
        textTransform: "uppercase",
      }}
    >
      {status.replace("-", " ")}
    </span>
  );

  const getPriorityBadge = (priority) => (
    <span
      style={{
        padding: "4px 8px",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: "bold",
        color: "white",
        backgroundColor: PRIORITY_COLORS[priority],
        textTransform: "uppercase",
      }}
    >
      {priority}
    </span>
  );

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "12px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
      data-testid={`bug-item-${bug._id}`}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "12px",
        }}
      >
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: "0 0 8px 0", color: "#333" }}>{bug.title}</h3>
          <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
            {getStatusBadge(bug.status)}
            {getPriorityBadge(bug.priority)}
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => setIsEditing(!isEditing)}
            disabled={isLoading}
            style={{
              padding: "6px 12px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: isLoading ? "not-allowed" : "pointer",
              fontSize: "12px",
            }}
            data-testid={`edit-button-${bug._id}`}
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isLoading}
            style={{
              padding: "6px 12px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: isLoading ? "not-allowed" : "pointer",
              fontSize: "12px",
            }}
            data-testid={`delete-button-${bug._id}`}
          >
            Delete
          </button>
        </div>
      </div>

      <p style={{ margin: "0 0 12px 0", color: "#666", lineHeight: "1.4" }}>
        {bug.description}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "8px",
          fontSize: "14px",
          color: "#666",
        }}
      >
        <div>
          <strong>Reporter:</strong> {bug.reporter}
        </div>
        {bug.assignee && (
          <div>
            <strong>Assignee:</strong> {bug.assignee}
          </div>
        )}
        <div>
          <strong>Created:</strong> {formatDate(bug.createdAt)}
        </div>
        {bug.updatedAt !== bug.createdAt && (
          <div>
            <strong>Updated:</strong> {formatDate(bug.updatedAt)}
          </div>
        )}
      </div>

      {isEditing && (
        <div
          style={{
            marginTop: "16px",
            padding: "16px",
            backgroundColor: "#f8f9fa",
            borderRadius: "4px",
          }}
        >
          <h4 style={{ margin: "0 0 12px 0" }}>Quick Status Update</h4>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {Object.values(BUG_STATUS).map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                disabled={isLoading || bug.status === status}
                style={{
                  padding: "8px 16px",
                  backgroundColor:
                    bug.status === status ? "#6c757d" : STATUS_COLORS[status],
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor:
                    isLoading || bug.status === status
                      ? "not-allowed"
                      : "pointer",
                  fontSize: "12px",
                  textTransform: "capitalize",
                }}
                data-testid={`status-button-${status}`}
              >
                {status.replace("-", " ")}{" "}
                {bug.status === status && "(Current)"}
              </button>
            ))}
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "24px",
              borderRadius: "8px",
              maxWidth: "400px",
              width: "90%",
            }}
          >
            <h3 style={{ margin: "0 0 16px 0" }}>Confirm Delete</h3>
            <p style={{ margin: "0 0 20px 0" }}>
              Are you sure you want to delete this bug? This action cannot be
              undone.
            </p>
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                }}
                data-testid="confirm-delete-button"
              >
                {isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BugItem;
