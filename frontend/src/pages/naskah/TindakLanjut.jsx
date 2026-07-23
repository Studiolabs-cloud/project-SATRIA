import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

// Data dummy, nanti fetch dari API berdasarkan :id
const DUMMY_SURAT = {
  id: 1,
  noSurat: '045/DP/2026',
  hal: 'Permohonan koordinasi program sertifikasi tanah di wilayah Batam Kota',
  bidangUnit: 'Penatagunaan & Pendayagunaan Tanah',
  ditugaskanKe: 'Ahmad Fauzi',
  deadline: '2026-07-24',
};

export default function TindakLanjut() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State tindak lanjut (pelaksana)
  const [uraianPekerjaan, setUraianPekerjaan] = useState('');
  const [buktiFiles, setBuktiFiles] = useState([]);
  const [sudahDisubmit, setSudahDisubmit] = useState(false);

  // State verifikasi (pimpinan)
  const [catatanVerifikasi, setCatatanVerifikasi] = useState('');
  const [hasilVerifikasi, setHasilVerifikasi] = useState(null); // 'selesai' | 'kembalikan'

  const [toast, setToast] = useState(null);

  const formatTanggal = (dateStr) =>
    new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

  const showToast = (message) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast((prev) => (prev ? { ...prev, visible: true } : null)), 10);
    setTimeout(() => setToast((prev) => (prev ? { ...prev, visible: false } : null)), 4700);
    setTimeout(() => setToast(null), 5000);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setBuktiFiles((prev) => [...prev, ...files]);
  };

  const hapusFile = (index) => {
    setBuktiFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSimpanTindakLanjut = () => {
    if (!uraianPekerjaan.trim()) {
      alert('Isi uraian pekerjaan terlebih dahulu.');
      return;
    }
    console.log('Tindak lanjut tersimpan:', {
      suratId: id,
      uraianPekerjaan,
      bukti: buktiFiles.map((f) => f.name),
    });
    setSudahDisubmit(true);
    showToast('Tindak lanjut berhasil disimpan. Menunggu verifikasi pimpinan.');
  };

  const handleVerifikasiSelesai = () => {
    setHasilVerifikasi('selesai');
    console.log('Diverifikasi selesai:', { suratId: id, catatan: catatanVerifikasi });
    showToast('Surat berhasil diverifikasi sebagai Selesai');
  };

  const handleBelumSelesai = () => {
    if (!catatanVerifikasi.trim()) {
      alert('Catatan wajib diisi jika mengembalikan tindak lanjut.');
      return;
    }
    setHasilVerifikasi('kembalikan');
    console.log('Dikembalikan:', { suratId: id, catatan: catatanVerifikasi });
    showToast('Tindak lanjut dikembalikan ke pelaksana untuk diperbaiki');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-4">
        <Link to="/naskah/rekap-belum" className="text-sm text-blue-700 hover:underline">
          ← Kembali ke Rekap Belum
        </Link>
      </div>

      {/* Info Surat */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-5">
        <h1 className="text-xl font-bold text-gray-800 mb-1">Tindak Lanjut Surat</h1>
        <p className="text-gray-500 text-sm mb-4">Isi progres pekerjaan dan verifikasi hasil tindak lanjut</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm border-t border-gray-100 pt-4">
          <div>
            <p className="text-gray-400 text-xs mb-0.5">Nomor Surat</p>
            <p className="text-gray-800 font-medium">{DUMMY_SURAT.noSurat}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-0.5">Bidang/Unit</p>
            <p className="text-gray-800 font-medium">{DUMMY_SURAT.bidangUnit}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-gray-400 text-xs mb-0.5">Hal</p>
            <p className="text-gray-800 font-medium">{DUMMY_SURAT.hal}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-0.5">Ditugaskan Kepada</p>
            <p className="text-gray-800 font-medium">{DUMMY_SURAT.ditugaskanKe}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-0.5">Deadline</p>
            <p className="text-gray-800 font-medium">{formatTanggal(DUMMY_SURAT.deadline)}</p>
          </div>
        </div>
      </div>

      {/* Bagian 1: Isi Tindak Lanjut (Pelaksana) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">📝 Isi Tindak Lanjut</h2>
          {sudahDisubmit && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
              Sudah Disubmit
            </span>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Uraian Pekerjaan <span className="text-red-500">*</span>
          </label>
          <textarea
            value={uraianPekerjaan}
            onChange={(e) => setUraianPekerjaan(e.target.value)}
            disabled={sudahDisubmit}
            rows={4}
            placeholder="Jelaskan hasil pemeriksaan, tindakan yang sudah dilakukan, atau kendala yang masih ada..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Bukti Pendukung (opsional)</label>
          <input
            type="file"
            multiple
            disabled={sudahDisubmit}
            onChange={handleFileChange}
            className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-700 file:text-white hover:file:bg-blue-800 disabled:opacity-50"
          />
          <p className="text-xs text-gray-400 mt-1">PDF, Word, Excel, atau gambar sesuai kebutuhan</p>

          {buktiFiles.length > 0 && (
            <div className="mt-2 space-y-1">
              {buktiFiles.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-1.5 text-sm">
                  <span className="text-gray-700">📎 {file.name}</span>
                  {!sudahDisubmit && (
                    <button onClick={() => hapusFile(idx)} className="text-red-600 text-xs hover:underline">
                      Hapus
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {!sudahDisubmit && (
          <button
            onClick={handleSimpanTindakLanjut}
            className="bg-blue-700 hover:bg-blue-800 text-white font-medium px-6 py-2.5 rounded-lg transition"
          >
            💾 Simpan Tindak Lanjut
          </button>
        )}
      </div>

      {/* Bagian 2: Verifikasi Hasil (Pimpinan) */}
      <div
        className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition ${
          !sudahDisubmit ? 'opacity-40 pointer-events-none' : ''
        }`}
      >
        <h2 className="text-lg font-bold text-gray-800 mb-1">✅ Verifikasi Hasil Tindak Lanjut</h2>
        <p className="text-gray-500 text-sm mb-4">
          {sudahDisubmit
            ? 'Pimpinan memeriksa hasil tindak lanjut dan menentukan status penyelesaian'
            : 'Menunggu pelaksana menyelesaikan tindak lanjut terlebih dahulu'}
        </p>

        {hasilVerifikasi ? (
          <div
            className={`rounded-lg p-4 text-sm ${
              hasilVerifikasi === 'selesai' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}
          >
            <p className="font-semibold mb-1">
              {hasilVerifikasi === 'selesai' ? '✓ Diverifikasi Selesai' : '↩ Dikembalikan ke Pelaksana'}
            </p>
            {catatanVerifikasi && <p className="text-xs opacity-80">Catatan: {catatanVerifikasi}</p>}
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catatan (opsional, wajib jika dikembalikan)
              </label>
              <textarea
                value={catatanVerifikasi}
                onChange={(e) => setCatatanVerifikasi(e.target.value)}
                rows={2}
                placeholder="Catatan opsional untuk verifikasi selesai, wajib jika dikembalikan"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleVerifikasiSelesai}
                className="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2.5 rounded-lg transition"
              >
                ✓ Verifikasi Selesai
              </button>
              <button
                onClick={handleBelumSelesai}
                className="bg-red-50 hover:bg-red-100 text-red-700 font-medium px-5 py-2.5 rounded-lg border border-red-200 transition"
              >
                ↩ Belum Selesai / Kembalikan
              </button>
            </div>
          </>
        )}
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