import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      maxlength: 300,
    },
  },
  {
    timestamps: true, // Tự động thêm trường createdAt và updatedAt
  },
);

friendRequestSchema.index({ from: 1, to: 1 }, { unique: true }); // Đảm bảo rằng mỗi cặp yêu cầu kết bạn chỉ tồn tại một lần trong cơ sở dữ liệu.

friendRequestSchema.index({ from: 1 }); // Truy vấn nhanh các lời mời kết bạn đã gửi
friendRequestSchema.index({ to: 1 }); // Truy vấn nhanh các lời mời kết bạn đã nhận

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);

export default FriendRequest;
