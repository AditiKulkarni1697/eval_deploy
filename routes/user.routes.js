const { UserModel } = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { BlacklistModel } = require("../models/blacklist.model");
const express = require("express");
const { authentication } = require("../middlewares/authentication.middleware");

const userRouter = express.Router();

userRouter.get("/", async (req, res) => {
  const users = await UserModel.find();
  res.send({ msg: users });
});

userRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 8, async function (err, hash) {
    if (hash) {
      const user = new UserModel({ name, email, password: hash });
      await user.save();
      res.status(200).send({ msg: "User is registered" });
    } else {
      res.status(400).send({ err: err });
    }
  });
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    bcrypt.compare(password, user.password).then(function (result) {
      if (result) {
        const token = jwt.sign({ userId: user._id }, "token", {
          expiresIn: "1m",
        });
        const refreshToken = jwt.sign({ userId: user._id }, "refresh", {
          expiresIn: "5m",
        });
        res.cookie("token", token);
        res.cookie("refresh", refreshToken);
        res.send({ msg: "user logged in" });
      }
    });
  } catch (err) {
    res.send({ err: err });
  }
});

userRouter.get("/logout", authentication, async (req, res) => {
  const token = req.cookies.token;
  try {
    const blacklisted = new BlacklistModel({ blacklisted: token });
    await blacklisted.save();
    res.send({ msg: "Log out successful" });
  } catch (err) {
    res.send({ err: err });
  }
});

userRouter.get("/accesstoken", async (req, res) => {
  const token = req.cookies.refreshToken;
  const decoded = jwt.verify(token, "refresh");
  if (decoded) {
    const token = jwt.sign({ userId: user._id }, "token", {
      expiresIn: "1m",
    });
    res.cookie("token", token);
  } else {
    res.send({ msg: "Please log in" });
  }
});

module.exports = { userRouter };
