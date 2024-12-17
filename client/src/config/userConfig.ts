// 用户状态配置
export const USER_STATUS = {
  ONLINE: "在线",
  OFFLINE: "离线",
  BUSY: "忙碌",
  INVISIBLE: "隐身",
  AVAILABLE: "求草",
} as const;

// 自动推断键类型
export type UserStatusKey = keyof typeof USER_STATUS;

// 当前活动状态配置
export const ACTIVITY_STATUS = {
  WORK: "工作",
  SLEEP: "睡觉",
  STUDY: "学习",
  ENTERTAINMENT: "娱乐",
} as const;

// 自动推断活动状态类型
export type UserActivityKey = keyof typeof ACTIVITY_STATUS;

// 用户角色配置（未来扩展）
export const USER_ROLES = {
  ADMIN: "管理员",
  USER: "用户",
} as const;

// 自动推断角色类型
export type UserRoleKey = keyof typeof USER_ROLES;

// 用户对象定义
export interface User {
  id: string;
  name: string;
  status: UserStatusKey;
  activityStatus: UserActivityKey;
}

// 房间状态定义
export type RoomState = {
  users: User[];
  currentUser: User | null;
};

// 房间操作定义
export type RoomAction =
  | { type: "SET_CURRENT_USER"; payload: User }
  | { type: "UPDATE_USERS"; payload: User[] }
  | { type: "UPDATE_USER_STATUS"; payload: User };

// 修复默认用户设置
export const DEFAULT_USER: Pick<User, "status" | "activityStatus"> = {
  status: "ONLINE",
  activityStatus: "WORK", // 修正键名
};
