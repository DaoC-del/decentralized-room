import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import socket from '../utils/socket';
import UserList from './UserList';

interface User {
  id: string;
  name: string;
  status: 'online' | 'offline';
}

const Room: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // 初始化用户数据
    const userId = uuidv4();
    const userName = `User_${userId.slice(0, 5)}`;
    const user: User = { id: userId, name: userName, status: 'online' };
    setCurrentUser(user);

    // 手动连接 socket
    socket.connect();

    // 通知服务器用户上线
    console.log('Emitting user_online:', user);
    socket.emit('user_online', user);

    // 监听服务器广播
    socket.on('update_users', (updatedUsers: User[]) => {
      console.log('Received update_users:', updatedUsers);
      setUsers(updatedUsers);
    });

    // 组件卸载时断开连接并清理事件
    return () => {
      console.log('Disconnecting socket');
      socket.disconnect();
      socket.off('update_users');
    };
  }, []);

  return (
    <div>
      <h1>Decentralized Room</h1>
      {currentUser && <p>Welcome, {currentUser.name}</p>}
      <UserList users={users} />
    </div>
  );
};

export default Room;
