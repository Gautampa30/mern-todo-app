import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import todoRoute from "./Routes/todo.route.js";
import userRoute from "./Routes/user.route.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3002;
const DB_URI = process.env.MONGODB_URI;

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// app.get('/', (req, res)=> {
//     console.log('Hello from the backend!');
//     res.send('Hello from the backend!');

// });

// Database connection and server start
const startServer = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log("✓ Connected to MongoDB");
  } catch (err) {
    console.warn("⚠ Failed to connect to MongoDB:", err.message);
    console.warn("ℹ Server will run in offline mode for local testing.");
  }

  // routes
  app.use("/todo", todoRoute);
  app.use("/user", userRoute);

  app.listen(PORT, () => {
    console.log(`✓ Server is running at http://localhost:${PORT}`);
  });
};

startServer();
