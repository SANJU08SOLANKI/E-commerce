const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  address: { type: String, required: true },
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  products: [
    {
      productId: { type: Schema.Types.ObjectId, ref: "Product" },
    },
  ],
  date: { type: String }, // Current date and time of order placement
  userId: { type: Schema.Types.ObjectId, required: true }, // User who placed the order
});

exports.order = mongoose.model("order", orderSchema);
