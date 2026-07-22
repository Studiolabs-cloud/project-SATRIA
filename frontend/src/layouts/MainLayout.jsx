import { Link, useLocation } from 'react-router-dom';

export default function MainLayout({ children }) {
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Input Kegiatan', path: '/input-kegiatan' },
    { label: 'Rekap Semua', path: '/rekap-semua' },
    { label: 'Rekap Terkini', path: '/rekap-terkini' },
    { label: 'Master Peserta', path: '/master-peserta' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar Atas */}
      <header className="bg-green-800 text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div>
            <p className="font-bold text-sm leading-tight">SATRIA BATAM</p>
            <p className="text-xs text-green-200 leading-tight">Modul Agenda BAPPEDA Kota Batam</p>
          </div>
          <nav className="flex gap-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm px-3 py-1.5 rounded-lg transition ${
                  location.pathname === item.path
                    ? 'bg-white text-green-800 font-semibold'
                    : 'text-green-100 hover:bg-green-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Konten Halaman */}
      <main>{children}</main>
    </div>
  );
}