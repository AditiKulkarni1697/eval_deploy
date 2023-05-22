const express = require("express");
const { ProductModel } = require("../models/product.model");
const { authentication } = require("../middlewares/authentication.middleware");
const { authorization } = require("../middlewares/authorization.middleware");

const productRouter = express.Router();

productRouter.get(
  "/products",
  authentication,
  authorization(["user"]),
  async (req, res) => {
    try {
      const products = await ProductModel.find();
      res.status(200).send({ msg: products });
    } catch (err) {
      res.status(400).send({ err: err });
    }
  }
);

productRouter.post(
  "/addproducts",
  authentication,
  authorization(["seller"]),
  async (req, res) => {
    const payload = req.body;
    try {
      const product = new ProductModel(payload);
      await product.save();
      res.send({ msg: "Product added" });
    } catch (err) {
      res.send({ err: err });
    }
  }
);

productRouter.delete(
  "/deleteproducts/:id",
  authentication,
  authorization(["seller"]),
  async (req, res) => {
    const id = req.params.id;
    try {
      const product = await ProductModel.findByIdAndDelete({ _id: id });

      res.send({ msg: "Product deleted" });
    } catch (err) {
      res.send({ err: err });
    }
  }
);

module.exports = { productRouter };
