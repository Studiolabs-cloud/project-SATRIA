// frontend/src/pages/Dashboard.jsx

import { useState } from 'react';

export default function Dashboard() {
  // Data dummy dulu, nanti diganti fetch dari API
  const [stats] = useState({
    totalSemua: 31,
    totalTerkini: 5,
    totalBulanIni: 12,
  });

  const [agendaHariIni] = useState([
    {
      hari: 'Kamis, 04-06-2026',
      jam: '08:30 WIB s.d Selesai',
      acara: 'Rapat Koordinasi Pertanahan',
      tempat: 'Ruang Rapat Dinas',
      pesertaCount: 5,
    },
    {
      hari: 'Kamis, 04-06-2026',
      jam: '13:00 WIB s.d Selesai',
      acara: 'Sosialisasi Program Sertifikasi Tanah',
      tempat: 'Aula Kantor Dinas',
      pesertaCount: 8,
    },
  ]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Agenda</h1>
        <p className="text-gray-500 text-sm">Ringkasan data agenda Dinas Pertanahan</p>
      </div>

      {/* Kartu Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Semua Kegiatan" value={stats.totalSemua} linkText="Lihat Rekap Semua" />
        <StatCard label="Total Kegiatan Terkini" value={stats.totalTerkini} linkText="Lihat Rekap Terkini" />
        <StatCard label="Total Kegiatan Bulan Ini" value={stats.totalBulanIni} linkText="Input Kegiatan" highlight />
      </div>

      {/* Tabel Agenda Hari Ini */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Agenda Hari Ini</h2>
            <p className="text-gray-400 text-sm">Kegiatan yang aktif pada tanggal hari ini</p>
          </div>
          <button className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
            + Tambah Kegiatan
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500">
                <th className="py-2 pr-4 font-medium">Hari/Tanggal</th>
                <th className="py-2 pr-4 font-medium">Jam</th>
                <th className="py-2 pr-4 font-medium">Acara/Kegiatan</th>
                <th className="py-2 pr-4 font-medium">Tempat</th>
                <th className="py-2 pr-4 font-medium">Peserta</th>
              </tr>
            </thead>
            <tbody>
              {agendaHariIni.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 pr-4 text-gray-700">{item.hari}</td>
                  <td className="py-3 pr-4 text-gray-700">{item.jam}</td>
                  <td className="py-3 pr-4 text-gray-800 font-medium">{item.acara}</td>
                  <td className="py-3 pr-4 text-gray-700">{item.tempat}</td>
                  <td className="py-3 pr-4 text-gray-700">{item.pesertaCount} orang</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, linkText, highlight }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <p className="text-gray-500 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-800 mb-3">{value}</p>
      <button
        className={`text-sm font-medium px-3 py-1.5 rounded-lg transition ${
          highlight
            ? 'bg-blue-700 text-white hover:bg-blue-800'
            : 'text-blue-700 hover:bg-blue-50'
        }`}
      >
        {linkText}
      </button>
    </div>
  );
}