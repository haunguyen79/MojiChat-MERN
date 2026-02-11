import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    hashedPassword: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
      lowercase: true,
    },
    displayName: {
      type: String,
      require: true,
      trim: true,
    },
    avatarUrl: {
      type: String, // Link CDN để hiển thị ảnh đại diện
    },
    avatarId: {
      type: String, // ID ảnh trên dịch vụ lưu trữ ảnh (Cloudinary)
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    phone: {
      type: String,
      sparse: true, // Cho phép null nhưng không được trùng lặp nếu có giá trị
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  },
);

const User = mongoose.model("User", userSchema);
export default User;
