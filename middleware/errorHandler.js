const { ObjectId } = require("mongodb");

function validateObjectId(req, res, next) {
  if (req.params.id && !ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }
  next();
}

function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
}

module.exports = { validateObjectId, errorHandler };
