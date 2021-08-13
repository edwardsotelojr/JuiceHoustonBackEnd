const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../keys.js");

const getSignedToken = function (id) {
  console.log(id)
  return jwt.sign({ _id: id }, JWT_SECRET, { expiresIn: "1hr" });
};

module.exports = getSignedToken;