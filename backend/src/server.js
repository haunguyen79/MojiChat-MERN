import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./libs/db.js";
import authRoute from "./routers/authRoute.js";
import cookieParser from "cookie-parser";

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware to parse JSON requests
app.use(express.json());
app.use(cookieParser()); // Middleware to parse cookies

// Public Routes
app.use("/api/auth", authRoute);

//Private Routes

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server bắt đầu trên cổng ${PORT}`);
  });
});
