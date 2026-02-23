import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Tạo index để tối ưu truy vấn theo userId
    },
    refreshToken: {
      type: String,
      required: true,
      unique: true, // Đảm bảo mỗi refresh token là duy nhất
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },

  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  },
);

// Tạo TTL index để tự động xóa session khi expiresAt đến hạn
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Session", sessionSchema);
