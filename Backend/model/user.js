const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  cart: [{ type: Schema.Types.ObjectId, ref: "Product" }], // Assuming you have a Product model
});

exports.user = mongoose.model("User", userSchema);
