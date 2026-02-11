import express from "express";
import { singUp } from "../controllers/authController.js";

const router = express.Router();

router.post('login', singUp)

export default router;
