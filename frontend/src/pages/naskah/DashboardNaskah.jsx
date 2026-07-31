import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function DashboardNaskah() {
  const [stats, setStats] = useState({
    totalSuratMasuk: 0, menungguDisposisi: 0, sedangProses: 0, selesai: 0, belumDitindaklanjuti: 0,
  });
  const [suratList, setSuratList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/naskah/stats'),
      api.get('/naskah/untuk-saya'),
    ])
      .then(([statsRes, suratRes]) => {
        setStats(statsRes.data);
        setSuratList(suratRes.data);
      })
      .catch((err) => console.error('Gagal ambil data dashboard naskah:', err))
      .finally(() => setLoading(false));
  }, []);

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
        <StatCard icon="📥" label="Total Surat Masuk" value={stats.totalSuratMasuk} color="text-gray-800" />
<StatCard icon="⏳" label="Menunggu Disposisi" value={stats.menungguDisposisi} color="text-yellow-600" />
<StatCard icon="🔄" label="Sedang Proses" value={stats.sedangProses} color="text-blue-600" />
<StatCard icon="✅" label="Selesai" value={stats.selesai} color="text-green-600" />
<StatCard icon="⚠️" label="Belum Ditindaklanjuti" value={stats.belumDitindaklanjuti} color="text-red-600" />
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
          <Link to="/naskah/rekap-belum" className="text-sm text-blue-700 hover:underline whitespace-nowrap">
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
  {loading ? (
    <tr><td colSpan={5} className="py-6 text-center text-gray-400">Memuat data...</td></tr>
  ) : (() => {
    const alertList = suratList.filter((s) => {
      const belumSelesai = !s.disposisi?.some((d) => d.tindakLanjut?.hasilVerifikasi === 'selesai');
      return s.deadlineTindakLanjut && belumSelesai;
    });

    if (alertList.length === 0) {
      return <tr><td colSpan={5} className="py-6 text-center text-gray-400">Tidak ada surat dengan deadline mendekat</td></tr>;
    }

    return alertList.map((item) => {
      const sisa = sisaHari(item.deadlineTindakLanjut);
      const bidangTujuan = item.disposisi?.[0] ? JSON.parse(item.disposisi[0].bidangTujuan || '[]').join(', ') : '-';
      return (
        <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50">
          <td className="py-3 pr-4">
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                sisa < 0 ? 'bg-red-100 text-red-700' : 'bg-yellow-50 text-yellow-700'
              }`}
            >
              {formatTanggal(item.deadlineTindakLanjut)} {sisa < 0 ? `(Terlambat ${Math.abs(sisa)} hari)` : `(${sisa} hari lagi)`}
            </span>
          </td>
          <td className="py-3 pr-4 text-gray-800 font-medium">{item.noSurat || '-'}</td>
          <td className="py-3 pr-4 text-gray-700">{bidangTujuan}</td>
          <td className="py-3 pr-4 text-gray-700">{item.status}</td>
          <td className="py-3 pr-4 text-center">
            <Link to={`/naskah/detail/${item.id}`} className="text-green-700 hover:underline text-xs font-medium">
              Detail
            </Link>
          </td>
        </tr>
      );
    });
  })()}
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