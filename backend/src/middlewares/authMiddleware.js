import jwt from "jsonwebtoken";
import User from "../models/User.js";

// authorization middleware - Xác thực người dùng
export const protectedRoute = async (req, res, next) => {
  try {
    // Lấy token từ header Authorization
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
    if (!token) {
      return res.status(401).json({
        message: "Không tìm thấy access token, truy cập bị từ chối !!!",
      });
    }

    // Xác nhận token hợp lệ
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decodedUser) => {
        if (err) {
          console.error(err);
          return res
            .status(403)
            .json({ message: "Access token hết hạn hoặc không hợp lệ" });
        }

        // Tìm User trong database
        const user = await User.findById(decodedUser.userId).select(
          "-hashedPassword",
        );
        if (!user) {
          return res.status(404).json({ message: "Người dùng không tồn tại." });
        }

        // Trả User về trong req
        req.user = user;
        next();
      },
    );
  } catch (error) {
    console.error("Lỗi khi xác minh JWT trong authMiddleware", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
