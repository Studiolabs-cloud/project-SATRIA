import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cek sesi tersimpan saat aplikasi pertama kali dibuka
  useEffect(() => {
    const savedUser = localStorage.getItem('satria_user');
    const savedToken = localStorage.getItem('satria_token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, user: userData } = response.data;

      setUser(userData);
      localStorage.setItem('satria_user', JSON.stringify(userData));
      localStorage.setItem('satria_token', token);

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Gagal terhubung ke server';
      return { success: false, message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('satria_user');
    localStorage.removeItem('satria_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}