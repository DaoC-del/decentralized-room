import { Server, Socket } from "socket.io";

export interface User {
  id: string;
  name: string;
  status: string;
}

// 用户事件处理器
export const registerUserEvents = (io: Server, socket: Socket, users: Record<string, User>) => {
  // 用户上线事件
  socket.on("user_online", (user: User) => {
    console.log(user)
    console.log(users)
    users[socket.id] = user;
    io.emit("update_users", Object.values(users));
  });

  // 用户状态更新事件
  socket.on("user_status_update", (updatedUser: User) => {
    if (users[socket.id]) {
      users[socket.id] = updatedUser;
      io.emit("user_status_update", updatedUser);
      io.emit("update_users", Object.values(users));
    }
  });

  // 用户断开事件
  socket.on("disconnect", () => {
    if (users[socket.id]) {
      delete users[socket.id];
      io.emit("update_users", Object.values(users));
    }
  });
};
