import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import BugForm from "../../components/BugForm";
import { BUG_PRIORITY } from "../../utils/constants";

describe("BugForm Component", () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it("renders form elements correctly", () => {
    render(<BugForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/reporter/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/assignee/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /report bug/i })
    ).toBeInTheDocument();
  });

  it("shows validation errors for empty required fields", async () => {
    const user = userEvent.setup();
    render(<BugForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole("button", { name: /report bug/i });
    await user.click(submitButton);

    expect(screen.getByText("Title is required")).toBeInTheDocument();
    expect(screen.getByText("Description is required")).toBeInTheDocument();
    expect(screen.getByText("Reporter name is required")).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("shows validation error for short title", async () => {
    const user = userEvent.setup();
    render(<BugForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText(/title/i);
    await user.type(titleInput, "Hi");

    const submitButton = screen.getByRole("button", { name: /report bug/i });
    await user.click(submitButton);

    expect(
      screen.getByText("Title must be at least 3 characters")
    ).toBeInTheDocument();
  });

  it("shows validation error for short description", async () => {
    const user = userEvent.setup();
    render(<BugForm onSubmit={mockOnSubmit} />);

    const descriptionInput = screen.getByLabelText(/description/i);
    await user.type(descriptionInput, "Short");

    const submitButton = screen.getByRole("button", { name: /report bug/i });
    await user.click(submitButton);

    expect(
      screen.getByText("Description must be at least 10 characters")
    ).toBeInTheDocument();
  });

  it("submits form with valid data", async () => {
    const user = userEvent.setup();
    render(<BugForm onSubmit={mockOnSubmit} />);

    const validBugData = {
      title: "Test Bug Title",
      description: "This is a detailed description of the test bug",
      priority: BUG_PRIORITY.HIGH,
      reporter: "John Doe",
      assignee: "Jane Smith",
    };

    await user.type(screen.getByLabelText(/title/i), validBugData.title);
    await user.type(
      screen.getByLabelText(/description/i),
      validBugData.description
    );
    await user.selectOptions(
      screen.getByLabelText(/priority/i),
      validBugData.priority
    );
    await user.type(screen.getByLabelText(/reporter/i), validBugData.reporter);
    await user.type(screen.getByLabelText(/assignee/i), validBugData.assignee);

    const submitButton = screen.getByRole("button", { name: /report bug/i });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(validBugData);
  });

  it("clears errors when user starts typing", async () => {
    const user = userEvent.setup();
    render(<BugForm onSubmit={mockOnSubmit} />);

    // Submit empty form to show errors
    const submitButton = screen.getByRole("button", { name: /report bug/i });
    await user.click(submitButton);

    expect(screen.getByText("Title is required")).toBeInTheDocument();

    // Start typing in title field
    const titleInput = screen.getByLabelText(/title/i);
    await user.type(titleInput, "T");

    expect(screen.queryByText("Title is required")).not.toBeInTheDocument();
  });

  it("resets form when reset button is clicked", async () => {
    const user = userEvent.setup();
    render(<BugForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);

    await user.type(titleInput, "Test Title");
    await user.type(descriptionInput, "Test Description");

    expect(titleInput.value).toBe("Test Title");
    expect(descriptionInput.value).toBe("Test Description");

    const resetButton = screen.getByRole("button", { name: /reset/i });
    await user.click(resetButton);

    expect(titleInput.value).toBe("");
    expect(descriptionInput.value).toBe("");
  });

  it("displays loading state correctly", () => {
    render(<BugForm onSubmit={mockOnSubmit} isLoading={true} />);

    const submitButton = screen.getByRole("button", { name: /processing/i });
    expect(submitButton).toBeDisabled();

    const inputs = screen.getAllByRole("textbox");
    inputs.forEach((input) => {
      expect(input).toBeDisabled();
    });
  });

  it("populates form with initial data for editing", () => {
    const initialData = {
      title: "Existing Bug",
      description: "Existing bug description",
      priority: BUG_PRIORITY.CRITICAL,
      reporter: "Reporter Name",
      assignee: "Assignee Name",
    };

    render(<BugForm onSubmit={mockOnSubmit} initialData={initialData} />);

    expect(screen.getByDisplayValue(initialData.title)).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(initialData.description)
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue(initialData.priority)).toBeInTheDocument();
    expect(screen.getByDisplayValue(initialData.reporter)).toBeInTheDocument();
    expect(screen.getByDisplayValue(initialData.assignee)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /update bug/i })
    ).toBeInTheDocument();
  });
});
