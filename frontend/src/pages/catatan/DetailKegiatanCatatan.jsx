import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Data dummy, nanti fetch dari API berdasarkan :id
const DUMMY_KEGIATAN = {
  id: 1,
  tanggal: '2026-07-21',
  acara: 'Rapat Koordinasi Pertanahan',
  tempat: 'Ruang Rapat Dinas',
  peserta: ['Budi Santoso', 'Siti Aminah', 'Ahmad Fauzi'],
};

export default function DetailKegiatanCatatan() {
  const { id } = useParams();
  const { user } = useAuth();

  const [catatan, setCatatan] = useState('');
  const [fileNotulen, setFileNotulen] = useState(null);
  const [terkunci, setTerkunci] = useState(false);
  const [showRequestEdit, setShowRequestEdit] = useState(false);
  const [alasanEdit, setAlasanEdit] = useState('');

  const [uraianLanjutan, setUraianLanjutan] = useState('');
  const [picLanjutan, setPicLanjutan] = useState('');
  const [deadlineLanjutan, setDeadlineLanjutan] = useState('');
  const [lanjutanTersimpan, setLanjutanTersimpan] = useState(false);

  const [toast, setToast] = useState(null);

  // Kepala Bidang wajib upload file, staf biasa cukup isi catatan
  const wajibUploadFile = user?.role === 'Kepala Bidang';
  const bisaMengisi = ['Admin', 'Kepala Bidang', 'Pelaksana'].includes(user?.role);
  const formatTanggal = (dateStr) =>
    new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

 const showToast = (message, type = 'success') => {
  setToast({ message, type, visible: false });
  setTimeout(() => setToast((prev) => (prev ? { ...prev, visible: true } : null)), 10);
  setTimeout(() => setToast((prev) => (prev ? { ...prev, visible: false } : null)), 4600);
  setTimeout(() => setToast(null), 5000);
};

  const handleFileChange = (e) => {
    setFileNotulen(e.target.files[0]);
  };

 const handleSimpanNotulen = () => {
  if (!catatan.trim()) {
    showToast('Isi catatan kegiatan terlebih dahulu.', 'warning');
    return;
  }
  if (wajibUploadFile && !fileNotulen) {
    showToast('Kepala Bidang wajib mengunggah file notulen.', 'warning');
    return;
  }
    console.log('Notulen tersimpan:', { kegiatanId: id, catatan, file: fileNotulen?.name });
    setTerkunci(true);
    showToast('Notulen berhasil disimpan dan dikunci');
  };

 const handleKirimPermintaanEdit = () => {
  if (!alasanEdit.trim()) {
    showToast('Jelaskan bagian yang perlu diperbaiki.', 'warning');
    return;
  }
    console.log('Permintaan edit dikirim:', { kegiatanId: id, alasan: alasanEdit });
    showToast('Permintaan edit telah dikirim ke Admin');
    setShowRequestEdit(false);
    setAlasanEdit('');
  };

 const handleSimpanLanjutan = () => {
  if (!uraianLanjutan.trim()) {
    showToast('Isi uraian tindak lanjut terlebih dahulu.', 'warning');
    return;
  }
    console.log('Lanjutan tersimpan:', { kegiatanId: id, uraianLanjutan, picLanjutan, deadlineLanjutan });
    setLanjutanTersimpan(true);
    showToast('Rencana tindak lanjut berhasil disimpan');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-4">
        <Link to="/catatan/daftar-kegiatan" className="text-sm text-blue-700 hover:underline">
          ← Kembali ke Daftar Kegiatan
        </Link>
      </div>

      {/* Info Kegiatan */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-5">
        <h1 className="text-xl font-bold text-gray-800 mb-1">{DUMMY_KEGIATAN.acara}</h1>
        <p className="text-gray-500 text-sm mb-4">Detail kegiatan dan pengisian notulen</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm border-t border-gray-100 pt-4">
          <div>
            <p className="text-gray-400 text-xs mb-0.5">Tanggal</p>
            <p className="text-gray-800 font-medium">{formatTanggal(DUMMY_KEGIATAN.tanggal)}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-0.5">Tempat</p>
            <p className="text-gray-800 font-medium">{DUMMY_KEGIATAN.tempat}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-gray-400 text-xs mb-0.5">Peserta</p>
            <p className="text-gray-800 font-medium">{DUMMY_KEGIATAN.peserta.join(', ')}</p>
          </div>
        </div>
      </div>

      {/* Isi Notulen */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">📝 Notulen / Catatan Kegiatan</h2>
          {terkunci && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
              🔒 Terkunci
            </span>
          )}
        </div>

        {!bisaMengisi && (
        <div className="bg-blue-50 text-blue-700 text-sm px-4 py-2.5 rounded-lg mb-4">
        👁️ Anda memantau kegiatan ini dalam mode tampilan saja. Hanya Admin, Kepala Bidang, atau Pelaksana yang dapat mengisi notulen.
        </div>
         )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            File Notulen/Catatan {wajibUploadFile && <span className="text-red-500">*</span>}
          </label>
          <input
           type="file"
           accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
           disabled={terkunci || !bisaMengisi}
           onChange={handleFileChange}
          className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-700 file:text-white hover:file:bg-blue-800 disabled:opacity-50"
          />
          <p className="text-xs text-gray-400 mt-1">
            Format PDF, DOC, DOCX, JPG, PNG. {wajibUploadFile ? 'Kepala Bidang wajib mengunggah file, staf boleh hanya mengisi catatan.' : ''}
          </p>
          {fileNotulen && <p className="text-xs text-green-700 mt-1">✓ {fileNotulen.name}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Kegiatan</label>
          <textarea
          value={catatan}
          onChange={(e) => setCatatan(e.target.value)}
          disabled={terkunci || !bisaMengisi}
          rows={4}
          placeholder={bisaMengisi ? 'Tuliskan catatan kegiatan dengan bahasa singkat, jelas, dan sesuai hasil kegiatan...' : 'Belum ada catatan kegiatan.'}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-50 disabled:text-gray-600"
          />
        </div>

        {!terkunci ? (
  bisaMengisi && (
    <button
      onClick={handleSimpanNotulen}
      className="bg-blue-700 hover:bg-blue-800 text-white font-medium px-6 py-2.5 rounded-lg transition"
    >
      💾 Simpan
    </button>
  )
) : (
  <>
    {bisaMengisi && !showRequestEdit ? (
              <button
                onClick={() => setShowRequestEdit(true)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-5 py-2 rounded-lg transition text-sm"
              >
                ✏️ Minta Edit
              </button>
            ) : (
              <div className="bg-yellow-50 rounded-lg p-4 mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jelaskan bagian yang perlu diperbaiki
                </label>
                <textarea
                  value={alasanEdit}
                  onChange={(e) => setAlasanEdit(e.target.value)}
                  rows={2}
                  placeholder="Contoh: Ada kesalahan penulisan pada bagian keputusan rapat..."
                  className="w-full border border-yellow-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 mb-3"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleKirimPermintaanEdit}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                  >
                    Kirim Permintaan
                  </button>
                  <button
                    onClick={() => setShowRequestEdit(false)}
                    className="bg-white hover:bg-gray-50 text-gray-600 text-sm font-medium px-4 py-2 rounded-lg border border-gray-200 transition"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Rencana Tindak Lanjut */}
      {/* Rencana Tindak Lanjut */}
<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
  <h2 className="text-lg font-bold text-gray-800 mb-1">🔄 Rencana Tindak Lanjut</h2>
  <p className="text-gray-500 text-sm mb-4">Isi jika kegiatan menghasilkan rencana lanjutan</p>

  {!bisaMengisi && !lanjutanTersimpan && (
    <p className="text-sm text-gray-400 italic">Belum ada rencana tindak lanjut.</p>
  )}

  {lanjutanTersimpan ? (
          <div className="bg-purple-50 text-purple-800 rounded-lg p-4 text-sm">
            <p className="font-semibold mb-1">✓ Rencana Lanjutan Tersimpan</p>
            <p className="mb-1">{uraianLanjutan}</p>
            <p className="text-xs opacity-80">
              PIC: {picLanjutan || '-'} {deadlineLanjutan && `• Batas waktu: ${formatTanggal(deadlineLanjutan)}`}
            </p>
          </div>
        ) : bisaMengisi ? (
          <>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Uraian Tindak Lanjut</label>
              <textarea
                value={uraianLanjutan}
                onChange={(e) => setUraianLanjutan(e.target.value)}
                rows={2}
                placeholder="Rencana kegiatan lanjutan yang perlu dilakukan..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PIC (opsional)</label>
                <input
                  type="text"
                  value={picLanjutan}
                  onChange={(e) => setPicLanjutan(e.target.value)}
                  placeholder="Nama penanggung jawab"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Batas Waktu (opsional)</label>
                <input
                  type="date"
                  value={deadlineLanjutan}
                  onChange={(e) => setDeadlineLanjutan(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
            <button
              onClick={handleSimpanLanjutan}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2.5 rounded-lg transition"
            >
              💾 Simpan Rencana Lanjutan
            </button>
          </>
        ) : null}
      </div>

      {/* Toast Notification */}
     {/* Toast Notification */}
{toast && (
 <div
  className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ease-out ${
    toast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
  }`}
>
    <div className="bg-gray-900 text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-sm">
      <span className={`text-lg ${toast.type === 'warning' ? 'text-yellow-400' : 'text-green-400'}`}>
        {toast.type === 'warning' ? '⚠' : '✓'}
      </span>
      <p className="text-sm font-medium">{toast.message}</p>
    </div>
  </div>
)}
    </div>
  );
}