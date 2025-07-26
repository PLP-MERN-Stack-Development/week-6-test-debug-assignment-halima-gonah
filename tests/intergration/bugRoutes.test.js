const request = require("supertest");
const app = require("../../app");
const Bug = require("../../models/Bug");

describe("Bug Routes Integration Tests", () => {
  const sampleBug = {
    title: "Test Bug",
    description: "This is a test bug description that is long enough",
    priority: "high",
    reporter: "John Doe",
  };

  describe("POST /api/bugs", () => {
    it("should create a new bug with valid data", async () => {
      const res = await request(app)
        .post("/api/bugs")
        .send(sampleBug)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("_id");
      expect(res.body.data.title).toBe(sampleBug.title);
      expect(res.body.data.status).toBe("open"); // default value
    });

    it("should return 400 for invalid data", async () => {
      const invalidBug = {
        title: "A", // too short
        description: "Short", // too short
        reporter: "", // empty
      };

      const res = await request(app)
        .post("/api/bugs")
        .send(invalidBug)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Validation failed");
      expect(res.body.errors).toBeInstanceOf(Array);
    });

    it("should sanitize input data", async () => {
      const bugWithWhitespace = {
        ...sampleBug,
        title: "  Whitespace Bug  ",
        reporter: "  Jane Doe  ",
      };

      const res = await request(app)
        .post("/api/bugs")
        .send(bugWithWhitespace)
        .expect(201);

      expect(res.body.data.title).toBe("Whitespace Bug");
      expect(res.body.data.reporter).toBe("Jane Doe");
    });
  });

  describe("GET /api/bugs", () => {
    beforeEach(async () => {
      // Create test bugs
      await Bug.create([
        { ...sampleBug, title: "Bug 1", status: "open", priority: "high" },
        { ...sampleBug, title: "Bug 2", status: "resolved", priority: "low" },
        {
          ...sampleBug,
          title: "Bug 3",
          status: "in-progress",
          priority: "medium",
        },
      ]);
    });

    it("should get all bugs", async () => {
      const res = await request(app).get("/api/bugs").expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(3);
      expect(res.body.data).toHaveLength(3);
    });

    it("should filter bugs by status", async () => {
      const res = await request(app).get("/api/bugs?status=open").expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(1);
      expect(res.body.data[0].status).toBe("open");
    });

    it("should filter bugs by priority", async () => {
      const res = await request(app).get("/api/bugs?priority=high").expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(1);
      expect(res.body.data[0].priority).toBe("high");
    });

    it("should sort bugs by createdAt desc by default", async () => {
      const res = await request(app).get("/api/bugs").expect(200);

      const bugs = res.body.data;
      for (let i = 0; i < bugs.length - 1; i++) {
        expect(
          new Date(bugs[i].createdAt) >= new Date(bugs[i + 1].createdAt)
        ).toBe(true);
      }
    });
  });

  describe("GET /api/bugs/:id", () => {
    let bugId;

    beforeEach(async () => {
      const bug = await Bug.create(sampleBug);
      bugId = bug._id;
    });

    it("should get a bug by ID", async () => {
      const res = await request(app).get(`/api/bugs/${bugId}`).expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(bugId.toString());
      expect(res.body.data.title).toBe(sampleBug.title);
    });

    it("should return 404 for non-existent bug", async () => {
      const nonExistentId = "507f1f77bcf86cd799439011";

      const res = await request(app)
        .get(`/api/bugs/${nonExistentId}`)
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Bug not found");
    });

    it("should return 400 for invalid ID format", async () => {
      const res = await request(app).get("/api/bugs/invalid-id").expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Invalid bug ID format");
    });
  });

  describe("PUT /api/bugs/:id", () => {
    let bugId;

    beforeEach(async () => {
      const bug = await Bug.create(sampleBug);
      bugId = bug._id;
    });

    it("should update a bug with valid data", async () => {
      const updateData = {
        status: "resolved",
        assignee: "Jane Smith",
      };

      const res = await request(app)
        .put(`/api/bugs/${bugId}`)
        .send(updateData)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe("resolved");
      expect(res.body.data.assignee).toBe("Jane Smith");
      expect(res.body.data.updatedAt).not.toBe(res.body.data.createdAt);
    });

    it("should return 404 for non-existent bug", async () => {
      const nonExistentId = "507f1f77bcf86cd799439011";

      const res = await request(app)
        .put(`/api/bugs/${nonExistentId}`)
        .send({ status: "resolved" })
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Bug not found");
    });

    it("should validate update data", async () => {
      const invalidUpdate = {
        status: "invalid-status",
      };

      const res = await request(app)
        .put(`/api/bugs/${bugId}`)
        .send(invalidUpdate)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Validation failed");
    });
  });

  describe("DELETE /api/bugs/:id", () => {
    let bugId;

    beforeEach(async () => {
      const bug = await Bug.create(sampleBug);
      bugId = bug._id;
    });

    it("should delete a bug", async () => {
      const res = await request(app).delete(`/api/bugs/${bugId}`).expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Bug deleted successfully");

      // Verify bug is deleted
      const deletedBug = await Bug.findById(bugId);
      expect(deletedBug).toBeNull();
    });

    it("should return 404 for non-existent bug", async () => {
      const nonExistentId = "507f1f77bcf86cd799439011";

      const res = await request(app)
        .delete(`/api/bugs/${nonExistentId}`)
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Bug not found");
    });
  });

  describe("Error Handling", () => {
    it("should handle server errors gracefully", async () => {
      // Mock a database error
      jest
        .spyOn(Bug, "find")
        .mockRejectedValueOnce(new Error("Database connection failed"));

      const res = await request(app).get("/api/bugs").expect(500);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Database connection failed");

      // Restore the mock
      Bug.find.mockRestore();
    });
  });
});
