const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const authRouter = express.Router();

authRouter.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "User with same email already exists!" });
    }

    const hashedPassword = await bcryptjs.hash(password, 8);


    let user = new User({
      email,
      password: hashedPassword,
      name,
    });

    user = await user.save();

    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
});

authRouter.post("/api/signin", async (req, res) => {
  try {
    const {email, password} = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(404)
        .json({ msg: "User with the email doesn't exist!"});
        
    }

    const isMatch = await bcryptjs.compare(password, existingUser.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ msg: "Incorrect password." });
    }

    const token = jwt.sign({id: existingUser._id}, process.env.SECRET);

    res.json({ token, ...existingUser._doc });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = authRouter;
