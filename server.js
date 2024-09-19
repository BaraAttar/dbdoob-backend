require("dotenv").config();
const helmet = require("helmet");
const bodyParser = require("body-parser");
const cors = require("cors");

const express = require("express");
const app = express();
const connectMongoDB = require("./database/connectMongoDB");

const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const categoryRoutes = require("./routes/categoryRoutes.js");


const port = process.env.PORT || 3000;

app.use(helmet());
app.use(bodyParser.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  })
);

app.get('/test', (req, res) => {
  res.json({ message: "API is working!" });
});

// Routs
app.use("/auth", authRoutes);
app.use("/user" , userRoutes)
app.use("/orders" , orderRoutes)
app.use("/products" , productRoutes)
app.use("/category" , categoryRoutes)

 
// Database Connection
connectMongoDB();

app.listen(port, () => {
  console.log(`Server is running on port : ${port}`);
});
 