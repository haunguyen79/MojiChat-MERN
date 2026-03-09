import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./libs/db.js";
import authRoute from "./routers/authRoute.js";
import userRoute from "./routers/userRouter.js";
import friendRoute from "./routers/friendRoute.js";
import messageRoute from "./routers/messageRoute.js";
import conversationRoute from "./routers/conversationRoute.js";
import cookieParser from "cookie-parser";
import { protectedRoute } from "./middlewares/authMiddleware.js";
import cors from "cors";

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware to parse JSON requests
app.use(express.json());
app.use(cookieParser()); // Middleware to parse cookies
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// Public Routes
app.use("/api/auth", authRoute);

//Private Routes
app.use(protectedRoute); // Middleware bảo vệ các route sau
app.use("/api/users", userRoute);
app.use("/api/friends", friendRoute);
app.use("/api/messages", messageRoute);
app.use("/api/conversations", conversationRoute);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server bắt đầu trên cổng ${PORT}`);
  });
});
