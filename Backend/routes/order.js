const express = require("express");
const router = express.Router();
const ordercontroler = require("../controler/order");

router
  .post("/", ordercontroler.createOrder)
  .get("/getorder", ordercontroler.getorder);

exports.router = router;
