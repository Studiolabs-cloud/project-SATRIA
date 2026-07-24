import { useState } from 'react';
import { Link } from 'react-router-dom';

// Data dummy, nanti fetch dari API
const DUMMY_KEGIATAN = [
  { id: 1, tanggal: '2026-07-21', acara: 'Rapat Koordinasi Pertanahan', tempat: 'Ruang Rapat Dinas', hasNotulen: true, hasLanjutan: false },
  { id: 2, tanggal: '2026-07-20', acara: 'Sosialisasi Program Sertifikasi Tanah', tempat: 'Aula Kantor Dinas', hasNotulen: false, hasLanjutan: false },
  { id: 3, tanggal: '2026-07-18', acara: 'Audiensi Warga Terkait Sengketa Lahan', tempat: 'Ruang Kepala Dinas', hasNotulen: true, hasLanjutan: true },
  { id: 4, tanggal: '2026-07-15', acara: 'Bimbingan Teknis Pengukuran Tanah', tempat: 'Hotel Harmoni One Batam', hasNotulen: false, hasLanjutan: false },
];

export default function DaftarKegiatan() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterNotulen, setFilterNotulen] = useState('');

  const formatTanggal = (dateStr) =>
    new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

  const dataFiltered = DUMMY_KEGIATAN.filter((item) => {
    const matchSearch = item.acara.toLowerCase().includes(searchTerm.toLowerCase());
    const matchNotulen =
      filterNotulen === 'ada' ? item.hasNotulen :
      filterNotulen === 'belum' ? !item.hasNotulen : true;
    return matchSearch && matchNotulen;
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Daftar Kegiatan</h1>
        <p className="text-gray-500 text-sm">Kelola notulen, catatan, dan tindak lanjut kegiatan internal</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4 flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="Cari nama kegiatan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <select
          value={filterNotulen}
          onChange={(e) => setFilterNotulen(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="">Semua Kegiatan</option>
          <option value="ada">Sudah Ada Notulen</option>
          <option value="belum">Belum Ada Notulen</option>
        </select>
      </div>

      <p className="text-sm text-gray-500 mb-3">
        Menampilkan {dataFiltered.length} dari {DUMMY_KEGIATAN.length} kegiatan
      </p>

      {/* Tabel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="py-3 px-4 font-medium">Tanggal</th>
                <th className="py-3 px-4 font-medium">Acara/Kegiatan</th>
                <th className="py-3 px-4 font-medium">Tempat</th>
                <th className="py-3 px-4 font-medium">Notulen</th>
                <th className="py-3 px-4 font-medium">Lanjutan</th>
                <th className="py-3 px-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dataFiltered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    Tidak ada kegiatan yang cocok
                  </td>
                </tr>
              ) : (
                dataFiltered.map((item) => (
                  <tr
                    key={item.id}
                    className={`border-t border-gray-50 hover:bg-gray-50 ${!item.hasNotulen ? 'bg-red-50/40' : ''}`}
                  >
                    <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{formatTanggal(item.tanggal)}</td>
                    <td className="py-3 px-4 text-gray-800 font-medium">{item.acara}</td>
                    <td className="py-3 px-4 text-gray-700">{item.tempat}</td>
                    <td className="py-3 px-4">
                      {item.hasNotulen ? (
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-50 text-green-700">
                          ✓ Ada
                        </span>
                      ) : (
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-700">
                          ⚠ Belum Ada
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {item.hasLanjutan ? (
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-purple-50 text-purple-700">
                          Ada
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Link to={`/catatan/detail/${item.id}`} className="text-blue-700 hover:underline text-xs font-medium">
                        {item.hasNotulen ? 'Lihat Detail' : 'Isi Notulen'}
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}