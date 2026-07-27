// frontend/src/pages/MasterPeserta.jsx
import { useState, useEffect } from 'react';
import api from '../services/api';
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
const ROLE_OPTIONS = ['Admin', 'Kadis', 'Sekdis', 'Pengelola Surat', 'Kepala Bidang', 'Pelaksana'];
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // simpan objek peserta yang mau dihapus
const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const dataFiltered = pesertaList.filter(
    (p) =>
      p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.jabatan.toLowerCase().includes(searchTerm.toLowerCase())
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
        nama: formData.nama,
        role: formData.role,
        bidang: formData.bidang,
        noWa: formData.noWa,
      });
    } else {
      await api.post('/users', formData);
    }
    fetchPeserta();
    closeModal();
  } catch (error) {
    alert(error.response?.data?.message || 'Gagal menyimpan data peserta');
  }
};

 const openDeleteModal = (peserta) => {
  setDeleteTarget(peserta);
  setTimeout(() => setDeleteModalVisible(true), 10);
};

const closeDeleteModal = () => {
  setDeleteModalVisible(false);
  setTimeout(() => setDeleteTarget(null), 200);
};

const confirmDelete = async () => {
  try {
    await api.delete(`/users/${deleteTarget.id}`);
    fetchPeserta();
    closeDeleteModal();
  } catch (error) {
    alert(error.response?.data?.message || 'Gagal menghapus peserta');
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
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => openEditModal(peserta)}
                        className="text-blue-600 hover:underline text-xs font-medium mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(peserta)}
                        className="text-red-600 hover:underline text-xs font-medium"
>
                          Hapus
                        </button>
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
              {!editingId && (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
    <input
      type="text"
      required
      value={formData.username}
      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
    />
  </div>
)}
{!editingId && (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
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
  <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
  <input
    type="text"
    required
    value={formData.nama}
    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
  />
</div>
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
  <select
    required
    value={formData.role}
    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
  >
    {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
  </select>
</div>
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Bidang</label>
  <input
    type="text"
    value={formData.bidang}
    onChange={(e) => setFormData({ ...formData, bidang: e.target.value })}
    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
  />
</div>
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">No. WhatsApp</label>
  <input
    type="text"
    placeholder="081234567890"
    value={formData.noWa}
    onChange={(e) => setFormData({ ...formData, noWa: e.target.value })}
    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
  />
</div>
              <div className="flex gap-3 pt-2">
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
    </div>
  );
}