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
  const { accessToken } = useAuthStore.getState(); // Lấy accessToken từ Zustand store tại thời điểm request được gửi đi (dòng code này được chạy thôi)

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default api;
