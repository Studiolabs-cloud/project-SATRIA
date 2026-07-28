import { useState, useEffect } from 'react';
import api from '../services/api';


export default function LogAktivitas() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
const [tanggalAwal, setTanggalAwal] = useState('');
const [tanggalAkhir, setTanggalAkhir] = useState('');

  useEffect(() => {
    api.get('/activity-logs')
      .then((res) => setLogs(res.data))
      .catch((err) => console.error('Gagal ambil log aktivitas:', err))
      .finally(() => setLoading(false));
  }, []);

  const formatWaktu = (dateStr) => {
    const date = new Date(dateStr);
    const tanggal = date.toLocaleDateString('id-ID', {
      timeZone: 'Asia/Jakarta',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const jam = date.toLocaleTimeString('id-ID', {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
    });
    return { tanggal, jam };
  };

 const dataFiltered = logs.filter((log) => {
  const matchSearch =
    log.namaUser.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.aktivitas.toLowerCase().includes(searchTerm.toLowerCase());

  const logDate = new Date(log.createdAt);
  const matchAwal = tanggalAwal ? logDate >= new Date(tanggalAwal + 'T00:00:00') : true;
  const matchAkhir = tanggalAkhir ? logDate <= new Date(tanggalAkhir + 'T23:59:59') : true;

  return matchSearch && matchAwal && matchAkhir;
});

  const badgeRole = (role) => {
  const map = {
    Admin: 'bg-blue-50 text-blue-700',
    Kadis: 'bg-purple-50 text-purple-700',
    Sekdis: 'bg-indigo-50 text-indigo-700',
    'Pengelola Surat': 'bg-cyan-50 text-cyan-700',
    'Kepala Bidang': 'bg-orange-50 text-orange-700',
    Pelaksana: 'bg-green-50 text-green-700',
  };
  return map[role] || 'bg-gray-100 text-gray-600';
};

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Log Histori Aktivitas</h1>
        <p className="text-gray-500 text-sm">Riwayat aktivitas pengguna dalam sistem (200 log terbaru)</p>
      </div>

     {/* Search & Filter */}
<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4 flex flex-col md:flex-row gap-3">
  <input
    type="text"
    placeholder="Cari nama user atau aktivitas..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
  />

  <div className="flex items-center gap-2">
    <label className="text-xs text-gray-500 whitespace-nowrap">Dari</label>
    <input
      type="date"
      value={tanggalAwal}
      onChange={(e) => setTanggalAwal(e.target.value)}
      className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
    />
  </div>

  <div className="flex items-center gap-2">
    <label className="text-xs text-gray-500 whitespace-nowrap">Sampai</label>
    <input
      type="date"
      value={tanggalAkhir}
      onChange={(e) => setTanggalAkhir(e.target.value)}
      className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
    />
  </div>

  {(searchTerm || tanggalAwal || tanggalAkhir) && (
    <button
      onClick={() => {
        setSearchTerm('');
        setTanggalAwal('');
        setTanggalAkhir('');
      }}
      className="text-sm text-gray-500 hover:text-gray-700 px-3 whitespace-nowrap"
    >
      Reset Filter
    </button>
  )}
</div>
      <p className="text-sm text-gray-500 mb-3">
        Menampilkan {dataFiltered.length} dari {logs.length} log aktivitas
      </p>

      {/* Tabel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500">
  <tr>
    <th className="py-3 px-4 font-medium">Tanggal</th>
    <th className="py-3 px-4 font-medium">Jam</th>
    <th className="py-3 px-4 font-medium">User</th>
    <th className="py-3 px-4 font-medium">Role</th>
    <th className="py-3 px-4 font-medium">Aktivitas</th>
  </tr>
</thead>
            <tbody>
              {loading ? (
  <tr>
    <td colSpan={5} className="py-8 text-center text-gray-400">Memuat data...</td>
  </tr>
) : dataFiltered.length === 0 ? (
  <tr>
    <td colSpan={5} className="py-8 text-center text-gray-400">Tidak ada log yang cocok</td>
  </tr>
) : (
  dataFiltered.map((log) => {
    const { tanggal, jam } = formatWaktu(log.createdAt);
    return (
      <tr key={log.id} className="border-t border-gray-50 hover:bg-gray-50">
        <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{tanggal}</td>
        <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{jam} WIB</td>
        <td className="py-3 px-4 text-gray-800 font-medium whitespace-nowrap">{log.namaUser}</td>
        <td className="py-3 px-4 whitespace-nowrap">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${badgeRole(log.role)}`}>
            {log.role}
          </span>
        </td>
        <td className="py-3 px-4 text-gray-700">{log.aktivitas}</td>
      </tr>
    );
  })
)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}