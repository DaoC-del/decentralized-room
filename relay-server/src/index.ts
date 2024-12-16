import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*', // 允许所有来源的跨域请求
    methods: ['GET', 'POST'],
  },
});

// 在线用户列表
interface User {
  id: string;
  name: string;
  status: 'online' | 'offline';
}

const users: Record<string, User> = {};

// HTTP 根路由
app.get('/', (req, res) => {
  res.send('Relay server is running.');
});

io.on("connection", (socket) => {
  console.log(`[DEBUG] New connection: ${socket.id}`);

  // 用户上线
  socket.on("user_online", (user) => {
    console.log("online")
    users[socket.id] = user;
    io.emit("update_users", Object.values(users));
  });

  // 用户状态更新
  socket.on("user_status_update", (updatedUser) => {
    if (users[socket.id]) {
      users[socket.id] = updatedUser;
      io.emit("user_status_update", updatedUser); // 广播状态更新
      io.emit("update_users", Object.values(users)); // 广播完整用户列表
    }
  });

  // 用户断开连接
  socket.on("disconnect", () => {
    if (users[socket.id]) {
      delete users[socket.id];
      io.emit("update_users", Object.values(users));
    }
  });
});



// 启动服务器
httpServer.listen(3001, '0.0.0.0', () => {
  console.log(`[INFO] Relay server is running on http://localhost:3001`);
});
