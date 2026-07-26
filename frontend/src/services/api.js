import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Otomatis sisipkan token ke setiap request kalau ada
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('satria_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;