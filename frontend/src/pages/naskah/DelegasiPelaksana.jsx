import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

// Data dummy pelaksana per bidang, nanti fetch dari API master pegawai
const DUMMY_PELAKSANA = [
  { id: 1, nama: 'Ahmad Fauzi', jabatan: 'Staf Penatagunaan Tanah' },
  { id: 2, nama: 'Dewi Lestari', jabatan: 'Staf Pengawasan Masalah' },
  { id: 3, nama: 'Maya Sari', jabatan: 'Staf Sekretariat' },
  { id: 4, nama: 'Rudi Hartono', jabatan: 'Staf Pengadaan Tanah' },
];

// Data dummy surat + assignment, nanti fetch dari API berdasarkan :id
const DUMMY_ASSIGNMENT = {
  id: 1,
  noSurat: '045/DP/2026',
  hal: 'Permohonan koordinasi program sertifikasi tanah di wilayah Batam Kota',
  pengirim: 'Kementerian ATR/BPN',
  bidangUnit: 'Penatagunaan & Pendayagunaan Tanah',
  statusAssignment: 'Belum Didelegasikan',
  didelegasikanOleh: '-',
  waktuDelegasi: '-',
  deadline: '2026-07-24',
};

export default function DelegasiPelaksana() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pelaksanaTerpilih, setPelaksanaTerpilih] = useState([]);
  const [dikerjakanLangsung, setDikerjakanLangsung] = useState(false);
  const [toast, setToast] = useState(null);

  const formatTanggal = (dateStr) => {
    if (dateStr === '-') return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const togglePelaksana = (pelaksanaId) => {
    setPelaksanaTerpilih((prev) =>
      prev.includes(pelaksanaId) ? prev.filter((p) => p !== pelaksanaId) : [...prev, pelaksanaId]
    );
  };

  const handleDikerjakanLangsungChange = () => {
    setDikerjakanLangsung((prev) => !prev);
    if (!dikerjakanLangsung) {
      setPelaksanaTerpilih([]); // kosongkan pilihan pelaksana kalau dikerjakan langsung oleh pimpinan bidang
    }
  };

  const showToast = (message) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast((prev) => (prev ? { ...prev, visible: true } : null)), 10);
    setTimeout(() => setToast((prev) => (prev ? { ...prev, visible: false } : null)), 4700);
    setTimeout(() => setToast(null), 5000);
  };

  const handleSimpanDelegasi = () => {
    if (!dikerjakanLangsung && pelaksanaTerpilih.length === 0) {
      alert('Pilih minimal 1 pelaksana, atau centang "Dikerjakan langsung oleh pimpinan bidang".');
      return;
    }
    const payload = {
      assignmentId: id,
      pelaksana: dikerjakanLangsung ? [] : pelaksanaTerpilih,
      dikerjakanLangsung,
    };
    console.log('Delegasi tersimpan:', payload);
    showToast('Delegasi berhasil disimpan dan notifikasi WhatsApp telah dikirim');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-4">
        <Link to="/naskah/rekap-belum" className="text-sm text-blue-700 hover:underline">
          ← Kembali ke Rekap Belum
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="mb-5">
          <h1 className="text-xl font-bold text-gray-800">Delegasi ke Pelaksana</h1>
          <p className="text-gray-500 text-sm">
            Pimpinan bidang/unit dapat memilih satu atau lebih pelaksana pada bidang/unit yang sama untuk menindaklanjuti assignment ini.
          </p>
        </div>

        {/* Info Assignment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm border border-gray-100 rounded-lg p-4 mb-6">
          <div>
            <p className="text-gray-400 text-xs mb-0.5">Nomor Surat</p>
            <p className="text-gray-800 font-medium">{DUMMY_ASSIGNMENT.noSurat}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-0.5">Bidang/Unit</p>
            <p className="text-gray-800 font-medium">{DUMMY_ASSIGNMENT.bidangUnit}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-gray-400 text-xs mb-0.5">Hal</p>
            <p className="text-gray-800 font-medium">{DUMMY_ASSIGNMENT.hal}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-0.5">Pengirim</p>
            <p className="text-gray-800 font-medium">{DUMMY_ASSIGNMENT.pengirim}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-0.5">Status Assignment</p>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-50 text-yellow-700 inline-block">
              {DUMMY_ASSIGNMENT.statusAssignment}
            </span>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-0.5">Didelegasikan Oleh</p>
            <p className="text-gray-800 font-medium">{DUMMY_ASSIGNMENT.didelegasikanOleh}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-0.5">Deadline</p>
            <p className="text-gray-800 font-medium">{formatTanggal(DUMMY_ASSIGNMENT.deadline)}</p>
          </div>
        </div>

        {/* Pilih Pelaksana */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Pilih Pelaksana</label>

          <label className="flex items-center gap-2 mb-3 text-sm text-gray-700 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2.5">
            <input
              type="checkbox"
              checked={dikerjakanLangsung}
              onChange={handleDikerjakanLangsungChange}
              className="w-4 h-4 accent-blue-700"
            />
            Dikerjakan langsung oleh pimpinan bidang/unit (tidak didelegasikan ke pelaksana)
          </label>

          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-2 border border-gray-100 rounded-lg p-3 transition ${
              dikerjakanLangsung ? 'opacity-40 pointer-events-none' : ''
            }`}
          >
            {DUMMY_PELAKSANA.map((pelaksana) => (
              <label
                key={pelaksana.id}
                className={`flex items-center gap-2.5 border rounded-lg px-3 py-2 cursor-pointer transition ${
                  pelaksanaTerpilih.includes(pelaksana.id)
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-100 hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={pelaksanaTerpilih.includes(pelaksana.id)}
                  onChange={() => togglePelaksana(pelaksana.id)}
                  className="w-4 h-4 accent-blue-700"
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">{pelaksana.nama}</p>
                  <p className="text-xs text-gray-400">{pelaksana.jabatan}</p>
                </div>
              </label>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Centang satu atau lebih pelaksana. Kosongkan semua jika assignment dikerjakan langsung oleh pimpinan bidang/unit.
          </p>
        </div>

        {/* Tombol Aksi */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSimpanDelegasi}
            className="bg-blue-700 hover:bg-blue-800 text-white font-medium px-6 py-2.5 rounded-lg transition"
          >
            💾 Simpan Delegasi
          </button>
          <button
            onClick={() => navigate(`/naskah/detail/${id}`)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-2.5 rounded-lg transition"
          >
            Kembali ke Detail Surat
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