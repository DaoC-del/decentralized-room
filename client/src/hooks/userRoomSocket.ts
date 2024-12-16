import { useEffect, useReducer, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import socket from "../utils/socket";
import {
  // USER_STATUS,
  // ACTIVITY_STATUS,
  DEFAULT_USER,
  UserStatusKey,
  UserActivityKey,
} from "../config/userConfig";

// 用户接口定义
export interface User {
  id: string;
  name: string;
  status: UserStatusKey;
  activityStatus: UserActivityKey;
}

// 房间状态定义
type RoomState = {
  users: User[];
  currentUser: User | null;
};

// 房间操作定义
type RoomAction =
  | { type: "SET_CURRENT_USER"; payload: User }
  | { type: "UPDATE_USERS"; payload: User[] }
  | { type: "UPDATE_USER_STATUS"; payload: User };

// 状态管理 Reducer
const roomReducer = (state: RoomState, action: RoomAction): RoomState => {
  switch (action.type) {
    case "SET_CURRENT_USER":
      return { ...state, currentUser: action.payload };
    case "UPDATE_USERS":
      return { ...state, users: action.payload };
    case "UPDATE_USER_STATUS":
      return {
        ...state,
        users: state.users.map((user) =>
          user.id === action.payload.id ? action.payload : user
        ),
      };
    default:
      return state;
  }
};

// 自定义 Hook 管理房间状态
export const useRoomSocket = () => {
  const [state, dispatch] = useReducer(roomReducer, {
    users: [],
    currentUser: null,
  });

  // 初始化用户
  const [currentUser] = useState<User>(() => {
    const userId = uuidv4();
    return {
      id: userId,
      name: `User_${userId.slice(0, 5)}`,
      status: DEFAULT_USER.status,
      activityStatus: DEFAULT_USER.activityState,
    };
  });

  // 初始化 WebSocket
  useEffect(() => {
    socket.connect();
    socket.emit("user_online", currentUser);

    socket.on("update_users", (users: User[]) => {
      dispatch({ type: "UPDATE_USERS", payload: users });
    });

    socket.on("user_status_update", (updatedUser: User) => {
      dispatch({ type: "UPDATE_USER_STATUS", payload: updatedUser });
    });

    // 清理事件监听器
    return () => {
      socket.disconnect();
      socket.off("update_users");
      socket.off("user_status_update");
    };
  }, [currentUser]);

  // 更新用户状态
  const updateUserActivityStatus = (newActivityStatus: UserActivityKey) => {
    const updatedUser = { ...currentUser, activityStatus: newActivityStatus };
    dispatch({ type: "SET_CURRENT_USER", payload: updatedUser });
    socket.emit("user_status_update", updatedUser);
  };

  return { ...state, updateUserActivityStatus, currentUser };
};
