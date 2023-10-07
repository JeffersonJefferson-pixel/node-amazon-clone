const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();

const authRouter = require("./routes/auth");

const PORT = 3000;
const app = express();
const DB = process.env.DB;

app.use(express.json());
app.use(authRouter);

mongoose
  .connect(DB)
  .then(() => {
    console.log("connection successful");
  })
  .catch((e) => {
    console.log(e);
  });

app.listen(PORT, "0.0.0.0", () => {
  console.log(`connected at port ${PORT}`);
});