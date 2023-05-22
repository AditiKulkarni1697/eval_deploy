const mongoose = require("mongoose");

const hashSchema = mongoose.Schema({
  id: String,
  password: String,
});

const HashModel = mongoose.model("hashedpwds", hashSchema);

module.exports = { HashModel };
