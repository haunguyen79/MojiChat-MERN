import { BrowserRouter, Route, Routes } from "react-router";
import SignInPage from "./pages/SignInPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import ChatAppPage from "./pages/ChatAppPage.jsx";
import { Toaster } from "sonner";
import ProtectedRoute from "./components/auth/ProtectedRoute.js";
import { useThemeStore } from "./stores/useThemeStore.js";
import { useEffect } from "react";
import { useAuthStore } from "./stores/useAuthStore.js";
import { useSocketStore } from "./stores/useSocketStore.js";

function App() {
  const { isDark, setTheme } = useThemeStore();
  const { accessToken } = useAuthStore();
  const { connectSocket, disconnectSocket } = useSocketStore();

  useEffect(() => {
    setTheme(isDark);
  }, [isDark]);

  useEffect(() => {
    if (accessToken) {
      connectSocket();
    }

    return () => disconnectSocket(); // Cleanup function chạy trước khi component unmount
  }, [accessToken]);

  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/**Public routes */}
          <Route path="/signin" element={<SignInPage />} />

          <Route path="/signup" element={<SignUpPage />} />

          {/**Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<ChatAppPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
