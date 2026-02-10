import express from "express";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware to parse JSON requests
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server bắt đầu trên cổng ${PORT}`);
});
