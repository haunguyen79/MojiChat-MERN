import React from "react";
import Logout from "../components/auth/logout";
import { useAuthStore } from "../stores/useAuthStore.ts";

const ChatAppPage = () => {
  const user = useAuthStore((s) => s.user);
  return (
    <div>
      {user?.username}
      <Logout />
    </div>
  );
};

export default ChatAppPage;
