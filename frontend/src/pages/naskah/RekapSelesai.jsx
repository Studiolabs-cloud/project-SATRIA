import { useState } from 'react';

const DUMMY_SURAT_SELESAI = [
  { id: 1, tglTerima: '2026-06-20', noSurat: '028/DP/2026', hal: 'Permohonan izin survei lokasi lahan', asalSurat: 'PT Pertiwi Land Development', sifat: 'Biasa', tglSelesai: '2026-06-25', diverifikasiOleh: 'Sekretaris Dinas' },
  { id: 2, tglTerima: '2026-06-15', noSurat: '022/DP/2026', hal: 'Laporan hasil pengukuran tanah kelurahan', asalSurat: 'Kantor Pertanahan Kota Batam', sifat: 'Segera', tglSelesai: '2026-06-22', diverifikasiOleh: 'Kepala Dinas' },
  { id: 3, tglTerima: '2026-06-05', noSurat: '015/DP/2026', hal: 'Koordinasi penyelesaian sengketa lahan', asalSurat: 'Kecamatan Batu Ampar', sifat: 'Sangat Segera', tglSelesai: '2026-06-10', diverifikasiOleh: 'Sekretaris Dinas' },
];

export default function RekapSelesai() {
  const [searchTerm, setSearchTerm] = useState('');

  const formatTanggal = (dateStr) =>
    new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

  const dataFiltered = DUMMY_SURAT_SELESAI.filter(
    (item) =>
      item.noSurat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.hal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.asalSurat.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(b.tglSelesai) - new Date(a.tglSelesai));

  const handleExportPDF = () => {
    alert('Fitur export PDF akan disambungkan ke backend nanti');
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Rekap Surat Selesai</h1>
          <p className="text-gray-500 text-sm">Surat yang sudah diverifikasi selesai oleh pimpinan</p>
        </div>
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition self-start"
        >
          📄 Export PDF
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
        <input
          type="text"
          placeholder="Cari nomor surat, hal, atau asal surat..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-96 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
        />
      </div>

      <p className="text-sm text-gray-500 mb-3">
        Menampilkan {dataFiltered.length} dari {DUMMY_SURAT_SELESAI.length} surat selesai
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
                <th className="py-3 px-4 font-medium">Tgl Selesai</th>
                <th className="py-3 px-4 font-medium">Diverifikasi Oleh</th>
                <th className="py-3 px-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dataFiltered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    Tidak ada surat selesai yang cocok
                  </td>
                </tr>
              ) : (
                dataFiltered.map((item) => (
                  <tr key={item.id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800 font-medium whitespace-nowrap">{item.noSurat}</td>
                    <td className="py-3 px-4 text-gray-700 max-w-xs">{item.hal}</td>
                    <td className="py-3 px-4 text-gray-700">{item.asalSurat}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-50 text-green-700">
                        ✓ {formatTanggal(item.tglSelesai)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{item.diverifikasiOleh}</td>
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