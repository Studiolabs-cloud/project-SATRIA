import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

const MODULES = {
  agenda: {
    label: 'Agenda',
    icon: '📅',
    basePath: '/',
    menu: [
      { label: 'Dashboard', path: '/' },
      { label: 'Input Kegiatan', path: '/input-kegiatan' },
      { label: 'Rekap Semua', path: '/rekap-semua' },
      { label: 'Rekap Terkini', path: '/rekap-terkini' },
      { label: 'Master Peserta', path: '/master-peserta' },
    ],
  },
  naskah: {
    label: 'Naskah/Persuratan',
    icon: '📄',
    basePath: '/naskah',
    menu: [
      { label: 'Dashboard', path: '/naskah' },
      { label: 'Input Surat Masuk', path: '/naskah/input-surat' },
      { label: 'Rekap Belum', path: '/naskah/rekap-belum' },
      { label: 'Rekap Selesai', path: '/naskah/rekap-selesai' },
    ],
  },
};

function getActiveModuleKey(pathname) {
  if (pathname.startsWith('/naskah')) return 'naskah';
  return 'agenda';
}

export default function MainLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeModuleKey = getActiveModuleKey(location.pathname);
  const activeModule = MODULES[activeModuleKey];

  // Tutup dropdown kalau klik di luar area dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectModule = (key) => {
    setDropdownOpen(false);
    navigate(MODULES[key].basePath);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Baris Atas: Logo + Module Selector */}
      <header className="bg-green-800 text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div>
            <p className="font-bold text-sm leading-tight">SATRIA BATAM</p>
            <p className="text-xs text-green-200 leading-tight">
              Sistem Administrasi Terintegrasi Arsip dan Persuratan
            </p>
          </div>

          {/* Dropdown Selector Modul */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              <span>{activeModule.icon}</span>
              <span>{activeModule.label}</span>
              <span className={`text-xs transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50">
                <p className="text-xs text-gray-400 px-4 pt-3 pb-1">Pilih Modul Kerja</p>
                {Object.entries(MODULES).map(([key, mod]) => (
                  <button
                    key={key}
                    onClick={() => handleSelectModule(key)}
                    className={`w-full text-left flex items-center gap-3 px-4 py-3 text-sm transition ${
                      key === activeModuleKey
                        ? 'bg-green-50 text-green-800 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-lg">{mod.icon}</span>
                    <span>{mod.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Baris Bawah: Submenu Sesuai Modul Aktif */}
        <div className="border-t border-green-700/50">
          <div className="max-w-7xl mx-auto px-6">
            <nav className="flex gap-1 overflow-x-auto">
              {activeModule.menu.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm px-3 py-2.5 whitespace-nowrap border-b-2 transition ${
                    location.pathname === item.path
                      ? 'border-white text-white font-semibold'
                      : 'border-transparent text-green-200 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Konten Halaman */}
      <main>{children}</main>
    </div>
  );
}