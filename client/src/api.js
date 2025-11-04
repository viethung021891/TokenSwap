// api.js
import axios from 'axios';

const API_BASE = process.env.REACT_APP_APIBase;

export const login = async (username, password) => {
  const response = await axios.post(`${API_BASE}/login`, { username, password });
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('username', username); // Store username
};

export const register = async (username, password) => {
  await axios.post(`${API_BASE}/register`, { username, password });
};

export const getProtectedData = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_BASE}/protected`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
