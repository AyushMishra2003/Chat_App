// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { getAllUsers } from './api';

const socket = io('http://localhost:3001');

const Login = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (username.trim() === '') {
      alert('Username cannot be empty');
      return;
    }

    try {
      // Register the user
      socket.emit('register', { username });

      // Fetch all users
      await getAllUsers();
      
      // Navigate to the chat page
      navigate('/chat', { state: { username } });
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md">
        <h2 className="text-lg font-semibold mb-4">Login</h2>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-gray-300 p-2 mb-4 w-full"
        />
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white p-2 rounded w-full"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
