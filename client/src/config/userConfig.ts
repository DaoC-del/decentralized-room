// 用户状态配置
export const USER_STATUS = {
  ONLINE: "在线",
  OFFLINE: "离线",
  BUSY: "忙碌",
  INVISIBLE: "隐身",
  AVAILABLE: "随时找我",
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

// 默认用户设置
export const DEFAULT_USER = {
  status: "ONLINE" as UserStatusKey,
  activityState: "WORK" as keyof typeof ACTIVITY_STATUS, // 工作
} as const;
