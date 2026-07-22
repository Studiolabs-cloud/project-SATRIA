import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import logoImg from '../assets/Logo.png';

const MODULES = {
  agenda: {
    label: 'Agenda',
    icon: '📅',
    basePath: '/',
    menu: [
      { label: 'Dashboard', path: '/', icon: '🏠' },
      { label: 'Input Kegiatan', path: '/input-kegiatan', icon: '➕' },
      { label: 'Rekap Semua', path: '/rekap-semua', icon: '📋' },
      { label: 'Rekap Terkini', path: '/rekap-terkini', icon: '🕐' },
      { label: 'Master Peserta', path: '/master-peserta', icon: '👥' },
    ],
  },
  naskah: {
    label: 'Naskah/Persuratan',
    icon: '📄',
    basePath: '/naskah',
    menu: [
      { label: 'Dashboard', path: '/naskah', icon: '🏠' },
      { label: 'Input Surat Masuk', path: '/naskah/input-surat', icon: '➕' },
      { label: 'Rekap Belum', path: '/naskah/rekap-belum', icon: '⏳' },
      { label: 'Rekap Selesai', path: '/naskah/rekap-selesai', icon: '✅' },
    ],
  },
};

const CURRENT_USER = {
  nama: 'Studio Labs',
  role: 'Admin',
  bidang: 'Sekretariat',
};

function getActiveModuleKey(pathname) {
  if (pathname.startsWith('/naskah')) return 'naskah';
  return 'agenda';
}

export default function MainLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const dropdownRef = useRef(null);

  const activeModuleKey = getActiveModuleKey(location.pathname);
  const activeModule = MODULES[activeModuleKey];

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
    <div className="min-h-screen bg-gray-50 flex">
      {/* SIDEBAR */}
      <aside
        className={`bg-blue-800 text-white flex flex-col transition-all duration-300 ease-in-out ${
          collapsed ? 'w-20' : 'w-64'
        } flex-shrink-0`}
      >
        {/* Header: Logo + Nama (klik untuk collapse/expand) */}
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          title={collapsed ? 'Perluas menu' : 'Ciutkan menu'}
          className="w-full flex items-center gap-2.5 px-4 py-4 border-b border-blue-700/50 hover:bg-blue-700/40 transition text-left"
        >
          <img src={logoImg} alt="Logo SATRIA BATAM" className="w-9 h-9 flex-shrink-0 object-contain" />
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-bold text-sm leading-tight">SATRIA BATAM</p>
              <p className="text-[10px] text-blue-200 leading-snug mt-0.5">
                Sistem Administrasi Terintegrasi Arsip dan Persuratan Kota Batam
              </p>
            </div>
          )}
        </button>

        {/* Module Selector */}
        <div className="px-3 py-3 border-b border-blue-700/50 relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className={`w-full flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white text-sm font-medium px-3 py-2.5 rounded-lg transition ${
              collapsed ? 'justify-center' : 'justify-between'
            }`}
          >
            <span className="flex items-center gap-2 overflow-hidden">
              <span className="text-lg flex-shrink-0">{activeModule.icon}</span>
              {!collapsed && <span className="whitespace-nowrap">{activeModule.label}</span>}
            </span>
            {!collapsed && (
              <span className={`text-xs transition-transform flex-shrink-0 ${dropdownOpen ? 'rotate-180' : ''}`}>▼</span>
            )}
          </button>

          {dropdownOpen && (
            <div className="absolute left-3 right-3 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50">
              <p className="text-xs text-gray-400 px-4 pt-3 pb-1">Pilih Modul Kerja</p>
              {Object.entries(MODULES).map(([key, mod]) => (
                <button
                  key={key}
                  onClick={() => handleSelectModule(key)}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 text-sm transition ${
                    key === activeModuleKey
                      ? 'bg-blue-50 text-blue-800 font-semibold'
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

        {/* Menu Navigasi */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {activeModule.menu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  collapsed ? 'justify-center' : ''
                } ${
                  isActive
                    ? 'bg-white text-blue-800 font-semibold'
                    : 'text-blue-100 hover:bg-blue-700'
                }`}
              >
                <span className="text-base flex-shrink-0">{item.icon}</span>
                {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Info Role Akun di Bawah */}
        <div className="px-3 py-3 border-t border-blue-700/50">
          <div
            className={`flex items-center gap-3 px-2 py-2 rounded-lg ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? `${CURRENT_USER.nama} (${CURRENT_USER.role})` : undefined}
          >
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
              {CURRENT_USER.nama.charAt(0)}
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-white whitespace-nowrap">{CURRENT_USER.nama}</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded-full whitespace-nowrap">
                    {CURRENT_USER.role}
                  </span>
                  <span className="text-[10px] text-blue-200 whitespace-nowrap truncate">
                    {CURRENT_USER.bidang}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* KONTEN HALAMAN */}
      <main className="flex-1 min-w-0 overflow-x-auto">{children}</main>
    </div>
  );
}