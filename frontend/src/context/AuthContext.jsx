import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Akun dummy untuk testing, nanti diganti validasi ke backend
const DUMMY_USERS = [
  { username: 'admin', password: 'admin123', nama: 'Budi Santoso', role: 'Admin', bidang: 'Sekretariat' },
  { username: 'kadis', password: 'kadis123', nama: 'Ir. Hendra Wijaya', role: 'Kadis', bidang: 'Pimpinan' },
  { username: 'sekdis', password: 'sekdis123', nama: 'Siti Aminah', role: 'Sekdis', bidang: 'Sekretariat' },
  { username: 'pengelola', password: 'pengelola123', nama: 'Rina Marlina', role: 'Pengelola Surat', bidang: 'Sekretariat' },
  { username: 'kabid', password: 'kabid123', nama: 'Rudi Hartono', role: 'Kepala Bidang', bidang: 'Pengadaan Tanah' },
  { username: 'pelaksana', password: 'pelaksana123', nama: 'Ahmad Fauzi', role: 'Pelaksana', bidang: 'Penatagunaan Tanah' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cek sesi tersimpan saat aplikasi pertama kali dibuka
  useEffect(() => {
    const savedUser = localStorage.getItem('satria_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    const found = DUMMY_USERS.find(
      (u) => u.username === username && u.password === password
    );
    if (found) {
      const { password: _pw, ...userData } = found; // jangan simpan password di state
      setUser(userData);
      localStorage.setItem('satria_user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, message: 'Username atau password salah' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('satria_user');
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

export { DUMMY_USERS };