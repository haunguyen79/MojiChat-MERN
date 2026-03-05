import bcrypt from "bcrypt";
import User from "../models/User.js";
import Session from "../models/Session.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const ACCESS_TOKEN_TTL = "30m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 ngày (Tính theo mili giây)

export const signUp = async (req, res) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;

    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(400).json({
        message:
          "Không thể thiếu username, password, email, firstName và lastName",
      });
    }

    // Kiểm tra xem người dùng (username) đã tồn tại chưa
    const duplicate = await User.findOne({ username });

    if (duplicate) {
      return res.status(409).json({ message: "username đã tồn tại" });
    }

    // Mã hóa password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới và lưu vào database
    await User.create({
      username,
      hashedPassword,
      email,
      displayName: `${firstName} ${lastName}`,
    });

    // Trả về phản hồi thành công
    return res.sendStatus(204);
  } catch (error) {
    console.error("Lỗi khi gọi signUp:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const signIn = async (req, res) => {
  try {
    // Lấy inputs
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message:
          "Thiếu username hoặc password. Vui lòng cung cấp đầy đủ thông tin.",
      });
    }

    // Lấy hashedPassword từ database để so sánh với password người dùng nhập vào
    const user = await User.findOne({ username });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Username hoặc password không chính xác." });
    }

    // Kiểm tra password có khớp với hashedPassword không
    const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordCorrect) {
      return res
        .status(401)
        .json({ message: "Username hoặc password không chính xác." });
    }

    // Nếu khớp, tạo accessToken với JWT
    const accessToken = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL },
    );

    // Tạo refresh token
    const refreshToken = crypto.randomBytes(64).toString("hex");

    // Tạo Session mới để lưu refresh token
    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL), // Đặt thời gian hết hạn cho refresh token
    });

    // Trả refreshToken về client qua cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Chỉ cho phép truy cập cookie từ server
      secure: true, // Chỉ gửi cookie qua HTTPS trong môi trường production
      sameSite: "none", // Backend và Frontend deploy riêng
      maxAge: REFRESH_TOKEN_TTL, // Tgian tồn tại của cookie (14 ngày)
    });

    // Trả accessToken về client qua response body
    return res.status(200).json({
      message: `User ${user.displayName} đăng nhập thành công`,
      accessToken,
    });
  } catch (error) {
    console.error("Lỗi khi gọi signIn:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const signOut = async (req, res) => {
  try {
    // Lấy refreshToken từ cookie
    const token = req.cookies?.refreshToken;

    if (token) {
      //  Xóa refresh token trong Session
      await Session.deleteOne({ refreshToken: token });

      // Xóa cookie refreshToken trên client
      res.clearCookie("refreshToken");
    }
    return res.sendStatus(204); // Trả về 204 No Content cho cả trường hợp có token và không có token
  } catch (error) {
    console.error("Lỗi khi gọi signOut:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Tạo accessToken mới từ refreshToken
export const refreshToken = async (req, res) => {
  try {
    // Lấy refreshToken từ cookie
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "Token không tồn tại!" });
    }
    // So sánh với refreshToken trong Database
    const session = await Session.findOne({ refreshToken: token });

    if (!session) {
      return res
        .status(403)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
    }
    // Kiểm tra refreshToken hết hạn chưa
    if (session.expiresAt < new Date()) {
      return res.status(403).json({ message: "Token đã hết hạn!" });
    }
    // Tạo accessToken mới
    const accessToken = jwt.sign(
      { userId: session.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL },
    );

    // Return accessToken mới về client
    return res.status(200).json({ accessToken });
    
  } catch (error) {
    console.error("Lỗi khi gọi refreshToken:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
