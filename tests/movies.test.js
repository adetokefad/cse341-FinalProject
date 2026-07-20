const request = require("supertest");
const { connectDB } = require("../db/connection");
const app = require("../app");

beforeAll(async () => {
  await connectDB();
});

describe("Movies API", () => {
  test("GET /movies should return all movies", async () => {
    const res = await request(app).get("/movies");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /movies/:id should return a single movie", async () => {
    const res = await request(app).get("/movies/69daaa304a8a05bef59637b8");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("title");
  });

  test("GET /movies/:id should return 404 for invalid ID", async () => {
    const res = await request(app).get("/movies/000000000000000000000000");
    expect(res.statusCode).toBe(404);
  });
});
