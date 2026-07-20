const request = require("supertest");
const { connectDB } = require("../db/connection");
const app = require("../app");

beforeAll(async () => {
  await connectDB();
});

describe("Watchlists API", () => {
  test("GET /watchlists should return 401 without login", async () => {
    const res = await request(app).get("/watchlists");
    expect(res.statusCode).toBe(401);
  });
});
