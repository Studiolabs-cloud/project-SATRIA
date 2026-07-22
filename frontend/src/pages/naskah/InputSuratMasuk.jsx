// frontend/src/pages/naskah/InputSuratMasuk.jsx

import { useState } from 'react';

const SIFAT_OPTIONS = ['(-) Tidak ada', 'Biasa', 'Segera', 'Sangat Segera', 'Rahasia'];

export default function InputSuratMasuk() {
  const [form, setForm] = useState({
    noUrut: '133',
    tglTerima: '',
    tglSurat: '',
    noSurat: '',
    hal: '',
    asalSurat: '',
    sifat: SIFAT_OPTIONS[0],
    deadlineTindakLanjut: '',
    keteranganAdmin: '',
  });

  const [fileUtama, setFileUtama] = useState(null);
  const [fotoTersimpan, setFotoTersimpan] = useState([]);
  const [lampiranFiles, setLampiranFiles] = useState([]);
  const [uploadMode, setUploadMode] = useState(null);
  const [toast, setToast] = useState(null); 
  const [showKembaliModal, setShowKembaliModal] = useState(false);
  const [kembaliModalVisible, setKembaliModalVisible] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileUtamaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileUtama(file);
      setUploadMode('file');
      setFotoTersimpan([]); // reset mode foto kalau pilih upload file
    }
  };

  const handleFotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const previews = files.map((f) => ({
        name: f.name,
        url: URL.createObjectURL(f),
      }));
      setFotoTersimpan((prev) => [...prev, ...previews]);
      setUploadMode('foto');
      setFileUtama(null); // reset mode file kalau pilih foto
    }
  };

  const hapusFoto = (index) => {
    setFotoTersimpan((prev) => prev.filter((_, i) => i !== index));
  };

  const handleLampiranChange = (e) => {
    const files = Array.from(e.target.files);
    setLampiranFiles((prev) => [...prev, ...files]);
  };

  const hapusLampiran = (index) => {
    setLampiranFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const buildPayload = () => ({
  ...form,
  fileUtama: fileUtama?.name || null,
  fotoTersimpan: fotoTersimpan.map((f) => f.name),
  lampiran: lampiranFiles.map((f) => f.name),
});

const handleSimpanDraft = (e) => {
  e.preventDefault();
  const payload = { ...buildPayload(), status: 'draft' };
  console.log('Draft tersimpan:', payload);
  // Nanti: axios.post('/api/naskah/surat-masuk', payload)
  showToast('Naskah disimpan sebagai Draft');
};

const handleSubmit = (e) => {
  e.preventDefault();
  const payload = { ...buildPayload(), status: 'submitted' };
  console.log('Naskah disubmit:', payload);
  // Nanti: axios.post('/api/naskah/surat-masuk', payload)
  showToast('Naskah sudah disubmit Ke Pimpinan');
};

 const handleKembali = () => {
  setShowKembaliModal(true);
  setTimeout(() => setKembaliModalVisible(true), 10);
};

const closeKembaliModal = () => {
  setKembaliModalVisible(false);
  setTimeout(() => setShowKembaliModal(false), 200);
};

const confirmKembali = () => {
  window.history.back();
};
    const showToast = (message) => {
    setToast({ message, visible: true });
     // Trigger animasi masuk
     setTimeout(() => setToast((prev) => (prev ? { ...prev, visible: true } : null)), 10);
     // Mulai animasi keluar setelah 4.7 detik
     setTimeout(() => setToast((prev) => (prev ? { ...prev, visible: false } : null)), 4700);
      // Hapus total dari DOM setelah 5 detik
      setTimeout(() => setToast(null), 5000);
};

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Input Surat Masuk</h1>
        <p className="text-gray-500 text-sm">Form pencatatan surat masuk baru oleh admin, kadis, atau pengelola surat</p>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
        {/* Baris 1: No Urut, Tgl Terima, Tgl Surat, No Surat */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No Urut</label>
            <input
              type="text"
              name="noUrut"
              value={form.noUrut}
              onChange={handleChange}
              readOnly
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tgl Terima Surat <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="tglTerima"
              value={form.tglTerima}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tgl Surat <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="tglSurat"
              value={form.tglSurat}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Surat</label>
            <input
              type="text"
              name="noSurat"
              value={form.noSurat}
              onChange={handleChange}
              placeholder="045/DP/2026"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
        </div>

        {/* Hal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hal <span className="text-red-500">*</span>
          </label>
          <textarea
            name="hal"
            value={form.hal}
            onChange={handleChange}
            required
            rows={2}
            placeholder="Perihal atau ringkasan isi surat"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        {/* Asal Surat & Sifat */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Asal Surat <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="asalSurat"
              value={form.asalSurat}
              onChange={handleChange}
              required
              placeholder="Instansi/lembaga pengirim"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sifat</label>
            <select
              name="sifat"
              value={form.sifat}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              {SIFAT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Berkas Utama Surat Masuk */}
        <div className="border border-gray-100 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-semibold text-gray-800">Berkas Utama Surat Masuk</label>
            <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
              {fileUtama ? '1 file' : fotoTersimpan.length > 0 ? `${fotoTersimpan.length} foto tersimpan` : '0 foto tersimpan'}
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-3">
            Unggah file utama surat, atau ambil foto langsung apabila surat masih berbentuk fisik.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Upload File */}
            <div className="border border-dashed border-gray-200 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-1">📤 Upload File Utama Surat</p>
              <p className="text-xs text-gray-400 mb-2">PDF, Word, Excel, atau gambar. Maksimal 10 MB.</p>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                onChange={handleFileUtamaChange}
                className="w-full text-xs text-gray-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-green-700 file:text-white file:text-xs hover:file:bg-green-800"
              />
              {fileUtama && <p className="text-xs text-green-700 mt-2">✓ {fileUtama.name}</p>}
            </div>

            {/* Foto Langsung / Pilih Foto */}
            <div className="border border-dashed border-gray-200 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-1">📷 Foto Surat Langsung</p>
              <p className="text-xs text-gray-400 mb-2">Untuk surat beberapa halaman, ambil foto tiap halaman berurutan.</p>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                onChange={handleFotoChange}
                className="w-full text-xs text-gray-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-green-700 file:text-white file:text-xs hover:file:bg-green-800"
              />
            </div>
          </div>

          {/* Preview Foto Tersimpan */}
          {fotoTersimpan.length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2">Foto Surat Tersimpan (akan digabung jadi 1 PDF):</p>
              <div className="flex flex-wrap gap-3">
                {fotoTersimpan.map((foto, idx) => (
                  <div key={idx} className="relative w-20 h-20 border border-gray-200 rounded-lg overflow-hidden group">
                    <img src={foto.url} alt={`Halaman ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => hapusFoto(idx)}
                      className="absolute top-0.5 right-0.5 bg-red-600 text-white text-xs w-5 h-5 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      ✕
                    </button>
                    <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-0.5">
                      Hal {idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Lampiran Surat (opsional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lampiran Surat (opsional)</label>
          <p className="text-xs text-gray-400 mb-2">
            Dokumen pendukung, daftar, foto, Excel, atau file lain. Disimpan terpisah dari berkas utama.
          </p>
          <input
            type="file"
            multiple
            onChange={handleLampiranChange}
            className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
          />
          {lampiranFiles.length > 0 && (
            <div className="mt-2 space-y-1">
              {lampiranFiles.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-1.5 text-sm">
                  <span className="text-gray-700">📎 {file.name}</span>
                  <button
                    type="button"
                    onClick={() => hapusLampiran(idx)}
                    className="text-red-600 text-xs hover:underline"
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Deadline Tindak Lanjut */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Deadline Tindak Lanjut (opsional)</label>
          <input
            type="date"
            name="deadlineTindakLanjut"
            value={form.deadlineTindakLanjut}
            onChange={handleChange}
            className="w-full md:w-64 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <p className="text-xs text-gray-400 mt-1">Isi bila surat memiliki batas waktu tindak lanjut</p>
        </div>

        {/* Keterangan Admin */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan Admin</label>
          <textarea
            name="keteranganAdmin"
            value={form.keteranganAdmin}
            onChange={handleChange}
            rows={2}
            placeholder="Catatan tambahan terkait surat masuk (opsional)"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

       {/* Tombol Aksi */}
        <div className="flex flex-wrap gap-3 pt-2">
        <button
            type="button"
            onClick={handleSimpanDraft}
            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-medium px-6 py-2.5 rounded-lg transition"
        >
        📝 Simpan sebagai Draft
        </button>
        <button
        type="button"
        onClick={handleSubmit}
        className="bg-green-700 hover:bg-green-800 text-white font-medium px-6 py-2.5 rounded-lg transition"
        >
        ✅ Submit
        </button>
        <button
        type="button"
        onClick={handleKembali}
        className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-2.5 rounded-lg transition"
        >
    Kembali
  </button>
</div>
     </form>

      {/* Toast Notification */}
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

      {/* Modal Konfirmasi Kembali */}
      {showKembaliModal && (
        <div
          onClick={closeKembaliModal}
          className={`fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 transition-opacity duration-200 ${
            kembaliModalVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`bg-white rounded-xl shadow-lg w-full max-w-sm p-6 transition-all duration-200 ease-out ${
              kembaliModalVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-yellow-600 text-xl">⚠️</span>
              </div>
              <h2 className="text-lg font-bold text-gray-800">Batalkan Pengisian?</h2>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Data yang sudah Anda isi pada form ini akan hilang dan tidak dapat dikembalikan.
            </p>

            <div className="flex gap-3">
              <button
                onClick={confirmKembali}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition"
              >
                Ya, Batalkan
              </button>
              <button
                onClick={closeKembaliModal}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg transition"
              >
                Lanjut Isi Form
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}