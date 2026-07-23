import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, DUMMY_USERS } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const result = login(username, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  const isiAkunDemo = (demoUsername, demoPassword) => {
    setUsername(demoUsername);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-white rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-lg">
            <span className="text-2xl">🏛️</span>
          </div>
          <h1 className="text-white text-2xl font-bold">SATRIA BATAM</h1>
          <p className="text-blue-200 text-sm">Sistem Administrasi Terintegrasi Arsip dan Persuratan Kota Batam</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-lg font-bold text-gray-800 mb-1">Masuk ke Portal</h2>
          <p className="text-gray-500 text-sm mb-6">Gunakan akun Anda untuk mengakses sistem</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2.5 rounded-lg transition"
            >
              Masuk ke SATRIA
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100">
            <button
              onClick={() => setShowDemoAccounts((prev) => !prev)}
              className="text-xs text-blue-700 hover:underline flex items-center gap-1 mx-auto"
            >
              {showDemoAccounts ? '▲ Sembunyikan' : '▼ Lihat'} akun demo untuk testing
            </button>

            {showDemoAccounts && (
              <div className="mt-3 space-y-1.5">
                {DUMMY_USERS.map((u) => (
                  <button
                    key={u.username}
                    onClick={() => isiAkunDemo(u.username, u.password)}
                    className="w-full flex justify-between items-center text-xs bg-gray-50 hover:bg-blue-50 px-3 py-2 rounded-lg transition text-left"
                  >
                    <span className="text-gray-700">
                      <span className="font-medium">{u.role}</span> — {u.nama}
                    </span>
                    <span className="text-gray-400">{u.username}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-blue-200 text-xs mt-4">
          © 2026 Bappeda Kota Batam
        </p>
      </div>
    </div>
  );
}