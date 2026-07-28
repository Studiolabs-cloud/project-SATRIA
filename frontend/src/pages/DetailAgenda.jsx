import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function DetailAgenda() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const bisaEdit = user?.role === 'Admin';

  const [agenda, setAgenda] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [pegawaiList, setPegawaiList] = useState([]);
  const [form, setForm] = useState({
    tanggalMulai: '', tanggalSelesai: '', jamMulai: '', jamSelesai: '',
    acara: '', tempat: '', undanganDari: '', keterangan: '',
  });
  const [pesertaTerpilih, setPesertaTerpilih] = useState([]);
  const [fileBaru, setFileBaru] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchAgenda = () => {
    api.get(`/agenda/${id}`)
      .then((res) => {
        const data = res.data;
        setAgenda(data);
        setForm({
          tanggalMulai: data.tanggalMulai?.slice(0, 10) || '',
          tanggalSelesai: data.tanggalSelesai?.slice(0, 10) || '',
          jamMulai: data.jamMulai || '',
          jamSelesai: data.jamSelesai || '',
          acara: data.acara || '',
          tempat: data.tempat || '',
          undanganDari: data.undanganDari || '',
          keterangan: data.keterangan || '',
        });
        setPesertaTerpilih(data.peserta.map((p) => p.userId));
      })
      .catch((err) => console.error('Gagal ambil detail agenda:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAgenda();
    api.get('/users').then((res) => setPegawaiList(res.data)).catch(() => {});
  }, [id]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, visible: false });
    setTimeout(() => setToast((prev) => (prev ? { ...prev, visible: true } : null)), 10);
    setTimeout(() => setToast((prev) => (prev ? { ...prev, visible: false } : null)), 4600);
    setTimeout(() => setToast(null), 5000);
  };

  const formatTanggal = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const togglePeserta = (userId) => {
    setPesertaTerpilih((prev) =>
      prev.includes(userId) ? prev.filter((p) => p !== userId) : [...prev, userId]
    );
  };

  const handleSimpanEdit = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      formData.append('pesertaIds', JSON.stringify(pesertaTerpilih));
      if (fileBaru) formData.append('fileUndangan', fileBaru);

      await api.put(`/agenda/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      showToast('Kegiatan berhasil diperbarui');
      setIsEditing(false);
      setFileBaru(null);
      fetchAgenda();
    } catch (error) {
      showToast(error.response?.data?.message || 'Gagal memperbarui kegiatan', 'warning');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
    setTimeout(() => setDeleteModalVisible(true), 10);
  };
  const closeDeleteModal = () => {
    setDeleteModalVisible(false);
    setTimeout(() => setShowDeleteModal(false), 200);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/agenda/${id}`);
      showToast('Kegiatan berhasil dihapus');
      setTimeout(() => navigate('/rekap-semua'), 800);
    } catch (error) {
      showToast(error.response?.data?.message || 'Gagal menghapus kegiatan', 'warning');
      closeDeleteModal();
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-400">Memuat data...</div>;
  }

  if (!agenda) {
    return <div className="p-6 text-center text-gray-400">Kegiatan tidak ditemukan</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-4">
        <Link to="/rekap-semua" className="text-sm text-blue-700 hover:underline">
          ← Kembali ke Rekap Semua
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-start mb-5">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{isEditing ? 'Edit Kegiatan' : 'Detail Kegiatan'}</h1>
            <p className="text-gray-500 text-sm">Dibuat oleh {agenda.createdBy?.nama || '-'}</p>
          </div>
          {bisaEdit && !isEditing && (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition"
              >
                ✏️ Edit
              </button>
              <button
                onClick={openDeleteModal}
                className="text-sm bg-red-50 text-red-700 hover:bg-red-100 px-3 py-1.5 rounded-lg transition"
              >
                🗑️ Hapus
              </button>
            </div>
          )}
        </div>

        {!isEditing ? (
          // MODE TAMPILAN
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Tanggal Mulai</p>
                <p className="text-gray-800 font-medium">{formatTanggal(agenda.tanggalMulai)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Tanggal Selesai</p>
                <p className="text-gray-800 font-medium">{formatTanggal(agenda.tanggalSelesai)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Jam</p>
                <p className="text-gray-800 font-medium">
                  {agenda.jamMulai}{agenda.jamSelesai ? ` - ${agenda.jamSelesai}` : ' s.d Selesai'}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Tempat</p>
                <p className="text-gray-800 font-medium">{agenda.tempat}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-400 text-xs mb-0.5">Acara/Kegiatan</p>
                <p className="text-gray-800 font-medium">{agenda.acara}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-400 text-xs mb-0.5">Undangan Dari</p>
                <p className="text-gray-800 font-medium">{agenda.undanganDari}</p>
              </div>
              {agenda.keterangan && (
                <div className="md:col-span-2">
                  <p className="text-gray-400 text-xs mb-0.5">Keterangan</p>
                  <p className="text-gray-800 font-medium">{agenda.keterangan}</p>
                </div>
              )}
            </div>

            <div>
              <p className="text-gray-400 text-xs mb-1">Peserta ({agenda.peserta.length} orang)</p>
              <div className="flex flex-wrap gap-1.5">
                {agenda.peserta.map((p) => (
                  <span key={p.id} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                    {p.user.nama}
                  </span>
                ))}
              </div>
            </div>

           {agenda.fileUndangan && (
  <div>
    <p className="text-gray-400 text-xs mb-1">File Undangan</p>
    <a
      href={`http://localhost:3000/uploads/${agenda.fileUndangan}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-700 hover:underline text-sm"
    >
      📄 Lihat File
    </a>
  </div>
)}
          </div>
        ) : (
          // MODE EDIT
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
                <input type="date" name="tanggalMulai" value={form.tanggalMulai} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai</label>
                <input type="date" name="tanggalSelesai" value={form.tanggalSelesai} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jam Mulai</label>
                <input type="time" name="jamMulai" value={form.jamMulai} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jam Selesai</label>
                <input type="time" name="jamSelesai" value={form.jamSelesai} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Acara/Kegiatan</label>
              <textarea name="acara" value={form.acara} onChange={handleChange} rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tempat</label>
              <input type="text" name="tempat" value={form.tempat} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Undangan Dari</label>
              <input type="text" name="undanganDari" value={form.undanganDari} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Yang Menghadiri</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border border-gray-100 rounded-lg p-3 max-h-40 overflow-y-auto">
                {pegawaiList.map((pegawai) => (
                  <label key={pegawai.id} className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={pesertaTerpilih.includes(pegawai.id)}
                      onChange={() => togglePeserta(pegawai.id)}
                      className="w-4 h-4 accent-blue-700"
                    />
                    {pegawai.nama}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ganti File Undangan (opsional)</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setFileBaru(e.target.files[0])}
                className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-700 file:text-white hover:file:bg-blue-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
              <textarea name="keterangan" value={form.keterangan} onChange={handleChange} rows={2}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSimpanEdit}
                disabled={isSubmitting}
                className="bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-medium px-6 py-2.5 rounded-lg transition"
              >
                {isSubmitting ? 'Menyimpan...' : '💾 Simpan Perubahan'}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-2.5 rounded-lg transition"
              >
                Batal
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Konfirmasi Hapus */}
      {showDeleteModal && (
        <div
          onClick={closeDeleteModal}
          className={`fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 transition-opacity duration-200 ${
            deleteModalVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`bg-white rounded-xl shadow-lg w-full max-w-sm p-6 transition-all duration-200 ease-out ${
              deleteModalVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-red-600 text-xl">⚠️</span>
              </div>
              <h2 className="text-lg font-bold text-gray-800">Hapus Kegiatan?</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus kegiatan{' '}
              <span className="font-semibold text-gray-800">{agenda.acara}</span>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition"
              >
                Ya, Hapus
              </button>
              <button
                onClick={closeDeleteModal}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg transition"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
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