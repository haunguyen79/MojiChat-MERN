import Conversation from "../models/Conversation.js";
import Friend from "../models/Friend.js";

const pair = (a, b) => (a < b ? [a, b] : [b, a]);

export const checkFriendship = async (req, res, next) => {
  try {
    const me = req.user._id.toString();

    const recipientId = req.body?.recipientId ?? null;

    const memberIds = req.body?.memberIds ?? []; // Chỉ là bạn bè mới được thêm vào nhóm và ko tạo group với người lạ

    if (!recipientId && memberIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Cần cung cấp recipientId hoặc memberIds" });
    }

    if (recipientId) {
      const [userA, userB] = pair(me, recipientId);

      const isFriend = await Friend.findOne({ userA, userB });

      if (!isFriend) {
        return res
          .status(403)
          .json({ message: "Bạn chưa kết bạn với người này" });
      }
      return next();
    }

    /*todo: chat group*/
    // Kiểm tra xem tất cả các thành viên trong memberIds có phải là bạn bè của người tạo không

    const friendChecks = memberIds.map(async (memberId) => {
      const [userA, userB] = pair(me, memberId);
      const friend = await Friend.findOne({ userA, userB });
      return friend ? null : memberId;
    });

    const results = await Promise.all(friendChecks); // Promise.all() sẽ đợi tất cả các truy vấn được giải quyết

    const notFriends = results.filter(Boolean); // Lọc ra các thành viên không phải là bạn bè

    if (notFriends.length > 0) {
      return res
        .status(403)
        .json({ message: "Bạn chỉ có thể thêm bạn bè vào nhóm", notFriends });
    }

    return next();
  } catch (error) {
    console.error("Lỗi xảy ra khi checkFriendship:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const checkGroupMembership = async (req, res, next) => {
  try {
    const { conversationId } = req.body;
    const userId = req.user._id;

    const conversation = await Conversation.findById(conversationId);

    if (!conversationId) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy cuộc trò chuyện" });
    }

    const isMember = conversation.participants.some(
      (p) => p.userId.toString() === userId.toString(),
    );

    if (!isMember) {
      return res.status(403).json({ message: "Bạn không ở trong group này." });
    }

    req.conversation = conversation; // Lưu thông tin cuộc trò chuyện vào req để controller có thể sử dụng

    next();
  } catch (error) {
    console.error("Lỗi xảy ra khi checkConversationMembership:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
