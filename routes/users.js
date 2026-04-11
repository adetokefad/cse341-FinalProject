const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users");
const isAuthenticated = require("../middleware/isAuthenticated");

router.get("/", usersController.getAllUsers);
router.get("/:id", usersController.getUserById);
router.post("/", usersController.createUser);
router.put("/:id", isAuthenticated, usersController.updateUser);
router.delete("/:id", isAuthenticated, usersController.deleteUser);

module.exports = router;
