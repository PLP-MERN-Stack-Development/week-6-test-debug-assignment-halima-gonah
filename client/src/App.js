import React, { useState } from "react";
import BugForm from "./components/BugForm";
import BugList from "./components/BugList";
import ErrorBoundary from "./components/ErrorBoundary";
import { bugService } from "./services/bugService";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("list");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleBugSubmit = async (bugData) => {
    try {
      setIsSubmitting(true);
      setSubmitMessage("");

      console.log("Submitting new bug:", bugData);

      const response = await bugService.createBug(bugData);

      console.log("Bug created successfully:", response.data);

      setSubmitMessage("Bug reported successfully!");

      // Switch to list tab and trigger refresh
      setTimeout(() => {
        setActiveTab("list");
        setRefreshTrigger((prev) => prev + 1);
        setSubmitMessage("");
      }, 2000);
    } catch (error) {
      console.error("Error submitting bug:", error);
      setSubmitMessage(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabStyle = (isActive) => ({
    padding: "12px 24px",
    backgroundColor: isActive ? "#007bff" : "#f8f9fa",
    color: isActive ? "white" : "#495057",
    border: "1px solid #dee2e6",
    borderBottom: isActive ? "none" : "1px solid #dee2e6",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: isActive ? "bold" : "normal",
    borderRadius: "8px 8px 0 0",
    marginRight: "4px",
  });

  return (
    <ErrorBoundary>
      <div
        className="App"
        style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}
      >
        <header
          style={{
            backgroundColor: "#343a40",
            color: "white",
            padding: "20px 0",
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "2.5rem" }}>🐛 Bug Tracker</h1>
          <p style={{ margin: "8px 0 0 0", fontSize: "1.1rem", opacity: 0.8 }}>
            Track and manage software bugs efficiently
          </p>
        </header>

        <div
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}
        >
          {/* Tab Navigation */}
          <div style={{ marginBottom: "0", borderBottom: "1px solid #dee2e6" }}>
            <button
              onClick={() => setActiveTab("list")}
              style={tabStyle(activeTab === "list")}
              data-testid="list-tab"
            >
              📋 Bug List
            </button>
            <button
              onClick={() => setActiveTab("report")}
              style={tabStyle(activeTab === "report")}
              data-testid="report-tab"
            >
              ➕ Report Bug
            </button>
          </div>

          {/* Tab Content */}
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "0 8px 8px 8px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              minHeight: "500px",
            }}
          >
            {activeTab === "list" && (
              <ErrorBoundary>
                <BugList key={refreshTrigger} />
              </ErrorBoundary>
            )}

            {activeTab === "report" && (
              <ErrorBoundary>
                <div>
                  <BugForm
                    onSubmit={handleBugSubmit}
                    isLoading={isSubmitting}
                  />

                  {/* Submit Status Message */}
                  {submitMessage && (
                    <div
                      style={{
                        marginTop: "20px",
                        padding: "12px",
                        borderRadius: "4px",
                        textAlign: "center",
                        backgroundColor: submitMessage.includes("Error")
                          ? "#f8d7da"
                          : "#d4edda",
                        color: submitMessage.includes("Error")
                          ? "#721c24"
                          : "#155724",
                        border: `1px solid ${
                          submitMessage.includes("Error")
                            ? "#f5c6cb"
                            : "#c3e6cb"
                        }`,
                      }}
                    >
                      {submitMessage}
                    </div>
                  )}
                </div>
              </ErrorBoundary>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer
          style={{
            marginTop: "50px",
            padding: "20px",
            textAlign: "center",
            color: "#6c757d",
            borderTop: "1px solid #dee2e6",
          }}
        >
          <p style={{ margin: 0 }}>
            MERN Bug Tracker - Built with React, Node.js, Express, and MongoDB
          </p>
          <p style={{ margin: "4px 0 0 0", fontSize: "14px" }}>
            Environment: {process.env.NODE_ENV || "development"}
          </p>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;
