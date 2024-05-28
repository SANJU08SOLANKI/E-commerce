const model = require("../model/orders");
const Order = model.order;
const jwt = require("jsonwebtoken");
const Usermodel = require("../model/user");
const User = Usermodel.user;
const moment = require("moment");
require("dotenv").config();

exports.createOrder = async (req, res) => {
  try {
    const { address, name, phoneNumber, email } = req.body;

    if (!address || !name || !phoneNumber || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await User.findById(decoded.userId);

    const products = user.cart.map((item) => ({
      productId: item._id,
    }));

    const currentDate = moment().format("DD-MM-YYYY HH:mm:ss");

    const newOrder = new Order({
      address,
      name,
      phoneNumber,
      email,
      products,
      date: currentDate,
      userId: decoded.userId,
    });

    const savedOrder = await newOrder.save();

    user.cart = [];
    await user.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getorder = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Unauthorized: Missing user ID" });
    }

    const userId = decoded.userId;
    let orders = await Order.find({ userId }).exec();

    orders.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
