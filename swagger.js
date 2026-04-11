const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "MovieVault API",
    description: "A movie tracking and review REST API",
  },
  host: "cse341-finalproject-gbg5.onrender.com",
  schemes: ["https"],
};

const outputFile = "./swagger-output.json";
const routes = ["./server.js"];

swaggerAutogen(outputFile, routes, doc);
