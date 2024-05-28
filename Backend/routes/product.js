const express = require("express");
const router = express.Router();
const productcontroler = require("../controler/product");

router
  .get("/", productcontroler.getallproducts)
  .get("/category/:category", productcontroler.getproductscategory)
  .get("/search/:keyword", productcontroler.getsearchedproduct)
  .get("/cart", productcontroler.getcartproduct)
  .delete("/cart/:productid", productcontroler.removefromcart)

  .get("/:id", productcontroler.getproducts)

  .post("/", productcontroler.createproduct);

exports.router = router;
