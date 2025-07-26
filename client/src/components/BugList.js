import React, { useState, useEffect } from "react";
import BugItem from "./BugItem";
import { bugService } from "../services/bugService";
import { BUG_STATUS, BUG_PRIORITY } from "../utils/constants";

const BugList = () => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    sortBy: "createdAt",
    order: "desc",
  });
  const [operationLoading, setOperationLoading] = useState(false);

  useEffect(() => {
    fetchBugs();
  }, [filters]);

  const fetchBugs = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching bugs with filters:", filters);

      const response = await bugService.getAllBugs(filters);
      setBugs(response.data);
      console.log(`Loaded ${response.data.length} bugs`);
    } catch (err) {
      console.error("Error fetching bugs:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBug = async (bugId, updateData) => {
    try {
      setOperationLoading(true);
      console.log(`Updating bug ${bugId}:`, updateData);

      const response = await bugService.updateBug(bugId, updateData);

      // Update the bug in the local state
      setBugs((prevBugs) =>
        prevBugs.map((bug) => (bug._id === bugId ? response.data : bug))
      );

      console.log("Bug updated successfully");
    } catch (err) {
      console.error("Error updating bug:", err);
      setError(err.message);
    } finally {
      setOperationLoading(false);
    }
  };

  const handleDeleteBug = async (bugId) => {
    try {
      setOperationLoading(true);
      console.log(`Deleting bug ${bugId}`);

      await bugService.deleteBug(bugId);

      // Remove the bug from local state
      setBugs((prevBugs) => prevBugs.filter((bug) => bug._id !== bugId));

      console.log("Bug deleted successfully");
    } catch (err) {
      console.error("Error deleting bug:", err);
      setError(err.message);
    } finally {
      setOperationLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      priority: "",
      sortBy: "createdAt",
      order: "desc",
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <div>Loading bugs...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>Bug List ({bugs.length})</h2>
        <button
          onClick={fetchBugs}
          disabled={loading}
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div
        style={{
          padding: "16px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          marginBottom: "20px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "12px",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "4px",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            style={{
              width: "100%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          >
            <option value="createdAt">Created Date</option>
            <option value="updatedAt">Updated Date</option>
            <option value="title">Title</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
          </select>
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "4px",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            Order
          </label>
          <select
            value={filters.order}
            onChange={(e) => handleFilterChange("order", e.target.value)}
            style={{
              width: "100%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>

        <div style={{ display: "flex", alignItems: "end" }}>
          <button
            onClick={clearFilters}
            style={{
              padding: "6px 12px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              width: "100%",
            }}
            data-testid="clear-filters-button"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div
          style={{
            padding: "12px",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            border: "1px solid #f5c6cb",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
        >
          <strong>Error:</strong> {error}
          <button
            onClick={() => setError(null)}
            style={{
              float: "right",
              background: "none",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Bug List */}
      {bugs.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            color: "#6c757d",
          }}
        >
          <h3>No bugs found</h3>
          <p>
            No bugs match your current filters, or no bugs have been reported
            yet.
          </p>
        </div>
      ) : (
        <div data-testid="bug-list">
          {bugs.map((bug) => (
            <BugItem
              key={bug._id}
              bug={bug}
              onUpdate={handleUpdateBug}
              onDelete={handleDeleteBug}
              isLoading={operationLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BugList;
