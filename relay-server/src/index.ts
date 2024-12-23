import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import { registerUserEvents,User } from "./events/userEvents";

const app = express();
const httpServer = createServer(app);

// 创建 Socket.IO 实例
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// 创建 Redis 客户端
const pubClient = createClient({ url: "redis://localhost:6379" });
const subClient = pubClient.duplicate();

Promise.all([pubClient.connect(), subClient.connect()])
  .then(() => {
    io.adapter(createAdapter(pubClient, subClient));
    console.log("[INFO] Redis 适配器已启用");
  })
  .catch((err) => {
    console.error("[ERROR] Redis 连接失败:", err);
  });

// 在线用户字典
const users: Record<string, User> = {};

// HTTP 路由
app.get("/", (req, res) => {
  res.send("Relay server with Redis is running.");
});

// 注册用户事件
io.on("connection", (socket) => {
  console.log(`[INFO] 新连接: ${socket.id}`);
  registerUserEvents(io, socket, users);
});

// 启动 HTTP 服务器
httpServer.listen(3001, () => {
  console.log("[INFO] 服务器运行在 http://localhost:3001");
});
