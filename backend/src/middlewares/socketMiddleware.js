import jwt from "jsonwebtoken";
import User from "../models/User.js";

// export const socketAuthMiddleware = async (socket, next) => {
//   try {
//     const token = socket.handshake.auth.token;
//     if (!token) {
//       return next(new Error("Không tìm thấy access token"));
//     }

//     jwt.verify(
//       token,
//       process.env.ACCESS_TOKEN_SECRET,
//       async (err, decodedUser) => {
//         if (err) {
//           return next(new Error("Access token hết hạn hoặc không hợp lệ"));
//         }

//         const user = await User.findById(decodedUser.userId).select(
//           "-hashedPassword",
//         );
//         if (!user) {
//           return next(new Error("Người dùng không tồn tại"));
//         }

//         socket.user = user;
//         next();
//       },
//     );
//   } catch (error) {
//     console.error("Lỗi khi xác minh JWT trong socketMiddleware", error);
//     return next(new Error("Lỗi hệ thống"));
//   }
// };

export const socketAuthMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Unauthorized - Token không tồn tại!"));
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded) {
      return next(
        new Error("Unauthorized - Token không hợp lệ hoặc đã hết hạn!"),
      );
    }

    const user = await User.findById(decoded.userId).select("-hashedPassword");
    if (!user) {
      return next(new Error("User không tồn tại!"));
    }

    socket.user = user;
    next();
  } catch (error) {
    console.error("Lỗi khi verify JWT trong socketMiddleware", error);
    return next(new Error("Unauthorized"));
  }
};
