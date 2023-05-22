const mongoose = require("mongoose");

const encryptSchema = mongoose.Schema({
  id: String,
  encrypt_pass: String,
});

const EncryptModel = mongoose.model("encryptedpwds", encryptSchema);

module.exports = { EncryptModel };
