const { HashModel } = require("../models/hash.model");
const bcrypt = require("bcrypt");

const express = require("express");

const hashRouter = express.Router();

hashRouter.post("/hashmypwd", async (req, res) => {
  const { id, password } = req.body;
  bcrypt.hash(password, 8).then(async function (hash) {
    if (hash) {
      const user = new HashModel({ id, password: hash });
      await user.save();
      res.send({ msg: "Hash of the Password stored successfully." });
    } else {
      res.send({ msg: "Please try again" });
    }
  });
});

hashRouter.post("/verifymypwd", async (req, res) => {
  const { id, password } = req.body;
  const user = await HashModel.findOne({ id: id });
  bcrypt.compare(password, user.password).then(async function (result) {
    if (result) {
      res.send({ msg: "true" });
    } else {
      res.send({ msg: "false" });
    }
  });
});

module.exports = { hashRouter };
