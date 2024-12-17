import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { registerUserEvents,User } from "./events/userEvents";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

const users: Record<string, User> = {};

// 注册连接事件
io.on("connection", (socket) => {
  console.log(`[INFO] New connection: ${socket.id}`);
  registerUserEvents(io, socket, users);
});

// 启动服务器
httpServer.listen(3001, () => {
  console.log("[INFO] Server running on http://localhost:3001");
});
