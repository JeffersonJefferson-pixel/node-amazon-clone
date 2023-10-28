const express = require("express");
const auth = require("../middlewares/auth");
const Product = require("../models/product");

const productRouter = express.Router();

productRouter.get("/api/products", auth, async (req, res) => {
  try {
    const { category } = req.query;
    const products = await Product.find({ category });
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

productRouter.get("/api/products/search/:name", auth, async (req, res) => {
  try {
    const { name } = req.params;
    const products = await Product.find({
      name: { $regex: `^${name}`, $options: "i" },
    });
    console.log(products);
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = productRouter;
