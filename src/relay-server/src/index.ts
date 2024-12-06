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

// WebSocket 连接处理
io.on('connection', (socket) => {
  console.log(`[DEBUG] New connection established: Socket ID ${socket.id}`);

  // 调试：打印当前连接的所有 socket
  console.log(`[DEBUG] Total connected sockets: ${Object.keys(io.sockets.sockets).length}`);

  // 用户上线事件
  socket.on('user_online', (user: User) => {
    console.log(`[DEBUG] Received user_online from ${socket.id}:`, user);

    // 添加用户到列表
    users[socket.id] = user;
    user.status = 'online';

    // 广播所有用户信息
    io.emit('update_users', Object.values(users));
    console.log(`[DEBUG] Broadcasting update_users:`, Object.values(users));
  });

  // 用户断开连接
  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
      console.log(`[DEBUG] User disconnected:`, user);

      // 将用户状态设置为离线并广播更新
      user.status = 'offline';
      delete users[socket.id];
      io.emit('update_users', Object.values(users));
      console.log(`[DEBUG] Broadcasting update_users after disconnect:`, Object.values(users));
    } else {
      console.log(`[DEBUG] Unregistered user disconnected: Socket ID ${socket.id}`);
    }

    // 调试：打印剩余连接的 socket 数量
    console.log(`[DEBUG] Remaining connected sockets: ${Object.keys(io.sockets.sockets).length}`);
  });

  // 调试：打印未知事件
  socket.onAny((event, ...args) => {
    console.log(`[DEBUG] Event received: ${event}`, args);
  });
});

// 启动服务器
httpServer.listen(3001, '0.0.0.0', () => {
  console.log(`[INFO] Relay server is running on http://localhost:3001`);
});
