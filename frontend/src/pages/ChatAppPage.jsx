import Logout from "../components/auth/logout";
import { useAuthStore } from "../stores/useAuthStore.ts";
import { Button } from "../components/ui/button.tsx";
import { toast } from "sonner";
import api from "../lib/axios.ts";

const ChatAppPage = () => {
  const user = useAuthStore((s) => s.user);

  const handleOnClick = async () => {
    try {
      await api.get("/users/test", { withCredentials: true });
      toast.success("OK");
    } catch (error) {
      toast.error("Thất bại!");
      console.error(error);
    }
  };
  return (
    <div>
      {user?.username}
      <Logout />

      <Button onClick={handleOnClick}>Test</Button>
    </div>
  );
};

export default ChatAppPage;
