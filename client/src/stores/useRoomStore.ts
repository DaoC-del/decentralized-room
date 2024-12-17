// Zustand 导入
import { createStore } from "zustand/vanilla";
import { useStore } from "zustand";
import { User, RoomState } from "../config/userConfig";

// 定义房间动作接口
interface RoomActions {
  setUsers: (users: User[]) => void;
  setCurrentUser: (user: User | null) => void;
}

// 创建 Zustand Vanilla Store
export const roomStore = createStore<RoomState & RoomActions>((set) => ({
  users: [],
  currentUser: null,

  // 设置用户列表
  setUsers: (users) => set({ users }),

  // 设置当前用户
  setCurrentUser: (user) => set({ currentUser: user }),
}));

// 导出用于 React 的 Hook
export const useRoomStore = () => useStore(roomStore);
