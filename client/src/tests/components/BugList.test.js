import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import BugList from "../../components/BugList";
import { bugService } from "../../services/bugService";
import { BUG_STATUS, BUG_PRIORITY } from "../../utils/constants";

// Mock the bugService
jest.mock("../../services/bugService");

describe("BugList Component", () => {
  const mockBugs = [
    {
      _id: "1",
      title: "Test Bug 1",
      description: "Description for test bug 1",
      status: BUG_STATUS.OPEN,
      priority: BUG_PRIORITY.HIGH,
      reporter: "John Doe",
      assignee: "Jane Smith",
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-01-01T00:00:00.000Z",
    },
    {
      _id: "2",
      title: "Test Bug 2",
      description: "Description for test bug 2",
      status: BUG_STATUS.RESOLVED,
      priority: BUG_PRIORITY.LOW,
      reporter: "Alice Johnson",
      assignee: null,
      createdAt: "2023-01-02T00:00:00.000Z",
      updatedAt: "2023-01-02T00:00:00.000Z",
    },
  ];

  beforeEach(() => {
    bugService.getAllBugs.mockResolvedValue({
      success: true,
      count: mockBugs.length,
      data: mockBugs,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state initially", () => {
    render(<BugList />);
    expect(screen.getByText("Loading bugs...")).toBeInTheDocument();
  });

  it("renders bug list after loading", async () => {
    render(<BugList />);

    await waitFor(() => {
      expect(screen.getByText("Bug List (2)")).toBeInTheDocument();
    });

    expect(screen.getByText("Test Bug 1")).toBeInTheDocument();
    expect(screen.getByText("Test Bug 2")).toBeInTheDocument();
  });

  it("displays empty state when no bugs found", async () => {
    bugService.getAllBugs.mockResolvedValue({
      success: true,
      count: 0,
      data: [],
    });

    render(<BugList />);

    await waitFor(() => {
      expect(screen.getByText("No bugs found")).toBeInTheDocument();
    });
  });

  it("displays error message on fetch failure", async () => {
    const errorMessage = "Failed to fetch bugs";
    bugService.getAllBugs.mockRejectedValue(new Error(errorMessage));

    render(<BugList />);

    await waitFor(() => {
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    });
  });

  it("filters bugs by status", async () => {
    const user = userEvent.setup();
    render(<BugList />);

    await waitFor(() => {
      expect(screen.getByText("Bug List (2)")).toBeInTheDocument();
    });

    const statusFilter = screen.getByTestId("status-filter");
    await user.selectOptions(statusFilter, BUG_STATUS.OPEN);

    await waitFor(() => {
      expect(bugService.getAllBugs).toHaveBeenCalledWith(
        expect.objectContaining({ status: BUG_STATUS.OPEN })
      );
    });
  });

  it("filters bugs by priority", async () => {
    const user = userEvent.setup();
    render(<BugList />);

    await waitFor(() => {
      expect(screen.getByText("Bug List (2)")).toBeInTheDocument();
    });

    const priorityFilter = screen.getByTestId("priority-filter");
    await user.selectOptions(priorityFilter, BUG_PRIORITY.HIGH);

    await waitFor(() => {
      expect(bugService.getAllBugs).toHaveBeenCalledWith(
        expect.objectContaining({ priority: BUG_PRIORITY.HIGH })
      );
    });
  });

  it("clears all filters when clear button is clicked", async () => {
    const user = userEvent.setup();
    render(<BugList />);

    await waitFor(() => {
      expect(screen.getByText("Bug List (2)")).toBeInTheDocument();
    });

    // Set some filters
    const statusFilter = screen.getByTestId("status-filter");
    await user.selectOptions(statusFilter, BUG_STATUS.OPEN);

    // Clear filters
    const clearButton = screen.getByTestId("clear-filters-button");
    await user.click(clearButton);

    await waitFor(() => {
      expect(bugService.getAllBugs).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "",
          priority: "",
          sortBy: "createdAt",
          order: "desc",
        })
      );
    });
  });

  it("refreshes bug list when refresh button is clicked", async () => {
    const user = userEvent.setup();
    render(<BugList />);

    await waitFor(() => {
      expect(screen.getByText("Bug List (2)")).toBeInTheDocument();
    });

    const refreshButton = screen.getByText("Refresh");
    await user.click(refreshButton);

    await waitFor(() => {
      expect(bugService.getAllBugs).toHaveBeenCalledTimes(2);
    });
  });

  it("updates bug status successfully", async () => {
    bugService.updateBug.mockResolvedValue({
      success: true,
      data: { ...mockBugs[0], status: BUG_STATUS.IN_PROGRESS },
    });

    render(<BugList />);

    await waitFor(() => {
      expect(screen.getByText("Bug List (2)")).toBeInTheDocument();
    });

    // Find and click edit button for first bug
    const editButton = screen.getByTestId("edit-button-1");
    fireEvent.click(editButton);

    // Click status update button
    const statusButton = screen.getByTestId(
      `status-button-${BUG_STATUS.IN_PROGRESS}`
    );
    fireEvent.click(statusButton);

    await waitFor(() => {
      expect(bugService.updateBug).toHaveBeenCalledWith("1", {
        status: BUG_STATUS.IN_PROGRESS,
      });
    });
  });

  it("deletes bug successfully", async () => {
    bugService.deleteBug.mockResolvedValue({ success: true });

    render(<BugList />);

    await waitFor(() => {
      expect(screen.getByText("Bug List (2)")).toBeInTheDocument();
    });

    // Find and click delete button for first bug
    const deleteButton = screen.getByTestId("delete-button-1");
    fireEvent.click(deleteButton);

    // Confirm deletion
    const confirmButton = screen.getByTestId("confirm-delete-button");
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(bugService.deleteBug).toHaveBeenCalledWith("1");
    });
  });

  it("handles update error gracefully", async () => {
    const errorMessage = "Update failed";
    bugService.updateBug.mockRejectedValue(new Error(errorMessage));

    render(<BugList />);

    await waitFor(() => {
      expect(screen.getByText("Bug List (2)")).toBeInTheDocument();
    });

    // Find and click edit button for first bug
    const editButton = screen.getByTestId("edit-button-1");
    fireEvent.click(editButton);

    // Click status update button
    const statusButton = screen.getByTestId(
      `status-button-${BUG_STATUS.IN_PROGRESS}`
    );
    fireEvent.click(statusButton);

    await waitFor(() => {
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    });
  });
});
