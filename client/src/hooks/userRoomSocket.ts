import { useEffect } from "react";
import socket from "../utils/socket";
import { useRoomStore } from "../stores/useRoomStore";
import { User, UserActivityKey } from "../config/userConfig";

export const useRoomSocket = () => {
  const { setUsers, setCurrentUser, currentUser,getUsers } = useRoomStore();

  useEffect(() => {
    socket.connect();

    // 通知服务器当前用户上线
    socket.emit("user_online", currentUser);

    // 监听用户更新
    socket.on("update_users", (users: User[]) => {
      setUsers(users);
    });
    socket.on("user_status_update", (updatedUser: User) => {
      const currentUsers = getUsers();
      const updatedUsers = currentUsers.map((user:User) =>
        user.id === updatedUser.id ? updatedUser : user
      );
      setUsers(updatedUsers);
    });

    // 清理事件监听器
    return () => {
      socket.disconnect();
      socket.off("update_users");
      socket.off("user_status_update");
    };
  }, [currentUser, getUsers, setUsers]);

  // 更新用户活动状态
  const updateUserActivityStatus = (newActivityStatus: UserActivityKey) => {
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      activityStatus: newActivityStatus,
    };

    setCurrentUser(updatedUser);
    socket.emit("user_status_update", updatedUser);
  };

  return { updateUserActivityStatus };
};
