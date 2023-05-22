const express = require("express");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user.model");
const authorization = (allowed) => {
  return async (req, res, next) => {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, "token");
    if (decoded) {
      const user = await UserModel.findOne({ _id: decoded.userId });
      if (allowed.includes(user.role)) {
        next();
      } else {
        res.send({ msg: "Access denied" });
      }
    }
  };
};

module.exports = { authorization };
