import React from "react";
import { Space, Button } from "antd";
import {
  ACTIVITY_STATUS,
  UserActivityKey,
} from "../config/userConfig";

// 状态选择器组件属性定义
interface StatusSelectorProps {
  currentActivityStatus: UserActivityKey;
  onActivityStatusChange: (newActivity: UserActivityKey) => void;
}

const StatusSelector: React.FC<StatusSelectorProps> = ({
  currentActivityStatus,
  onActivityStatusChange,
}) => {
  return (
    <Space>
      {Object.entries(ACTIVITY_STATUS).map(([key, label]) => (
        <Button
          key={key}
          type={currentActivityStatus === key ? "primary" : "default"}
          onClick={() => onActivityStatusChange(key as UserActivityKey)}
        >
          {label}
        </Button>
      ))}
    </Space>
  );
};

export default StatusSelector;
