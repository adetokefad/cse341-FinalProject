const request = require("supertest");
const { connectDB } = require("../db/connection");
const app = require("../app");

beforeAll(async () => {
  await connectDB();
});

describe("Users API", () => {
  test("GET /users should return all users", async () => {
    const res = await request(app).get("/users");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
