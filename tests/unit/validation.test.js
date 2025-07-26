const { sanitizeBugData } = require("../../utils/validation");

describe("Validation Utils", () => {
  describe("sanitizeBugData", () => {
    it("should trim whitespace from string fields", () => {
      const input = {
        title: "  Test Bug  ",
        description: "  This is a test bug  ",
        reporter: "  John Doe  ",
        assignee: "  Jane Smith  ",
      };

      const result = sanitizeBugData(input);

      expect(result.title).toBe("Test Bug");
      expect(result.description).toBe("This is a test bug");
      expect(result.reporter).toBe("John Doe");
      expect(result.assignee).toBe("Jane Smith");
    });

    it("should preserve non-string fields", () => {
      const input = {
        title: "Test Bug",
        status: "open",
        priority: "high",
      };

      const result = sanitizeBugData(input);

      expect(result.status).toBe("open");
      expect(result.priority).toBe("high");
    });

    it("should only include defined fields", () => {
      const input = {
        title: "Test Bug",
        description: "Test description",
        undefinedField: undefined,
      };

      const result = sanitizeBugData(input);

      expect(result).toHaveProperty("title");
      expect(result).toHaveProperty("description");
      expect(result).not.toHaveProperty("undefinedField");
    });

    it("should handle empty input", () => {
      const result = sanitizeBugData({});
      expect(result).toEqual({});
    });
  });
});
