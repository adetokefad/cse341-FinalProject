module.exports = {
  setupFiles: ["<rootDir>/tests/jest.env.js"], // loads env FIRST
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"], // then runs beforeAll/afterAll
  testTimeout: 20000,
};
