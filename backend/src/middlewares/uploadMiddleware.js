import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

export const upload = multer({
  storage: multer.memoryStorage(), // Lưu file dưới dạng buffer (dữ liệu thô), trong bộ nhớ RAM, thay vì lưu file ở ổ cứng của máy chủ
  limits: {
    fileSize: 1024 * 1024 * 1, // 1MB  // Giới hạn kích thước file
  },
});

export const uploadImageFromBuffer = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "moji_chat/avatars", // Folder chứa ảnh trên Cloudinary
        resource_type: "image",
        transformation: [{ width: 200, height: 200, crop: "fill" }], // Chuyển đổi ảnh
        ...options, // Các tùy chọn khác
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );
    uploadStream.end(buffer);
  });
};
