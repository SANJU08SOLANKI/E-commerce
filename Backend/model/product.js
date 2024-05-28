const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  title: { type: String, require: true, unique: true },
  description: String,
  price: { type: Number, min: [0, "wrong min price"], require: true },
  discountPercentage: Number,

  rating: {
    type: Number,
    min: [1, "wrong min rating"],
    max: [5, "wrong min rating"],
    default: 0,
  },
  stock: Number,
  brand: { type: String, require: true },
  category: { type: String, require: true },
  thumbnail: { type: String, require: true },
  images: [String],
});

exports.product = mongoose.model("product", productSchema);
