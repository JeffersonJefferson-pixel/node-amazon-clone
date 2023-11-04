const express = require("express");
const auth = require("../middlewares/auth");
const { Product } = require("../models/product");
const User = require("../models/user");
const userRouter = express.Router();

userRouter.post("/api/add-to-cart", auth, async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);
    let user = await User.findById(req.user);

    if (user.cart.length == 0) {
      user.cart.push({ product, quantity: 1 });
    } else {
      let foundProduct = user.cart.find(({ product: cartProduct }) =>
        cartProduct._id.equals(product._id)
      );
      if (foundProduct != undefined) {
        foundProduct.quantity += 1;
      } else {
        user.cart.push({ product, quantity: 1 });
      }
    }

    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

userRouter.delete("/api/remove-from-cart/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    let user = await User.findById(req.user);

    const index = user.cart.findIndex(
      ({ product }) => product._id.toString() == id
    );
    if (index != -1) {
      const productCart = user.cart[index];
      if (productCart.quantity == 1) {
        user.cart.splice(index, 1);
      } else {
        productCart.quantity -= 1;
      }
    }
    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = userRouter;
