import { useState } from 'react';
import { Link } from 'react-router-dom';

const DUMMY_SURAT_BELUM = [
  { id: 1, tglTerima: '2026-07-10', noSurat: '045/DP/2026', hal: 'Permohonan koordinasi program sertifikasi tanah', asalSurat: 'Kementerian ATR/BPN', sifat: 'Segera', deadline: '2026-07-23', status: 'Menunggu Disposisi', bidangTujuan: null },
  { id: 2, tglTerima: '2026-07-12', noSurat: '051/DP/2026', hal: 'Undangan rapat koordinasi penataan lahan', asalSurat: 'Sekretariat Daerah Kota Batam', sifat: 'Biasa', deadline: '2026-07-24', status: 'Proses', bidangTujuan: 'Penatagunaan & Pendayagunaan Tanah' },
  { id: 3, tglTerima: '2026-07-14', noSurat: '058/DP/2026', hal: 'Pengaduan sengketa lahan warga', asalSurat: 'Warga Kelurahan Sungai Jodoh', sifat: 'Sangat Segera', deadline: '2026-07-25', status: 'Menunggu Disposisi', bidangTujuan: null },
  { id: 4, tglTerima: '2026-07-08', noSurat: '039/DP/2026', hal: 'Permintaan data kepemilikan lahan', asalSurat: 'Dinas PUPR Kota Batam', sifat: 'Biasa', deadline: '2026-07-15', status: 'Proses', bidangTujuan: 'Pengawasan & Penanganan Masalah' },
];

export default function RekapBelum() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSifat, setFilterSifat] = useState('');

  const formatTanggal = (dateStr) =>
    new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

  const hariIni = new Date();
  hariIni.setHours(0, 0, 0, 0);

  const sisaHari = (dateStr) => {
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    return Math.round((target - hariIni) / (1000 * 60 * 60 * 24));
  };

  const badgeSifat = (sifat) => {
    const map = {
      'Sangat Segera': 'bg-red-100 text-red-700',
      Segera: 'bg-orange-100 text-orange-700',
      Biasa: 'bg-gray-100 text-gray-600',
      Rahasia: 'bg-purple-100 text-purple-700',
    };
    return map[sifat] || 'bg-gray-100 text-gray-600';
  };

  const badgeStatus = (status) => {
    return status === 'Menunggu Disposisi'
      ? 'bg-yellow-50 text-yellow-700'
      : 'bg-blue-50 text-blue-700';
  };

  const dataFiltered = DUMMY_SURAT_BELUM.filter((item) => {
    const matchSearch =
      item.noSurat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.hal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.asalSurat.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSifat = filterSifat ? item.sifat === filterSifat : true;
    return matchSearch && matchSifat;
  }).sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Rekap Surat Belum Selesai</h1>
        <p className="text-gray-500 text-sm">Surat yang masih menunggu disposisi atau dalam proses tindak lanjut</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4 flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="Cari nomor surat, hal, atau asal surat..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <select
          value={filterSifat}
          onChange={(e) => setFilterSifat(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="">Semua Sifat</option>
          <option value="Biasa">Biasa</option>
          <option value="Segera">Segera</option>
          <option value="Sangat Segera">Sangat Segera</option>
          <option value="Rahasia">Rahasia</option>
        </select>
        {(searchTerm || filterSifat) && (
          <button
            onClick={() => { setSearchTerm(''); setFilterSifat(''); }}
            className="text-sm text-gray-500 hover:text-gray-700 px-3"
          >
            Reset Filter
          </button>
        )}
      </div>

      <p className="text-sm text-gray-500 mb-3">
        Menampilkan {dataFiltered.length} dari {DUMMY_SURAT_BELUM.length} surat belum selesai
      </p>

      {/* Tabel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="py-3 px-4 font-medium">No Surat</th>
                <th className="py-3 px-4 font-medium">Hal</th>
                <th className="py-3 px-4 font-medium">Asal Surat</th>
                <th className="py-3 px-4 font-medium">Sifat</th>
                <th className="py-3 px-4 font-medium">Deadline</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dataFiltered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    Tidak ada surat yang cocok dengan filter
                  </td>
                </tr>
              ) : (
                dataFiltered.map((item) => {
                  const sisa = sisaHari(item.deadline);
                  return (
                    <tr key={item.id} className="border-t border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-800 font-medium whitespace-nowrap">{item.noSurat}</td>
                      <td className="py-3 px-4 text-gray-700 max-w-xs">{item.hal}</td>
                      <td className="py-3 px-4 text-gray-700">{item.asalSurat}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${badgeSifat(item.sifat)}`}>
                          {item.sifat}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${sisa < 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                          {formatTanggal(item.deadline)}
                          {sisa < 0 ? ` (Terlambat ${Math.abs(sisa)}h)` : ` (${sisa}h lagi)`}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${badgeStatus(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <Link to={`/naskah/detail/${item.id}`} className="text-blue-700 hover:underline text-xs font-medium mr-3">
                          Detail
                        </Link>
                        <button className="text-blue-600 hover:underline text-xs font-medium">
                          Tindak Lanjut
                        </button>
                      </td>
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