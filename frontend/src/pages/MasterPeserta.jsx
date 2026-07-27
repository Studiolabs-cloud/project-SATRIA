// frontend/src/pages/MasterPeserta.jsx
import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
// Data dummy, nanti diganti fetch dari API

export default function MasterPeserta() {
  const [pesertaList, setPesertaList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPeserta = () => {
    api.get('/users')
      .then((res) => setPesertaList(res.data))
      .catch((err) => console.error('Gagal ambil data peserta:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPeserta();
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
 const [formData, setFormData] = useState({ username: '', password: '', nama: '', role: 'Pelaksana', bidang: '', noWa: '' });
const ROLE_OPTIONS = ['Admin', 'Kepala Badan', 'Sekretaris', 'Pengelola Surat', 'Kepala Bidang', 'Fungsional', 'Pelaksana'];
const BIDANG_OPTIONS = ['Sekretariat', 'PPM', 'PSDA', 'IPW', 'PPEPD'];
const perluBidang = ['Kepala Bidang', 'Pelaksana'].includes(formData.role);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // simpan objek peserta yang mau dihapus
const [deleteModalVisible, setDeleteModalVisible] = useState(false);

const { user } = useAuth();
const isAdmin = user?.role === 'Admin';
const [toast, setToast] = useState(null);
const [resetTarget, setResetTarget] = useState(null);
const [resetModalVisible, setResetModalVisible] = useState(false);
const [newPassword, setNewPassword] = useState('');


const showToast = (message, type = 'success') => {
  setToast({ message, type, visible: false });
  setTimeout(() => setToast((prev) => (prev ? { ...prev, visible: true } : null)), 10);
  setTimeout(() => setToast((prev) => (prev ? { ...prev, visible: false } : null)), 4600);
  setTimeout(() => setToast(null), 5000);
};
  const dataFiltered = pesertaList.filter(
  (p) =>
    p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.role.toLowerCase().includes(searchTerm.toLowerCase())
);

 const openTambahModal = () => {
  setEditingId(null);
  setFormData({ username: '', password: '', nama: '', role: 'Pelaksana', bidang: '', noWa: '' });
  setShowModal(true);
  setTimeout(() => setModalVisible(true), 10);
};

const openEditModal = (peserta) => {
  setEditingId(peserta.id);
  setFormData({ username: peserta.username, password: '', nama: peserta.nama, role: peserta.role, bidang: peserta.bidang || '', noWa: peserta.noWa || '' });
  setShowModal(true);
  setTimeout(() => setModalVisible(true), 10);
};
const closeModal = () => {
  setModalVisible(false);
  setTimeout(() => setShowModal(false), 200);
};

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    if (editingId) {
      await api.put(`/users/${editingId}`, {
        username: formData.username,
        nama: formData.nama,
        role: formData.role,
        bidang: formData.bidang,
        noWa: formData.noWa,
      });
      showToast('Data peserta berhasil diperbarui');
    } else {
      await api.post('/users', formData);
      showToast('Peserta baru berhasil ditambahkan');
    }
    fetchPeserta();
    closeModal();
  } catch (error) {
    showToast(error.response?.data?.message || 'Gagal menyimpan data peserta', 'warning');
  }
};
const handleNoWaChange = (e) => {
  const onlyNumbers = e.target.value.replace(/[^0-9]/g, '');
  setFormData({ ...formData, noWa: onlyNumbers });
};
 const openDeleteModal = (peserta) => {
  setDeleteTarget(peserta);
  setTimeout(() => setDeleteModalVisible(true), 10);
};

const closeDeleteModal = () => {
  setDeleteModalVisible(false);
  setTimeout(() => setDeleteTarget(null), 200);
};

const openResetModal = (peserta) => {
  setResetTarget(peserta);
  setNewPassword('');
  setTimeout(() => setResetModalVisible(true), 10);
};

const confirmDelete = async () => {
  try {
    await api.delete(`/users/${deleteTarget.id}`);
    fetchPeserta();
    closeDeleteModal();
    showToast('Peserta berhasil dihapus');
  } catch (error) {
    showToast(error.response?.data?.message || 'Gagal menghapus peserta', 'warning');
  }
};
const closeResetModal = () => {
  setResetModalVisible(false);
  setTimeout(() => setResetTarget(null), 200);
};

const confirmResetPassword = async () => {
  if (!newPassword || newPassword.length < 6) {
    showToast('Password baru minimal 6 karakter', 'warning');
    return;
  }
  try {
    await api.put(`/users/${resetTarget.id}/reset-password`, { newPassword });
    closeResetModal();
    showToast(`Password untuk ${resetTarget.nama} berhasil direset`);
  } catch (error) {
    showToast(error.response?.data?.message || 'Gagal mereset password', 'warning');
  }
};
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Master Peserta</h1>
          <p className="text-gray-500 text-sm">Kelola data pegawai/panitia untuk keperluan agenda kegiatan</p>
        </div>
        <button
          onClick={openTambahModal}
          className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition self-start"
        >
          + Tambah Peserta
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
        <input
          type="text"
          placeholder="Cari nama atau jabatan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-96 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      <p className="text-sm text-gray-500 mb-3">
        Menampilkan {dataFiltered.length} dari {pesertaList.length} total peserta
      </p>

      {/* Tabel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="py-3 px-4 font-medium">Nama</th>
                <th className="py-3 px-4 font-medium">Role</th>
                <th className="py-3 px-4 font-medium">No. WhatsApp</th>
                <th className="py-3 px-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dataFiltered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-400">
                    Tidak ada data peserta yang cocok
                  </td>
                </tr>
              ) : (
                dataFiltered.map((peserta) => (
                  <tr key={peserta.id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800 font-medium">{peserta.nama}</td>
                    <td className="py-3 px-4 text-gray-700">{peserta.role}</td>
                    <td className="py-3 px-4 text-gray-700">{peserta.noWa}</td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
  <div className="flex items-center justify-center gap-1.5">
    <button
      onClick={() => openEditModal(peserta)}
      title="Edit"
      className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
    >
      ✏️
    </button>
    {isAdmin && (
      <button
        onClick={() => openResetModal(peserta)}
        title="Reset Password"
        className="p-1.5 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition"
      >
        🔑
      </button>
    )}
    <button
      onClick={() => openDeleteModal(peserta)}
      title="Hapus"
      className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
    >
      🗑️
    </button>
  </div>
</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

   {/* Modal Tambah/Edit */}
      {showModal && (
        <div
          onClick={closeModal}
          className={`fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 transition-opacity duration-200 ${
            modalVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`bg-white rounded-xl shadow-lg w-full max-w-md p-6 transition-all duration-200 ease-out ${
              modalVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
            }`}
          >
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {editingId ? 'Edit Peserta' : 'Tambah Peserta Baru'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Username <span className="text-red-500">*</span>
  </label>
  <input
    type="text"
    required
    value={formData.username}
    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
  />
</div>
{!editingId && (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1"> Password <span className="text-red-500">*</span>
</label>
    <input
      type="password"
      required
      value={formData.password}
      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
    />
  </div>
)}
<div>
 <label className="block text-sm font-medium text-gray-700 mb-1">
  Nama <span className="text-red-500">*</span>
</label>
  <input
    type="text"
    required
    value={formData.nama}
    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
  />
</div>
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1"> Role <span className="text-red-500">*</span>
</label>
 <select
  required
  value={formData.role}
  onChange={(e) => {
    const newRole = e.target.value;
    const masihButuhBidang = ['Kepala Bidang', 'Pelaksana'].includes(newRole);
    setFormData({ ...formData, role: newRole, bidang: masihButuhBidang ? formData.bidang : '' });
  }}
  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
>
  {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
</select>
</div>
{perluBidang && (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Bidang <span className="text-red-500">*</span>
    </label>
    <select
      required
      value={formData.bidang}
      onChange={(e) => setFormData({ ...formData, bidang: e.target.value })}
      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
    >
      <option value="">-- Pilih Bidang --</option>
      {BIDANG_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
    </select>
  </div>
)}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    No. WhatsApp <span className="text-red-500">*</span>
  </label>
  <input
    type="text"
    inputMode="numeric"
    required
    placeholder="081234567890"
    value={formData.noWa}
    onChange={handleNoWaChange}
    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
  />
</div>   <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="bg-blue-700 hover:bg-blue-800 text-white font-medium px-5 py-2 rounded-lg transition"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-5 py-2 rounded-lg transition"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {deleteTarget && (
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
              <h2 className="text-lg font-bold text-gray-800">Hapus Peserta?</h2>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus{' '}
              <span className="font-semibold text-gray-800">{deleteTarget?.nama}</span> dari
              daftar peserta? Tindakan ini tidak dapat dibatalkan.
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
      {/* Modal Reset Password */}
      {resetTarget && (
        <div
          onClick={closeResetModal}
          className={`fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 transition-opacity duration-200 ${
            resetModalVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`bg-white rounded-xl shadow-lg w-full max-w-sm p-6 transition-all duration-200 ease-out ${
              resetModalVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 text-xl">🔑</span>
              </div>
              <h2 className="text-lg font-bold text-gray-800">Reset Password</h2>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Masukkan password baru untuk <span className="font-semibold text-gray-800">{resetTarget?.nama}</span>:
            </p>

            <div className="mb-6">
              <input
                type="password"
                placeholder="Password baru"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={confirmResetPassword}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-lg transition"
              >
                Reset Password
              </button>
              <button
                onClick={closeResetModal}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg transition"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

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