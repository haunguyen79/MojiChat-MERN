import { useAuthStore } from "@/stores/useAuthStore";
import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5001/api"
      : "/api",
  withCredentials: true, // Nếu ko có dòng này thì cookie sẽ ko được gửi đi, dẫn đến việc ko thể xác thực người dùng (người dùng bị logOut liên tục)
});

/// Interceptor để tự động GẮN thêm accessToken vào header của mỗi request
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState(); // Lấy accessToken từ Zustand store tại thời điểm request được gửi đi
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Interceptor để tự động XỬ LÝ lỗi 401 Unauthorized (khi accessToken hết hạn hoặc không hợp lệ)
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config; // Lưu lại request gốc để có thể retry sau khi refresh token thành công

    // Những API không cần check accessToken (signup, signin, refresh) thì sẽ ko bị rơi vào vòng lặp vô hạn khi refresh token thất bại
    if (
      originalRequest.url.includes("/auth/signup") ||
      originalRequest.url.includes("/auth/signin") ||
      originalRequest.url.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retryCount = originalRequest._retryCount || 0;
    if (error.response?.status === 403 && originalRequest._retryCount < 4) {
      originalRequest._retryCount += 1;

      console.log("refresh", originalRequest._retryCount);

      try {
        const res = await api.post("/auth/refresh", { withCredentials: true });
        const newAccessToken = res.data.accessToken;

        useAuthStore.getState().setAccessToken(newAccessToken); // Cập nhật accessToken mới vào store

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`; // Gắn accessToken mới vào header của request gốc

        return api(originalRequest); // Retry lại request gốc với accessToken mới
      } catch (refreshError) {
        useAuthStore.getState().clearState(); // Nếu refresh token cũng thất bại, clear toàn bộ state (đưa user về trạng thái chưa đăng nhập)
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
