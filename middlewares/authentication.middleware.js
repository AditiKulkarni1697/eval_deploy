const express = require("express");
const jwt = require("jsonwebtoken");
const { BlacklistModel } = require("../models/blacklist.model");

const authentication = async (req, res, next) => {
  const token = req.cookies.token;
  const blacklisted = await BlacklistModel.findOne({ blacklisted: token });
  if (!blacklisted) {
    const decoded = jwt.verify(token, "token");
    if (decoded) {
      next();
    } else {
      res.send({ msg: "please log in" });
    }
  } else {
    res.send({ msg: "Please login" });
  }
};

module.exports = { authentication };
