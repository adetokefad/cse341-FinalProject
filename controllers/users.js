const validateObjectId = require("../utils/validateObjectId");
const { getDB } = require("../db/connection");
const userSchema = require("../validators/userValidator");
const { ObjectId } = require("mongodb");

const getAllUsers = async (req, res) => {
  // #swagger.summary = 'Get all users'
  // #swagger.description = 'Returns a list of all users in the database'
  try {
    const db = getDB();
    const users = await db.collection("users").find().toArray();
    res.status(200).json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving users", error: err.message });
  }
};

const getUserById = async (req, res) => {
  // #swagger.summary = 'Get a single user'
  // #swagger.description = 'Returns a single user by ID'
  try {
    const db = getDB();
    const user = await db.collection("users").findOne({
      _id: new ObjectId(req.params.id),
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving user", error: err.message });
  }
};

const updateUser = async (req, res) => {
  // #swagger.summary = 'Update a user'
  // #swagger.description = 'Updates an existing user by ID'
  try {
    const { error, value } = userSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map((detail) => detail.message),
      });
    }

    const db = getDB();

    const result = await db.collection("users").replaceOne(
      { _id: new ObjectId(req.params.id) },
      {
        ...value,
        updatedAt: new Date(),
      },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Error updating user",
      error: err.message,
    });
  }
};

const deleteUser = async (req, res) => {
  // #swagger.summary = 'Delete a user'
  // #swagger.description = 'Deletes a user by ID'
  try {
    const db = getDB();
    const result = await db.collection("users").deleteOne({
      _id: new ObjectId(req.params.id),
    });
    if (result.deletedCount === 0)
      return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: err.message });
  }
};

const createUser = async (req, res) => {
  // #swagger.summary = 'Create a new user'
  // #swagger.description = 'Creates a new user in the database'
  try {
    const { error, value } = userSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map((detail) => detail.message),
      });
    }

    const db = getDB();

    const result = await db.collection("users").insertOne({
      ...value,
      createdAt: new Date(),
    });

    res.status(201).json({
      message: "User created successfully",
      id: result.insertedId,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error creating user",
      error: err.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
