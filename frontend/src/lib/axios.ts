import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5001/api"
      : "/api",
  withCredentials: true, // Nếu ko có dòng này thì cookie sẽ ko được gửi đi, dẫn đến việc ko thể xác thực người dùng (người dùng bị logOut liên tục)
});

export default api;
