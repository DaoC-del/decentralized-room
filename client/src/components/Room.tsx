import React from "react";
import { Layout, List, Avatar, Typography, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import StatusSelector from "./StatusSelector";
import { useRoomSocket } from "../hooks/userRoomSocket";
import { USER_STATUS, ACTIVITY_STATUS, User } from "../config/userConfig";

const { Header, Sider, Content } = Layout;
const { Title, Paragraph } = Typography;

const Room: React.FC = () => {
  // 自定义 Hook，用于管理房间逻辑
  const { users, currentUser, updateUserActivityStatus } = useRoomSocket();

  // 处理用户点击事件
  const handleUserClick = (user: User) => {
    message.info(`已选中用户：${user.name}`);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ color: "#fff", textAlign: "center" }}>
        <Title style={{ color: "#fff", margin: 0 }} level={3}>
          去中心化房间
        </Title>
      </Header>

      <Layout>
        <Sider width={300} style={{ background: "#fff", padding: "16px" }}>
          <Title level={4}>在线用户</Title>
          <List
            itemLayout="horizontal"
            dataSource={users}
            renderItem={(user: User) => (
              <List.Item onClick={() => handleUserClick(user)}>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={`${user.name} (${USER_STATUS[user.status]})`}
                  description={`当前状态: ${ACTIVITY_STATUS[user.activityStatus]}`}
                />
              </List.Item>
            )}
          />
        </Sider>

        <Content style={{ padding: "24px", background: "#f0f2f5" }}>
          {currentUser && (
            <>
              <Title level={4}>欢迎, {currentUser.name}</Title>
              <Paragraph>当前状态：{USER_STATUS[currentUser.status]}</Paragraph>
              <Paragraph>
                当前活动状态：{ACTIVITY_STATUS[currentUser.activityStatus]}
              </Paragraph>
              <StatusSelector
                currentActivityStatus={currentUser.activityStatus}
                onActivityStatusChange={updateUserActivityStatus}
              />
            </>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Room;
