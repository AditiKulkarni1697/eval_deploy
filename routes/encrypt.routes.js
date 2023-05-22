const express = require("express");
const { EncryptModel } = require("../models/encrypt.model");
const jwt = require("jsonwebtoken");

const encryprRouter = express.Router();

encryprRouter.post("/encryptmypwd", async (req, res) => {
  const { id, password } = req.body;
  const encrypt_pass = jwt.sign({ password: password }, `${id}`);
  //console.log(encrypt_pass);
  try {
    const user = new EncryptModel({ id, encrypt_pass });
    await user.save();
    res.send({ msg: "Password stored successfully in encrypted form" });
  } catch (err) {
    res.status(400).send({ msg: err });
  }
});

encryprRouter.get("/getmypwd", async (req, res) => {
  const id = req.query.id;
  const user = await EncryptModel.findOne({ id: id });
  //console.log(user);
  const decoded = jwt.verify(user.encrypt_pass, `${id}`);
  if (decoded) {
    res.send({ msg: decoded.password });
  } else {
    res.send({ msg: "wrong credentials" });
  }
});

module.exports = { encryprRouter };
