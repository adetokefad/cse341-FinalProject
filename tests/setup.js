// Load environment variables before connecting

const { connectDB, closeDB } = require("../db/connection");

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await closeDB();
  await new Promise((resolve) => setTimeout(resolve, 500)); // allow cleanup
});
