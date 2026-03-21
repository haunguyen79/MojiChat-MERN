// Nếu gặp lỗi DNS resolution, có thể thử đặt lại DNS server
// import { setServers } from 'dns';
// setServers(['8.8.8.8', '8.8.4.4']);

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
import swaggerUi from "swagger-ui-express";
import fs from "fs"; // Thư viện dùng để đọc file/tệp json
import { app, server } from "./socket/index.js";

dotenv.config(); // Load environment variables from .env file

const PORT = process.env.PORT || 5001;

// Middleware to parse JSON requests
app.use(express.json());
app.use(cookieParser()); // Middleware to parse cookies
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

/* // Nếu muốn cho phép nhiều origin, có thể sử dụng hàm callback để kiểm tra origin
const allowed = ["http://localhost:5173", "http://localhost:5174"];
app.use(cors({ origin: (origin, cb) => cb(null, allowed.includes(origin)), credentials: true }));
*/

// Swagger setup
const swaggerDocument = JSON.parse(
  fs.readFileSync("./src/swagger.json", "utf-8"),
); // Đọc file swagger.json
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument)); // Thiết lập route /api-docs để hiển thị tài liệu Swagger

// Public Routes
app.use("/api/auth", authRoute);

//Private Routes
app.use(protectedRoute); // Middleware bảo vệ các route sau
app.use("/api/users", userRoute);
app.use("/api/friends", friendRoute);
app.use("/api/messages", messageRoute);
app.use("/api/conversations", conversationRoute);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server bắt đầu trên cổng ${PORT}`);
  });
});
