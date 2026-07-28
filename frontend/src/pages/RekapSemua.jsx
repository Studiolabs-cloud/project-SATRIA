// frontend/src/pages/RekapSemua.jsx

import { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

export default function RekapSemua() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBulan, setFilterBulan] = useState('');
  const [agendaList, setAgendaList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/agenda')
      .then((res) => setAgendaList(res.data))
      .catch((err) => console.error('Gagal ambil data agenda:', err))
      .finally(() => setLoading(false));
  }, []);

  const formatTanggal = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

 const dataFiltered = agendaList.filter((item) => {
  const matchSearch =
    item.acara.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tempat.toLowerCase().includes(searchTerm.toLowerCase());
  const matchBulan = filterBulan
    ? item.tanggalMulai.slice(0, 7) === filterBulan
    : true;
  return matchSearch && matchBulan;
});

  const handleExportPDF = () => {
  const tanggalCetak = new Date().toLocaleDateString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric',
  });

  const rows = dataFiltered.map((item, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td>${formatTanggal(item.tanggalMulai)}${item.tanggalSelesai ? ' s.d ' + formatTanggal(item.tanggalSelesai) : ''}</td>
      <td>${item.jamMulai}${item.jamSelesai ? ' - ' + item.jamSelesai : ' s.d Selesai'}</td>
      <td>${item.acara}</td>
      <td>${item.tempat}</td>
      <td>${item.undanganDari}</td>
      <td>${item.peserta.length} orang</td>
    </tr>
  `).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Rekap Semua Kegiatan</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 24px; color: #1f2937; }
        h1 { font-size: 18px; margin-bottom: 4px; }
        p.subtitle { font-size: 12px; color: #6b7280; margin-top: 0; margin-bottom: 16px; }
        table { width: 100%; border-collapse: collapse; font-size: 11px; }
        th, td { border: 1px solid #d1d5db; padding: 6px 8px; text-align: left; }
        th { background-color: #f3f4f6; }
        .footer { margin-top: 24px; font-size: 10px; color: #9ca3af; }
      </style>
    </head>
    <body>
      <h1>Rekap Semua Kegiatan</h1>
      <p class="subtitle">Bappeda Kota Batam &mdash; Dicetak pada ${tanggalCetak}</p>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Tanggal</th>
            <th>Jam</th>
            <th>Acara/Kegiatan</th>
            <th>Tempat</th>
            <th>Asal Undangan</th>
            <th>Peserta</th>
          </tr>
        </thead>
        <tbody>
          ${rows || '<tr><td colspan="7" style="text-align:center;">Tidak ada data</td></tr>'}
        </tbody>
      </table>
      <p class="footer">Dokumen ini dibuat otomatis oleh Sistem SATRIA BATAM</p>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 300);
};

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Rekap Semua Kegiatan</h1>
          <p className="text-gray-500 text-sm">Keseluruhan data agenda Bappeda Kota Batam</p>
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
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <input
          type="month"
          value={filterBulan}
          onChange={(e) => setFilterBulan(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
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
  Menampilkan {dataFiltered.length} dari {agendaList.length} total kegiatan
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
  {loading ? (
    <tr>
      <td colSpan={7} className="py-8 text-center text-gray-400">
        Memuat data...
      </td>
    </tr>
  ) : dataFiltered.length === 0 ? (
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
                    <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
                        {item.peserta.length} orang
                        </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Link to={`/agenda/detail/${item.id}`} className="text-blue-700 hover:underline text-xs font-medium">
                        Detail
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