import { createStore } from "zustand/vanilla";
import { useStore } from "zustand";
import { User, RoomState, DEFAULT_USER } from "../config/userConfig";
import { v4 as uuidv4 } from "uuid";

// 定义房间动作接口
interface RoomActions {
  setUsers: (users: User[]) => void; // 设置完整的用户列表
  setCurrentUser: (user: User | null) => void; // 设置当前用户
  getUsers: () => User[]; // 获取当前用户列表
}

// 初始化用户
const initialUser: User = {
  id: uuidv4(),
  name: `User_${uuidv4().slice(0, 5)}`,
  status: DEFAULT_USER.status,
  activityStatus: DEFAULT_USER.activityStatus,
};

// 创建 Zustand Store
export const roomStore = createStore<RoomState & RoomActions>((set, get) => ({
  users: [],
  currentUser: initialUser,

  // 简单的 setter
  setUsers: (users: User[]) => set({ users }),

  // 设置当前用户
  setCurrentUser: (user: User | null) => set({ currentUser: user }),

  // 获取当前用户列表
  getUsers: () => get().users,
}));

// 导出用于 React 的 Hook
export const useRoomStore = () => useStore(roomStore);
