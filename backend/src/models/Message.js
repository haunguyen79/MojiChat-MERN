import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      trim: true,
    },
    imgUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

messageSchema.index({ conversationId: 1, createdAt: -1 }); /* Khi truy vấn tin nhắn của 1 hội thoại, những tin nhắn có cùng conversationId sẽ được lưu trữ gần nhau từ mới đến cũ, giúp tăng tốc độ truy vấn. */

const MessageSchema = mongoose.model("Message", messageSchema);

export default MessageSchema;
