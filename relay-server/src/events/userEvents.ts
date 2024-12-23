import { Server, Socket } from "socket.io";

export interface User {
  id: string;
  name: string;
  status: "online" | "offline";
}

// 在线用户字典
type Users = Record<string, User>;

// 注册用户事件
export const registerUserEvents = (io: Server, socket: Socket, users: Users) => {
  // 用户上线事件
  socket.on("user_online", (user: User) => {
    console.log(`[INFO] 用户上线: ${JSON.stringify(user)}`);
    users[socket.id] = user;
    io.emit("update_users", Object.values(users)); // 广播用户列表更新
  });

  // 用户状态更新事件
  socket.on("user_status_update", (updatedUser: User) => {
    if (users[socket.id]) {
      console.log(`[INFO] 用户状态更新: ${JSON.stringify(updatedUser)}`);
      users[socket.id] = updatedUser;
      io.emit("user_status_update", updatedUser); // 广播状态更新
      io.emit("update_users", Object.values(users)); // 广播完整用户列表
    }
  });

  // 用户断开事件
  socket.on("disconnect", () => {
    if (users[socket.id]) {
      console.log(`[INFO] 用户断开: ${socket.id}`);
      delete users[socket.id];
      io.emit("update_users", Object.values(users)); // 广播用户列表更新
    }
  });
};
