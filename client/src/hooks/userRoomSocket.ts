import { useEffect, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";
import socket from "../utils/socket";
import {
  DEFAULT_USER,
  RoomState, RoomAction, User,
  UserActivityKey,
} from "../config/userConfig";

// 定义 Reducer 函数，管理房间状态更新
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

// 自定义 Hook，管理房间的 WebSocket 连接和状态
export const useRoomSocket = () => {
  // 使用 useReducer 管理房间状态
  const [state, dispatch] = useReducer<React.Reducer<RoomState, RoomAction>>(
    roomReducer,
    {
      users: [],
      currentUser: {
        id: uuidv4(),
        name: `User_${uuidv4().slice(0, 5)}`,
        status: DEFAULT_USER.status,
        activityStatus: DEFAULT_USER.activityStatus,
      },
    }
  );

  // 初始化 WebSocket 连接
  useEffect(() => {
    socket.connect();
    socket.emit("user_online", state.currentUser);

    // 接收用户更新事件
    socket.on("update_users", (users: User[]) => {
      dispatch({ type: "UPDATE_USERS", payload: users });
    });

    // 接收用户状态更新事件
    socket.on("user_status_update", (updatedUser: User) => {
      dispatch({ type: "UPDATE_USER_STATUS", payload: updatedUser });
    });

    // 清理事件监听器和断开连接
    return () => {
      socket.disconnect();
      socket.off("update_users");
      socket.off("user_status_update");
    };
  }, [state.currentUser]);

  // 更新用户活动状态函数
  const updateUserActivityStatus = (newActivityStatus: UserActivityKey) => {
    if (!state.currentUser) return;

    const updatedUser = {
      ...state.currentUser,
      activityStatus: newActivityStatus,
    };

    console.log("Updated User:", updatedUser);

    // 更新当前用户状态并通知服务器
    dispatch({ type: "SET_CURRENT_USER", payload: updatedUser });
    socket.emit("user_status_update", updatedUser);
  };

  return { ...state, updateUserActivityStatus };
};
