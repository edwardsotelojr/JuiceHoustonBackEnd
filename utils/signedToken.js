require('dotenv').config()

const jwt = require("jsonwebtoken");

const getSignedToken = function (id) {
  console.log(id)
  return jwt.sign({ _id: id }, process.env.JWT_SECRET, { expiresIn: "1hr" });
};

module.exports = getSignedToken;