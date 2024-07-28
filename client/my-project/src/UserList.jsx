// src/components/UserList.jsx
import React, { useEffect, useState } from 'react';
import { getAllUsers } from './api';
const UserList = ({ socket, onSelectUser }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="bg-gray-200 p-4 rounded shadow-md">
      <h3 className="text-lg font-semibold mb-4">Users</h3>
      <ul>
        {users.map((user) => (
          <li
            key={user.username}
            onClick={() => onSelectUser(user.username)}
            className="cursor-pointer p-2 hover:bg-gray-300 rounded"
          >
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
