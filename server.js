import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import path from "path";
// import paymentRoutes from "./routes/paymentRoutes.js";

import cors from "cors";

//CONFIGURE ENV
dotenv.config();

//databse config
connectDB();

//rest object
const app = express();

//middleware
app.use(cors());

// Increase payload size limit to 10MB (adjust as needed)
app.use(express.json({ limit: "10mb" }));

//app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "./client/build")));
// app.use(express.static(path.join(__dirname, "./client/build")));
//routes

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/Items", productRoutes);
// app.use("/api/v1/payment", paymentRoutes);

//rest api
app.use("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html "));
});
//PORT
const PORT = process.env.PORT || 8080;

//run listen
app.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`.bgCyan.white);
});
