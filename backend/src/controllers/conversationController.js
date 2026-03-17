import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

export const createConversation = async (req, res) => {
  try {
    const { type, name, memberIds } = req.body;
    const userId = req.user._id;

    if (
      !type ||
      (type === "group" && !name) ||
      !memberIds ||
      !Array.isArray(memberIds) ||
      memberIds.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Tên nhóm và danh sách thành viên là bắt buộc" });
    }

    let conversation;

    if (type === "direct") {
      const participantId = memberIds[0];

      conversation = await Conversation.findOne({
        type: "direct",
        "participants.userId": { $all: [userId, participantId] }, // $all: [userId, participantId] có nghĩa là tìm cuộc trò chuyện trực tiếp giữa 2 người dùng này
      });

      if (!conversation) {
        conversation = new Conversation({
          type: "direct",
          participants: [{ userId }, { userId: participantId }],
          lastMessageAt: new Date(),
        });

        await conversation.save(); // Lưu cuộc trò chuyện vào database
      }
    }

    if (type === "group") {
      conversation = new Conversation({
        type: "group",
        participants: [{ userId }, ...memberIds.map((id) => ({ userId: id }))],
        group: {
          name,
          createdBy: userId,
        },
        lastMessageAt: new Date(),
      });

      await conversation.save();
    }

    if (!conversation) {
      return res
        .status(400)
        .json({ message: "Conversation type không hợp lệ!" });
    }

    await conversation.populate([
      {
        path: "participants.userId",
        select: "displayName avatarUrl",
      },
      {
        path: "seenBy",
        select: "displayName avatarUrl",
      },
      {
        path: "lastMessage.senderId",
        select: "displayName avatarUrl",
      },
    ]);

    return res.status(201).json({ conversation });
  } catch (error) {
    console.error("Lỗi khi tạo conversation", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const getConversation = async (req, res) => {
  try {
    const userId = req.user._id;
    const conversations = await Conversation.find({
      "participants.userId": userId,
    })
      .sort({ lastMessageAt: -1, updatedAt: -1 })
      .populate({
        path: "participants.userId",
        select: "displayName avatarUrl",
      })
      .populate({
        path: "lastMessage.senderId",
        select: "displayName avatarUrl",
      })
      .populate({
        path: "seenBy",
        select: "displayName avatarUrl",
      });

    const formatted = conversations.map((convo) => {
      const participants = (convo.participants || []).map((p) => ({
        _id: p.userId?._id,
        displayName: p.userId?.displayName,
        avatarUrl: p.userId?.avatarUrl ?? null,
        joinedAt: p.joinedAt,
      }));

      return {
        ...convo.toObject(), // Chuyển đổi Mongoose document thành object JS thuần để có thể thêm thuộc tính mới
        unreadCounts: convo.unreadCounts || {},
        participants,
      };
    });

    return res.status(200).json({ conversations: formatted });
  } catch (error) {
    console.error(
      "Lỗi xảy ra khi lấy conversations (danh sách cuộc trò chuyện): ",
      error,
    );
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { limit = 50, cursor } = req.query;

    /** 
    /conversations/${conversationId}/messages?limit=${pageLimit}&cursor=${cursor}
     */

    const query = { conversationId };

    if (cursor) {
      query._id = { $lt: new Date(cursor) }; // Lấy các tin nhắn có _id nhỏ hơn cursor (tức là các tin nhắn cũ hơn)
    }

    let messages = await Message.find(query)
      .sort({ createdAt: -1 }) // Sắp xếp theo createdAt giảm dần để lấy tin nhắn mới nhất trước
      .limit(Number(limit) + 1); // Lấy thêm 1 tin nhắn để kiểm tra xem còn tin nhắn nào nữa hay không

    let nextCursor = null;

    if (messages.length > Number(limit)) {
      const nextMessage = messages[messages.length - 1]; // Tin nhắn cuối cùng trong danh sách (tin nhắn cũ nhất)

      nextCursor = nextMessage._id; // Sử dụng _id của tin nhắn cuối cùng làm cursor cho lần truy vấn tiếp theo

      messages.pop(); // Loại bỏ tin nhắn cuối cùng khỏi kết quả trả về vì nó chỉ dùng để kiểm tra xem còn tin nhắn nào nữa hay không
    }

    messages = await messages.reverse(); // Đảo ngược thứ tự tin nhắn để trả về theo thứ tự từ cũ đến mới

    return res.status(200).json({ messages, nextCursor });
  } catch (error) {
    console.error("Lỗi xảy ra khi lấy messages", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const getUserConversationsForSocketIO = async (userId) => {
  try {
    const conversations = await Conversation.find(
      {
        "participants.userId": userId,
      },
      { _id: 1 },
    );

    return conversations.map((c) => c._id.toString());
  } catch (error) {
    console.error("Lỗi xảy ra khi fetch conversations: ", error);
    return [];
  }
};
