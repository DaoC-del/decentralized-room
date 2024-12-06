import React from 'react';

interface User {
  id: string;
  name: string;
  status: 'online' | 'offline';
}

interface UserListProps {
  users: User[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
  return (
    <div>
      <h2>Online Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.status})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
