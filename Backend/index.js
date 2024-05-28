const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const port = process.env.PORT;
const database = process.env.DATABASE;
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const productRouter = require("./routes/product");
const userRouter = require("./routes/user");
const orderrouter = require("./routes/order");
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/products", authenticateToken, productRouter.router);
app.use("/user", userRouter.router);
app.use("/order", authenticateToken, orderrouter.router);

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(`${database}`);
  console.log("Database connected");
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  console.log(authHeader);
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Missing token" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }

    req.user = user;
    next();
  });
}

app.get("/", (req, res) => {
  res.send("Hello India");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
