import { io } from 'socket.io-client';

// 使用 Codespaces 提供的公开地址
const socket = io('https://symmetrical-space-xylophone-jvjrxrg4vfqgw6-3001.app.github.dev');
// 暴露到全局 window 对象上，便于调试
if (typeof window !== 'undefined') {
    (window as any).socket = socket;
  }
export default socket;
