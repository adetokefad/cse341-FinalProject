const { ObjectId } = require("mongodb");

const validateObjectId = (id) => {
  return ObjectId.isValid(id);
};

module.exports = validateObjectId;
