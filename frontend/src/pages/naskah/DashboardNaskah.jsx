import { Link } from 'react-router-dom';

// Data dummy, nanti diganti fetch dari API
const STATS = {
  totalSuratMasuk: 25,
  menungguDisposisi: 6,
  sedangProses: 10,
  selesai: 1,
  belumDitindaklanjuti: 16,
};

const ALERT_DEADLINE = [
  { id: 1, noSurat: '045/DP/2026', bidangTujuan: 'Pemanfaatan & Pengadaan Tanah', deadline: '2026-07-23', status: 'Belum Selesai' },
  { id: 2, noSurat: '051/DP/2026', bidangTujuan: 'Penatagunaan Tanah', deadline: '2026-07-24', status: 'Proses' },
  { id: 3, noSurat: '058/DP/2026', bidangTujuan: 'Sekretariat', deadline: '2026-07-25', status: 'Belum Selesai' },
];

export default function DashboardNaskah() {
  const formatTanggal = (dateStr) =>
    new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

  const hariIni = new Date();
  hariIni.setHours(0, 0, 0, 0);

  const sisaHari = (dateStr) => {
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    return Math.round((target - hariIni) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Naskah/Persuratan</h1>
        <p className="text-gray-500 text-sm">Ringkasan operasional sesuai hak akses pengguna</p>
      </div>

      {/* Kartu Statistik */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <StatCard icon="📥" label="Total Surat Masuk" value={STATS.totalSuratMasuk} color="text-gray-800" />
        <StatCard icon="⏳" label="Menunggu Disposisi" value={STATS.menungguDisposisi} color="text-yellow-600" />
        <StatCard icon="🔄" label="Sedang Proses" value={STATS.sedangProses} color="text-blue-600" />
        <StatCard icon="✅" label="Selesai" value={STATS.selesai} color="text-green-600" />
        <StatCard icon="⚠️" label="Belum Ditindaklanjuti" value={STATS.belumDitindaklanjuti} color="text-red-600" />
      </div>

      {/* Alert Deadline */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold text-red-700">⚠ Alert Deadline H-2 / Overdue</h2>
            <p className="text-gray-400 text-sm">
              Surat dengan deadline yang sudah mendekati atau sudah melewati batas waktu tindak lanjut
            </p>
          </div>
          <Link to="/naskah/rekap-belum" className="text-sm text-green-700 hover:underline whitespace-nowrap">
            Lihat Daftar Surat
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500">
                <th className="py-2 pr-4 font-medium">Deadline</th>
                <th className="py-2 pr-4 font-medium">Nomor Surat</th>
                <th className="py-2 pr-4 font-medium">Bidang Tujuan</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 pr-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {ALERT_DEADLINE.map((item) => {
                const sisa = sisaHari(item.deadline);
                return (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 pr-4">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          sisa < 0 ? 'bg-red-100 text-red-700' : 'bg-yellow-50 text-yellow-700'
                        }`}
                      >
                        {formatTanggal(item.deadline)} {sisa < 0 ? `(Terlambat ${Math.abs(sisa)} hari)` : `(${sisa} hari lagi)`}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-gray-800 font-medium">{item.noSurat}</td>
                    <td className="py-3 pr-4 text-gray-700">{item.bidangTujuan}</td>
                    <td className="py-3 pr-4 text-gray-700">{item.status}</td>
                    <td className="py-3 pr-4 text-center">
                      <Link to={`/naskah/detail/${item.id}`} className="text-green-700 hover:underline text-xs font-medium">
                        Detail
                      </Link>
                    </td>
                  </tr>
                );
              })}
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