const { MongoClient } = require("mongodb");

let db;
let client;

const connectDB = async () => {
  if (db) return db;

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  client = new MongoClient(uri);
  await client.connect();

  db = client.db("movieVaultDB");

  console.log("Connected to MongoDB");

  return db;
};

const getDB = () => db;

const closeDB = async () => {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
};

module.exports = { connectDB, getDB, closeDB };
