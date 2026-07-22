import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const INSTRUKSI_OPTIONS = [
  'Tanggapan dan saran',
  'Koordinasi / Konfirmasi',
  'Proses lebih lanjut',
  'Telaah/Saran',
  'Sesuai Ketentuan',
  'Proses',
  'Untuk diketahui',
  'Ditindaklanjuti',
  'Proses lebih lanjut Sesuai Prosedur & Ketentuan',
  'Koordinasi/konfirmasikan',
  'Atensi',
  'Beri Penjelasan Tertulis/Lisan',
  'File/CC',
  'Segera',
  'Jadwalkan/Mewakili',
  'Laksanakan/Selesaikan',
];

const BIDANG_OPTIONS = [
  { id: 'sekretariat', label: 'Sekretariat', desc: 'Sekretariat' },
  { id: 'pemanfaatan', label: 'Pemanfaatan & Pengadaan Tanah', desc: 'Pemanfaatan & Pengadaan Tanah' },
  { id: 'penatagunaan', label: 'Penatagunaan & Pendayagunaan Tanah', desc: 'Penatagunaan & Pendayagunaan Tanah' },
  { id: 'pengawasan', label: 'Pengawasan & Penanganan Masalah', desc: 'Pengawasan & Penanganan Masalah' },
];

// Data dummy, nanti fetch dari API berdasarkan :id
const DUMMY_SURAT = {
  id: 1,
  noSurat: '045/DP/2026',
  tglMasuk: '2026-07-10',
  hal: 'Permohonan koordinasi program sertifikasi tanah di wilayah Batam Kota',
  pengirim: 'Kementerian ATR/BPN',
  sifat: 'Segera',
  status: 'Menunggu Disposisi',
  fileUtama: 'surat-045-DP-2026.pdf',
};

export default function DetailSurat() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [instruksiTerpilih, setInstruksiTerpilih] = useState([]);
  const [instruksiTambahan, setInstruksiTambahan] = useState('');
  const [uraianDisposisi, setUraianDisposisi] = useState('');
  const [deadline, setDeadline] = useState('');
  const [bidangTerpilih, setBidangTerpilih] = useState([]);
  const [toast, setToast] = useState(null);

  const formatTanggal = (dateStr) =>
    new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

  const toggleInstruksi = (item) => {
    setInstruksiTerpilih((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleBidang = (id) => {
    setBidangTerpilih((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  const showToast = (message) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast((prev) => (prev ? { ...prev, visible: true } : null)), 10);
    setTimeout(() => setToast((prev) => (prev ? { ...prev, visible: false } : null)), 4700);
    setTimeout(() => setToast(null), 5000);
  };

  const handleSimpanDisposisi = () => {
    if (instruksiTerpilih.length === 0 && !instruksiTambahan) {
      alert('Pilih minimal 1 instruksi disposisi atau isi instruksi tambahan.');
      return;
    }
    if (bidangTerpilih.length === 0) {
      alert('Pilih minimal 1 bidang tujuan.');
      return;
    }
    const payload = {
      suratId: id,
      instruksi: instruksiTerpilih,
      instruksiTambahan,
      uraianDisposisi,
      deadline,
      bidangTujuan: bidangTerpilih,
    };
    console.log('Disposisi tersimpan:', payload);
    showToast('Disposisi berhasil disimpan dan dikirim ke bidang tujuan');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-4">
        <Link to="/naskah/rekap-belum" className="text-sm text-blue-700 hover:underline">
          ← Kembali ke Rekap Belum
        </Link>
      </div>

      {/* Info Surat */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Detail Surat Masuk</h1>
            <p className="text-gray-500 text-sm">Informasi lengkap surat dan status disposisi</p>
          </div>
          <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-yellow-50 text-yellow-700 whitespace-nowrap">
            {DUMMY_SURAT.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400 text-xs mb-0.5">Nomor Surat</p>
            <p className="text-gray-800 font-medium">{DUMMY_SURAT.noSurat}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-0.5">Tanggal Masuk</p>
            <p className="text-gray-800 font-medium">{formatTanggal(DUMMY_SURAT.tglMasuk)}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-gray-400 text-xs mb-0.5">Hal</p>
            <p className="text-gray-800 font-medium">{DUMMY_SURAT.hal}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-0.5">Pengirim</p>
            <p className="text-gray-800 font-medium">{DUMMY_SURAT.pengirim}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-0.5">Sifat</p>
            <p className="text-gray-800 font-medium">{DUMMY_SURAT.sifat}</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <a href="#" className="text-sm text-blue-700 hover:underline flex items-center gap-1.5 w-fit">
            📄 Lihat Berkas Surat: {DUMMY_SURAT.fileUtama}
          </a>
        </div>
      </div>

      {/* Form Disposisi */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-1">Disposisi Surat</h2>
        <p className="text-gray-500 text-sm mb-5">
          Tentukan instruksi disposisi, uraian arahan, dan satu atau lebih bidang tujuan
        </p>

        {/* Instruksi Disposisi */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Instruksi Disposisi <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 border border-gray-100 rounded-lg p-4">
            {INSTRUKSI_OPTIONS.map((item) => (
              <label key={item} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={instruksiTerpilih.includes(item)}
                  onChange={() => toggleInstruksi(item)}
                  className="w-4 h-4 accent-blue-700"
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        {/* Instruksi Tambahan */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Instruksi tambahan di luar pilihan checklist (opsional)
          </label>
          <textarea
            value={instruksiTambahan}
            onChange={(e) => setInstruksiTambahan(e.target.value)}
            rows={2}
            placeholder="Contoh: Mohon telaah khusus..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <p className="text-xs text-gray-400 mt-1">
            Jika teks tidak ada pada pilihan checklist, teks ini akan masuk ke kolom kosong pada lembar disposisi.
          </p>
        </div>

        {/* Uraian Disposisi */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">Uraian Disposisi</label>
          <textarea
            value={uraianDisposisi}
            onChange={(e) => setUraianDisposisi(e.target.value)}
            rows={3}
            placeholder="Tuliskan uraian disposisi untuk menuliskan arahan secara lengkap tanpa batas penulisan karakter dan isi lainnya"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Deadline */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">Deadline Tanggal Pengerjaan</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full md:w-64 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <p className="text-xs text-gray-400 mt-1">Opsional. Kosongkan jika deadline belum ditentukan.</p>
        </div>

        {/* Bidang Tujuan */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Bidang Tujuan <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {BIDANG_OPTIONS.map((bidang) => (
              <label
                key={bidang.id}
                className={`flex items-start gap-2.5 border rounded-lg px-3 py-2.5 cursor-pointer transition ${
                  bidangTerpilih.includes(bidang.id)
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={bidangTerpilih.includes(bidang.id)}
                  onChange={() => toggleBidang(bidang.id)}
                  className="w-4 h-4 accent-blue-700 mt-0.5"
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">{bidang.label}</p>
                  <p className="text-xs text-gray-400">{bidang.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex gap-3">
          <button
            onClick={handleSimpanDisposisi}
            className="bg-blue-700 hover:bg-blue-800 text-white font-medium px-6 py-2.5 rounded-lg transition"
          >
            💾 Simpan Disposisi
          </button>
          <button
            onClick={() => navigate('/naskah/rekap-belum')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-2.5 rounded-lg transition"
          >
            Kembali ke Detail
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
            toast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          <div className="bg-gray-900 text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-sm">
            <span className="text-green-400 text-lg">✓</span>
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}