import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";
import { persist } from "zustand/middleware";
import { useChatStore } from "./useChatStore";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      loading: false,

      setAccessToken: (accessToken) => {
        set({ accessToken });
      },

      clearState: () => {
        set({ accessToken: null, user: null, loading: false });
        localStorage.clear(); // Xóa toàn bộ localStorage để đảm bảo không còn dữ liệu nào liên quan đến phiên làm việc cũ

        useChatStore.getState().reset(); // Reset chat store để xóa toàn bộ dữ liệu liên quan đến chat của phiên làm việc cũ
      },

      signUp: async (username, password, email, firstName, lastName) => {
        try {
          set({ loading: true });
          // Call API
          await authService.signUp(
            username,
            password,
            email,
            firstName,
            lastName,
          );

          toast.success(
            "Đăng ký thành công! Bạn sẽ được chuyển sang trang đăng nhập",
          );
        } catch (error) {
          console.error(error);
          toast.error("Đăng ký không thành công");
        } finally {
          set({ loading: false });
        }
      },

      signIn: async (username, password) => {
        try {
          set({ loading: true });

          localStorage.clear(); // Xóa toàn bộ localStorage trước khi đăng nhập để đảm bảo không còn dữ liệu nào liên quan đến phiên làm việc cũ

          useChatStore.getState().reset(); // Reset chat store để xóa toàn bộ dữ liệu liên quan đến chat của phiên làm việc cũ

          const { accessToken } = await authService.signIn(username, password);
          get().setAccessToken(accessToken);

          await get().fetchMe();  // Gọi API để lấy thông tin người dùng
          useChatStore.getState().fetchConversations(); // Gọi API để lấy danh sách cuộc trò chuyện

          toast.success("Chào mừng bạn đã quay trở lại với Moji 🎉🎉🎉");
          // Call API
        } catch (error) {
          console.error(error);
          toast.error("Đăng nhập không thành công");
        } finally {
          set({ loading: false });
        }
      },

      signOut: async () => {
        try {
          get().clearState();
          await authService.signOut();
          toast.success("Đăng xuất thành công!");
        } catch (error) {
          console.error(error);
          toast.error("Đăng xuất không thành công. Vui lòng thử lại!");
        }
      },

      fetchMe: async () => {
        try {
          set({ loading: true });
          const user = await authService.fetchMe();

          set({ user });
        } catch (error) {
          console.error(error);
          set({ user: null, accessToken: null });
          toast.error("Lỗi xảy ra khi lấy dữ liệu người dùng. Hãy thử lại!");
        } finally {
          set({ loading: false });
        }
      },

      refresh: async () => {
        try {
          set({ loading: true });
          const { user, fetchMe, setAccessToken } = get();
          const accessToken = await authService.refresh();

          setAccessToken(accessToken);

          if (!user) {
            await fetchMe(); // Nếu chưa có thông tin user, gọi fetchMe để lấy thông tin người dùng mới
          }

          // Luôn fetch lại conversations để tránh dùng data cũ từ localStorage cache
          useChatStore.getState().fetchConversations();
        } catch (error) {
          console.error(error);
          toast.error("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại!");
          get().clearState();
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }), // Chỉ lưu thông tin user vào localStorage, không lưu accessToken
    },
  ),
);
