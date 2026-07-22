// frontend/src/pages/InputKegiatan.jsx

import { useState } from 'react';

// Data dummy pegawai, nanti diganti fetch dari API master peserta
const DUMMY_PEGAWAI = [
  { id: 1, nama: 'Budi Santoso' },
  { id: 2, nama: 'Siti Aminah' },
  { id: 3, nama: 'Ahmad Fauzi' },
  { id: 4, nama: 'Dewi Lestari' },
  { id: 5, nama: 'Rudi Hartono' },
  { id: 6, nama: 'Maya Sari' },
];

export default function InputKegiatan() {
  const [form, setForm] = useState({
    tanggalMulai: '',
    tanggalSelesai: '',
    jamMulai: '',
    jamSelesai: '',
    acara: '',
    tempat: '',
    undanganDari: '',
    keterangan: '',
  });

  const [pesertaTerpilih, setPesertaTerpilih] = useState([]);
  const [semuaPegawai, setSemuaPegawai] = useState(false);
  const [fileUndangan, setFileUndangan] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleSemuaPegawai = () => {
    if (!semuaPegawai) {
      setPesertaTerpilih(DUMMY_PEGAWAI.map((p) => p.id));
    } else {
      setPesertaTerpilih([]);
    }
    setSemuaPegawai(!semuaPegawai);
  };

  const togglePeserta = (id) => {
    setPesertaTerpilih((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleFileChange = (e) => {
    setFileUndangan(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      peserta: pesertaTerpilih,
      fileUndangan: fileUndangan?.name || null,
    };
    console.log('Data yang akan disimpan:', payload);
    alert('Kegiatan berhasil disimpan! (cek console untuk data lengkap)');
    // Nanti di sini panggil API: axios.post('/api/agenda', payload)
  };

  const handleBatal = () => {
    setForm({
      tanggalMulai: '',
      tanggalSelesai: '',
      jamMulai: '',
      jamSelesai: '',
      acara: '',
      tempat: '',
      undanganDari: '',
      keterangan: '',
    });
    setPesertaTerpilih([]);
    setSemuaPegawai(false);
    setFileUndangan(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Form Input Daftar Kegiatan</h1>
        <p className="text-gray-500 text-sm">
          Isi data agenda sesuai undangan atau kegiatan resmi yang akan dilaksanakan
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
        {/* Tanggal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Mulai Kegiatan <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="tanggalMulai"
              value={form.tanggalMulai}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai Kegiatan</label>
            <input
              type="date"
              name="tanggalSelesai"
              value={form.tanggalSelesai}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <p className="text-xs text-gray-400 mt-1">Kosongkan jika kegiatan hanya berlangsung satu hari</p>
          </div>
        </div>

        {/* Jam */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jam Mulai <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              name="jamMulai"
              value={form.jamMulai}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jam Selesai</label>
            <input
              type="time"
              name="jamSelesai"
              value={form.jamSelesai}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
        </div>

        {/* Acara */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Acara/Kegiatan <span className="text-red-500">*</span>
          </label>
          <textarea
            name="acara"
            value={form.acara}
            onChange={handleChange}
            required
            rows={3}
            placeholder="Contoh: Rapat koordinasi dan pembahasan tindak lanjut terkait pelaksanaan program pertanahan"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        {/* Tempat */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tempat <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="tempat"
            value={form.tempat}
            onChange={handleChange}
            required
            placeholder="Ruang rapat, kantor instansi, hotel, aula, dll"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        {/* Undangan Dari */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Undangan Dari <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="undanganDari"
            value={form.undanganDari}
            onChange={handleChange}
            required
            placeholder="Nama instansi/lembaga/perusahaan penyelenggara"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        {/* Yang Menghadiri */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Yang Menghadiri <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              className="text-xs text-green-700 border border-green-700 rounded-lg px-3 py-1 hover:bg-green-50"
            >
              Kelola Master Panitia
            </button>
          </div>

          <label className="flex items-center gap-2 mb-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={semuaPegawai}
              onChange={toggleSemuaPegawai}
              className="w-4 h-4 accent-green-700"
            />
            Semua Pegawai Dinas Pertanahan Kota Batam
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border border-gray-100 rounded-lg p-3 max-h-48 overflow-y-auto">
            {DUMMY_PEGAWAI.map((pegawai) => (
              <label key={pegawai.id} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={pesertaTerpilih.includes(pegawai.id)}
                  onChange={() => togglePeserta(pegawai.id)}
                  className="w-4 h-4 accent-green-700"
                />
                {pegawai.nama}
              </label>
            ))}
          </div>
        </div>

        {/* Upload File */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload File Undangan (opsional)</label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-700 file:text-white hover:file:bg-green-800"
          />
          <p className="text-xs text-gray-400 mt-1">Format PDF, JPG, PNG. Maksimal 10 MB</p>
        </div>

        {/* Keterangan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
          <textarea
            name="keterangan"
            value={form.keterangan}
            onChange={handleChange}
            rows={2}
            placeholder="Catatan tambahan (opsional)"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        {/* Tombol Aksi */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-green-700 hover:bg-green-800 text-white font-medium px-6 py-2.5 rounded-lg transition"
          >
            Simpan Kegiatan
          </button>
          <button
            type="button"
            onClick={handleBatal}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-2.5 rounded-lg transition"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}