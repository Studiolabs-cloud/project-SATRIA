// frontend/src/pages/RekapSemua.jsx

import { useState } from 'react';

// Data dummy, nanti diganti fetch dari API
const DUMMY_AGENDA = [
  {
    id: 1,
    tanggalMulai: '2026-06-04',
    tanggalSelesai: null,
    jamMulai: '08:30',
    jamSelesai: null,
    acara: 'Rapat Koordinasi Pertanahan',
    tempat: 'Ruang Rapat Dinas',
    undanganDari: 'Sekretariat Daerah Kota Batam',
    peserta: ['Budi Santoso', 'Siti Aminah', 'Ahmad Fauzi'],
  },
  {
    id: 2,
    tanggalMulai: '2026-06-04',
    tanggalSelesai: null,
    jamMulai: '13:00',
    jamSelesai: null,
    acara: 'Sosialisasi Program Sertifikasi Tanah',
    tempat: 'Aula Kantor Dinas',
    undanganDari: 'Dinas Pertanahan Kota Batam',
    peserta: ['Dewi Lestari', 'Rudi Hartono', 'Maya Sari', 'Budi Santoso'],
  },
  {
    id: 3,
    tanggalMulai: '2026-06-10',
    tanggalSelesai: '2026-06-11',
    jamMulai: '09:00',
    jamSelesai: '16:00',
    acara: 'Bimbingan Teknis Pengukuran Tanah',
    tempat: 'Hotel Harmoni One Batam',
    undanganDari: 'Kementerian ATR/BPN',
    peserta: ['Ahmad Fauzi', 'Maya Sari'],
  },
  {
    id: 4,
    tanggalMulai: '2026-06-15',
    tanggalSelesai: null,
    jamMulai: '10:00',
    jamSelesai: '12:00',
    acara: 'Audiensi Warga Terkait Sengketa Lahan',
    tempat: 'Ruang Kepala Dinas',
    undanganDari: 'Warga Kelurahan Sungai Jodoh',
    peserta: ['Siti Aminah'],
  },
];

export default function RekapSemua() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBulan, setFilterBulan] = useState('');

  const formatTanggal = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const dataFiltered = DUMMY_AGENDA.filter((item) => {
    const matchSearch =
      item.acara.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tempat.toLowerCase().includes(searchTerm.toLowerCase());
    const matchBulan = filterBulan
      ? item.tanggalMulai.slice(0, 7) === filterBulan
      : true;
    return matchSearch && matchBulan;
  });

  const handleExportPDF = () => {
    alert('Fitur export PDF akan disambungkan ke backend nanti (generate PDF dari data rekap)');
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Rekap Semua Kegiatan</h1>
          <p className="text-gray-500 text-sm">Keseluruhan data agenda Dinas Pertanahan Kota Batam</p>
        </div>
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition self-start"
        >
          📄 Export PDF
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4 flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="Cari acara atau tempat..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        <input
          type="month"
          value={filterBulan}
          onChange={(e) => setFilterBulan(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        {(searchTerm || filterBulan) && (
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterBulan('');
            }}
            className="text-sm text-gray-500 hover:text-gray-700 px-3"
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* Info jumlah data */}
      <p className="text-sm text-gray-500 mb-3">
        Menampilkan {dataFiltered.length} dari {DUMMY_AGENDA.length} total kegiatan
      </p>

      {/* Tabel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="py-3 px-4 font-medium">Tanggal</th>
                <th className="py-3 px-4 font-medium">Jam</th>
                <th className="py-3 px-4 font-medium">Acara/Kegiatan</th>
                <th className="py-3 px-4 font-medium">Tempat</th>
                <th className="py-3 px-4 font-medium">Undangan Dari</th>
                <th className="py-3 px-4 font-medium">Peserta</th>
                <th className="py-3 px-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dataFiltered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    Tidak ada data kegiatan yang cocok dengan filter
                  </td>
                </tr>
              ) : (
                dataFiltered.map((item) => (
                  <tr key={item.id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-700 whitespace-nowrap">
                      {formatTanggal(item.tanggalMulai)}
                      {item.tanggalSelesai && (
                        <div className="text-xs text-gray-400">
                          s.d {formatTanggal(item.tanggalSelesai)}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-700 whitespace-nowrap">
                      {item.jamMulai}
                      {item.jamSelesai ? ` - ${item.jamSelesai}` : ' s.d Selesai'}
                    </td>
                    <td className="py-3 px-4 text-gray-800 font-medium max-w-xs">{item.acara}</td>
                    <td className="py-3 px-4 text-gray-700">{item.tempat}</td>
                    <td className="py-3 px-4 text-gray-700">{item.undanganDari}</td>
                    <td className="py-3 px-4 text-gray-700">
                      <span className="bg-green-50 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                        {item.peserta.length} orang
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button className="text-green-700 hover:underline text-xs font-medium">
                        Detail
                      </button>
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