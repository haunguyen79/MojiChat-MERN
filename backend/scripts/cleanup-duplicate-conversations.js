/**
 * cleanup-duplicate-conversations.js
 *
 * Script dọn dẹp một lần — gộp các Conversation "direct" trùng lặp
 * (cùng 2 participant) thành 1 conversation duy nhất.
 *
 * Cách chạy:
 *   node --env-file=.env scripts/cleanup-duplicate-conversations.js
 *
 * Hoặc nếu dùng dotenv: (từ thư mục backend/)
 *   node -r dotenv/config scripts/cleanup-duplicate-conversations.js
 */

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_CONNECTIONSTRING;
if (!MONGODB_URI) {
  console.error("❌ Thiếu biến môi trường MONGODB_CONNECTIONSTRING");
  process.exit(1);
}

await mongoose.connect(MONGODB_URI);
console.log("✅ Kết nối MongoDB thành công");

const db = mongoose.connection.db;
const conversationsCol = db.collection("conversations");
const messagesCol = db.collection("messages");

// Lấy tất cả conversation direct
const directConvos = await conversationsCol
  .find({ type: "direct" })
  .toArray();

console.log(`📋 Tổng số conversation direct: ${directConvos.length}`);

// Nhóm theo cặp participant (dùng sorted user IDs làm key)
const groups = new Map();

for (const convo of directConvos) {
  const ids = (convo.participants || [])
    .map((p) => p.userId?.toString())
    .filter(Boolean)
    .sort()
    .join("_");

  if (!ids) continue;

  if (!groups.has(ids)) {
    groups.set(ids, []);
  }
  groups.get(ids).push(convo);
}

let totalMerged = 0;
let totalDeleted = 0;

for (const [key, convos] of groups.entries()) {
  if (convos.length <= 1) continue; // Không có duplicate

  console.log(`\n🔁 Cặp user [${key}] có ${convos.length} conversations trùng:`);
  convos.forEach((c) =>
    console.log(`   - _id: ${c._id}  lastMessageAt: ${c.lastMessageAt}`)
  );

  // Giữ lại conversation có lastMessageAt MỚI NHẤT (hoặc cũ nhất nếu muốn)
  const sorted = convos.sort(
    (a, b) => new Date(b.lastMessageAt ?? 0) - new Date(a.lastMessageAt ?? 0)
  );
  const keeper = sorted[0];
  const duplicates = sorted.slice(1);

  console.log(`   ✅ Giữ lại: ${keeper._id}`);
  console.log(
    `   🗑️  Xóa và dời messages: ${duplicates.map((d) => d._id).join(", ")}`
  );

  for (const dup of duplicates) {
    // Cập nhật conversationId của tất cả messages trong conversation trùng
    const result = await messagesCol.updateMany(
      { conversationId: dup._id },
      { $set: { conversationId: keeper._id } }
    );
    console.log(
      `   📨 Đã dời ${result.modifiedCount} messages từ ${dup._id} → ${keeper._id}`
    );
    totalMerged += result.modifiedCount;

    // Xóa conversation trùng
    await conversationsCol.deleteOne({ _id: dup._id });
    totalDeleted++;
    console.log(`   🗑️  Đã xóa conversation ${dup._id}`);
  }

  // Cập nhật unreadCounts: cộng dồn từ các conversation bị xóa vào keeper
  let mergedUnreadCounts = { ...(keeper.unreadCounts ?? {}) };
  for (const dup of duplicates) {
    for (const [userId, count] of Object.entries(dup.unreadCounts ?? {})) {
      mergedUnreadCounts[userId] = (mergedUnreadCounts[userId] ?? 0) + count;
    }
  }
  await conversationsCol.updateOne(
    { _id: keeper._id },
    { $set: { unreadCounts: mergedUnreadCounts } }
  );
}

console.log(`\n✅ Hoàn thành!`);
console.log(`   Đã dời tổng cộng ${totalMerged} messages`);
console.log(`   Đã xóa ${totalDeleted} conversation trùng lặp`);

await mongoose.disconnect();
process.exit(0);
