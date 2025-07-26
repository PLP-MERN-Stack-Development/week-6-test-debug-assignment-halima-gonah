import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "20px",
            border: "1px solid #ff0000",
            borderRadius: "5px",
            margin: "20px",
          }}
        >
          <h2>Something went wrong!</h2>
          <details style={{ whiteSpace: "pre-wrap", marginTop: "10px" }}>
            <summary>Error Details</summary>
            <div
              style={{
                marginTop: "10px",
                padding: "10px",
                backgroundColor: "#f5f5f5",
              }}
            >
              <strong>Error:</strong>{" "}
              {this.state.error && this.state.error.toString()}
              <br />
              <strong>Error Info:</strong> {this.state.errorInfo.componentStack}
            </div>
          </details>
          <button
            onClick={() =>
              this.setState({ hasError: false, error: null, errorInfo: null })
            }
            style={{
              marginTop: "10px",
              padding: "8px 16px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
