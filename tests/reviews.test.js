jest.mock("../middleware/isAuthenticated", () => {
  return (req, res, next) => {
    req.user = {
      id: "testUserId",
      _id: "testUserId",
    };
    next();
  };
});

const request = require("supertest");
const app = require("../app");

describe("Reviews API (with login)", () => {
  let agent;

  beforeAll(async () => {
    agent = request.agent(app);

    // Login inside async beforeAll
    const loginRes = await agent
      .post("/login")
      .send({ username: "testuser", password: "testpass" });

    expect(loginRes.statusCode).toBe(200); // login should succeed
  });

  test("GET /reviews/:id should return a single review", async () => {
    // Step 1: Create a new review
    const createRes = await agent.post("/reviews").send({
      title: "Test Movie",
      genre: "Drama",
      year: 2024,
    });

    expect(createRes.statusCode).toBe(201);
    expect(createRes.body).toHaveProperty("_id");

    const reviewId = createRes.body._id;
    console.log("Created review ID:", reviewId);

    // Step 2: Fetch the review by its ID
    const getRes = await agent.get(`/reviews/${reviewId}`);

    expect(getRes.statusCode).toBe(200);
    expect(getRes.body).toHaveProperty("title", "Test Movie");
  });
});
