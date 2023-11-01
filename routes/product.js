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

productRouter.post("/api/products/rate-product", auth, async (req, res) => {
  try {
    const { id, rating } = req.body;
    let product = await Product.findById(id);
    const index = product.ratings.findIndex(
      (rating) => rating.userId === req.user
    );
    if (index !== -1) {
      product.ratings.splice(index, 1);
    }

    const ratingSchema = {
      userId: req.user,
      rating: rating,
    };

    product.ratings.push(ratingSchema);

    product = await product.save();
    res.json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

productRouter.get("/api/products/deal-of-day", auth, async (req, res) => {
  try {
    let products = await Product.find({});

    products = products.sort((a, b) => {
      let aSum = 0;
      let bSum = 0;

      for (let i = 0; i < a.ratings.length; i++) {
        aSum += a.ratings[i].rating;
      }

      for (let i = 0; i < b.ratings.length; i++) {
        bSum += b.ratings[i].rating;
      }
      return aSum < bSum ? 1 : -1;
    });
    res.json(products[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = productRouter;
