const model = require("../model/product");
const path = require("path");
const Product = model.product;
const jwt = require("jsonwebtoken");
const User = require("../model/user").user;
require("dotenv").config();

exports.getallproducts = async (req, res) => {
  try {
    const docs = await Product.find({});
    res.json(docs);
    console.log(docs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createproduct = (req, res) => {
  const product = new Product(req.body);

  product
    .save()
    .then((savedProduct) => {
      console.log("Product saved successfully:", savedProduct);
      res.status(201).json(savedProduct);
    })
    .catch((error) => {
      console.error("Error saving product:", error);
      res.status(500).json({ error: "Error saving product" });
    });
};

exports.getproducts = async (req, res) => {
  const id = req.params.id;
  const products = await Product.findById(id);
  res.json(products);
};

exports.getproductscategory = async (req, res) => {
  const category = req.params.category;
  try {
    const products = await Product.find({ category: category });
    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found in this category" });
    }
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getsearchedproduct = async (req, res) => {
  try {
    const keyword = req.params.keyword;
    const words = keyword.split(/\s+/);
    const regexPatterns = words.map((word) => new RegExp(word, "i"));

    const products = await Product.find({
      $or: [
        { title: { $in: regexPatterns } },
        { description: { $in: regexPatterns } },
      ],
    });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getcartproduct = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.userId) {
      return res.status(401).json({ message: "Unauthorized: Missing user ID" });
    }

    const userId = decoded.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cart = user.cart;

    res.json(cart);
  } catch (error) {
    console.error("Error getting cart products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.removefromcart = async (req, res) => {
  try {
    const productId = req.params.productid;

    if (!productId) {
      return res.status(400).json({ error: "Product ID is missing" });
    }

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.userId) {
      return res.status(401).json({ message: "Unauthorized: Missing user ID" });
    }

    const userId = decoded.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndUpdate(userId, { $pull: { cart: productId } });

    res.status(200).json({ message: "Product removed from cart successfully" });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
