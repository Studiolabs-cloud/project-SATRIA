import { Link } from 'react-router-dom';

// Data dummy, nanti fetch dari API
const STATS = {
  totalKegiatan: 37,
  baru: 16,
  denganNotulen: 11,
  tanpaNotulen: 26,
  denganLanjutan: 0,
};

const KEGIATAN_TERBARU = [
  { id: 1, tanggal: '2026-07-21', acara: 'Rapat Koordinasi Pertanahan', hasNotulen: true, hasLanjutan: false },
  { id: 2, tanggal: '2026-07-20', acara: 'Sosialisasi Program Sertifikasi Tanah', hasNotulen: false, hasLanjutan: false },
  { id: 3, tanggal: '2026-07-18', acara: 'Audiensi Warga Terkait Sengketa Lahan', hasNotulen: true, hasLanjutan: true },
];

export default function DashboardCatatan() {
  const formatTanggal = (dateStr) =>
    new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Koordinasi Internal</h1>
        <p className="text-gray-500 text-sm">Ringkasan kegiatan internal, notulen, catatan, dan tindak lanjut kegiatan</p>
      </div>

      {/* Ruang Kerja Anda */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Ruang Kerja Anda</h2>
          <p className="text-gray-400 text-sm">Kelola kegiatan koordinasi internal yang ada di bidang Anda</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/catatan/daftar-kegiatan"
            className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
          >
            📋 Lihat Rekap
          </Link>
        </div>
      </div>

      {/* Kotak Monitoring */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <StatCard icon="📊" label="Total Kegiatan" value={STATS.totalKegiatan} color="text-gray-800" />
        <StatCard icon="🆕" label="Baru" value={STATS.baru} color="text-blue-600" />
        <StatCard icon="📝" label="Dengan Notulen" value={STATS.denganNotulen} color="text-green-600" />
        <StatCard icon="⚠️" label="Tanpa Notulen" value={STATS.tanpaNotulen} color="text-red-600" />
        <StatCard icon="🔄" label="Dengan Lanjutan" value={STATS.denganLanjutan} color="text-purple-600" />
      </div>

      {/* Kegiatan Terbaru */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Kegiatan Terbaru</h2>
            <p className="text-gray-400 text-sm">Daftar kegiatan internal yang dapat Anda kelola dan disikapi</p>
          </div>
          <Link to="/catatan/daftar-kegiatan" className="text-sm text-blue-700 hover:underline whitespace-nowrap">
            Buka Rekap Lengkap
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500">
                <th className="py-2 pr-4 font-medium">Tanggal</th>
                <th className="py-2 pr-4 font-medium">Acara/Kegiatan</th>
                <th className="py-2 pr-4 font-medium">Notulen</th>
                <th className="py-2 pr-4 font-medium">Lanjutan</th>
                <th className="py-2 pr-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {KEGIATAN_TERBARU.map((item) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 pr-4 text-gray-700 whitespace-nowrap">{formatTanggal(item.tanggal)}</td>
                  <td className="py-3 pr-4 text-gray-800 font-medium">{item.acara}</td>
                  <td className="py-3 pr-4">
                    {item.hasNotulen ? (
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-50 text-green-700">
                        ✓ Ada
                      </span>
                    ) : (
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-50 text-red-700">
                        Belum Ada
                      </span>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    {item.hasLanjutan ? (
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-purple-50 text-purple-700">
                        Ada
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-3 pr-4 text-center">
                    <Link to={`/catatan/detail/${item.id}`} className="text-blue-700 hover:underline text-xs font-medium">
                      Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="text-2xl mb-1">{icon}</div>
      <p className="text-gray-500 text-xs mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}