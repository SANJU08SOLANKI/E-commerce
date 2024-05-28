const express = require("express");
const router = express.Router();
const usercontroler = require("../controler/user");

router
  .post("/", usercontroler.createuser)
  .post("/login", usercontroler.login)
  .post("/addtocart", usercontroler.addtocartproduct)
  .delete("/removecart", usercontroler.removeallcart)
  .get("/getuser", usercontroler.getuserdata);

exports.router = router;
