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

describe("Reviews API", () => {
  let agent;

  beforeAll(() => {
    agent = request.agent(app);
  });

  test("GET /reviews/:id should return a single review", async () => {
    // Step 1: Create a new review
    const createRes = await agent.post("/reviews").send({
      movieId: "testMovieId",
      userId: "testUserId",
      rating: 8,
      reviewText: "This is a great movie!",
    });

    expect(createRes.statusCode).toBe(201);
    expect(createRes.body).toHaveProperty("id");

    const reviewId = createRes.body.id;

    // Step 2: Fetch the review by its ID
    const getRes = await agent.get(`/reviews/${reviewId}`);

    expect(getRes.statusCode).toBe(200);
    expect(getRes.body).toHaveProperty("movieId", "testMovieId");
    expect(getRes.body).toHaveProperty("userId", "testUserId");
    expect(getRes.body).toHaveProperty("rating", 8);
    expect(getRes.body).toHaveProperty("reviewText", "This is a great movie!");
  });
});
