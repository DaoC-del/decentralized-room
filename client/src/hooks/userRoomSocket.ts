import { useEffect } from "react";
import socket from "../utils/socket";
import { useRoomStore } from "../stores/useRoomStore";
import { User, UserActivityKey } from "../config/userConfig";

// 工具函数：合并用户列表并保持顺序
const mergeUsers = (currentUsers: User[], incomingUsers: User[]): User[] => {
  const userMap = new Map(incomingUsers.map((user) => [user.id, user]));

  // 更新现有用户
  const updatedUsers = currentUsers.map((user) =>
    userMap.get(user.id) || user
  );

  // 添加新用户
  incomingUsers.forEach((user) => {
    if (!updatedUsers.some((u) => u.id === user.id)) {
      updatedUsers.push(user);
    }
  });

  return updatedUsers;
};

export const useRoomSocket = () => {
  const { setUsers, setCurrentUser, currentUser, getUsers } = useRoomStore();

  useEffect(() => {
    socket.connect();

    // 通知服务器当前用户上线
    socket.emit("user_online", currentUser);

    // 监听用户更新
    socket.on("update_users", (incomingUsers: User[]) => {
      console.log("[DEBUG] 接收到的用户列表:", incomingUsers);

      const currentUsers = getUsers();
      const updatedUsers = mergeUsers(currentUsers, incomingUsers);
      console.log("[DEBUG] 合并后的用户列表:", updatedUsers);

      setUsers(updatedUsers); // 更新 Store 中的用户列表
    });

    // 监听用户状态更新
    socket.on("user_status_update", (updatedUser: User) => {
      console.log("[DEBUG] 接收到的用户状态更新:", updatedUser);

      const currentUsers = getUsers();
      const updatedUsers = currentUsers.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      );

      console.log("[DEBUG] 更新后的用户状态:", updatedUsers);
      setUsers(updatedUsers); // 更新 Store 中的用户列表
    });

    // 清理事件监听器
    return () => {
      socket.disconnect();
      socket.off("update_users");
      socket.off("user_status_update");
    };
  }, [currentUser, setUsers, getUsers]);

  // 更新用户活动状态
  const updateUserActivityStatus = (newActivityStatus: UserActivityKey) => {
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      activityStatus: newActivityStatus,
    };
    setCurrentUser(updatedUser);
    const currentUsers = getUsers();
    const updatedUsers = currentUsers.map((user) =>
      user.id === updatedUser.id ? updatedUser : user
    );

    console.log("[DEBUG] 更新当前用户的活动状态:", updatedUsers);
    setUsers(updatedUsers); // 更新 Store 中的用户列表

    socket.emit("user_status_update", updatedUser); // 通知服务器
  };

  return { getUsers,currentUser, updateUserActivityStatus };
};
