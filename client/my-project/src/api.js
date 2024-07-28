// src/api.js
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/v1';

// Fetch all users
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Get user details
export const getUser = async (username) => {
  try {
    const response = await axios.get(`${API_URL}/user/${username}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};
