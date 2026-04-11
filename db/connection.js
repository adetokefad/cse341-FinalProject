const { MongoClient } = require("mongodb");

let db;

const connectDB = async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  db = client.db("movieVaultDB");
  console.log("Connected to MongoDB");
};

const getDB = () => db;

module.exports = { connectDB, getDB };
