const express = require("express");
const { connection } = require("./db");
const { userRouter } = require("./routes/user.routes");
const { productRouter } = require("./routes/product.routes");
const { encryprRouter } = require("./routes/encrypt.routes");
const { hashRouter } = require("./routes/hash.routes");
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/encrypt", encryprRouter);
app.use("/hash", hashRouter);
app.get("/", (req, res) => {
  res.send("Welcome");
});

app.listen(8080, async () => {
  try {
    await connection;
    console.log("DB is connected to server");
  } catch (err) {
    console.log(err);
  }
  console.log("Server is running at port 8080");
});
