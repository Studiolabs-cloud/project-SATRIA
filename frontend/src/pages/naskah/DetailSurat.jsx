import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const INSTRUKSI_OPTIONS = [
  'Tanggapan dan saran', 'Koordinasi / Konfirmasi', 'Proses lebih lanjut', 'Telaah/Saran',
  'Sesuai Ketentuan', 'Proses', 'Untuk diketahui', 'Ditindaklanjuti',
  'Proses lebih lanjut Sesuai Prosedur & Ketentuan', 'Koordinasi/konfirmasikan', 'Atensi',
  'Beri Penjelasan Tertulis/Lisan', 'File/CC', 'Segera', 'Jadwalkan/Mewakili', 'Laksanakan/Selesaikan',
];

const BIDANG_OPTIONS = [
  { id: 'Sekretariat', label: 'Sekretariat' },
  { id: 'PPM', label: 'PPM' },
  { id: 'PSDA', label: 'PSDA' },
  { id: 'IPW', label: 'IPW' },
  { id: 'PPEPD', label: 'PPEPD' },
];

export default function DetailSurat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const bisaDisposisi = ['Admin', 'Kadis', 'Sekdis'].includes(user?.role);

  const [surat, setSurat] = useState(null);
  const [loading, setLoading] = useState(true);

  const [instruksiTerpilih, setInstruksiTerpilih] = useState([]);
  const [instruksiTambahan, setInstruksiTambahan] = useState('');
  const [uraianDisposisi, setUraianDisposisi] = useState('');
  const [deadline, setDeadline] = useState('');
  const [bidangTerpilih, setBidangTerpilih] = useState([]);
  const [toast, setToast] = useState(null);

  const fetchSurat = () => {
    api.get(`/naskah/${id}`)
      .then((res) => setSurat(res.data))
      .catch((err) => console.error('Gagal ambil detail surat:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSurat();
  }, [id]);

  const formatTanggal = (dateStr) =>
    new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

  const formatWaktu = (dateStr) => {
    const date = new Date(dateStr);
    const tanggal = date.toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta', day: '2-digit', month: 'short', year: 'numeric' });
    const jam = date.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit' });
    return `${tanggal}, ${jam} WIB`;
  };

  const toggleInstruksi = (item) => {
    if (!bisaDisposisi) return;
    setInstruksiTerpilih((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]));
  };

  const toggleBidang = (id) => {
    if (!bisaDisposisi) return;
    setBidangTerpilih((prev) => (prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]));
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type, visible: false });
    setTimeout(() => setToast((prev) => (prev ? { ...prev, visible: true } : null)), 10);
    setTimeout(() => setToast((prev) => (prev ? { ...prev, visible: false } : null)), 4600);
    setTimeout(() => setToast(null), 5000);
  };

  const handleSimpanDisposisi = async () => {
    if (instruksiTerpilih.length === 0 && !instruksiTambahan) {
      showToast('Pilih minimal 1 instruksi disposisi atau isi instruksi tambahan.', 'warning');
      return;
    }
    if (bidangTerpilih.length === 0) {
      showToast('Pilih minimal 1 bidang tujuan.', 'warning');
      return;
    }
    try {
      await api.post(`/naskah/${id}/disposisi`, {
        instruksi: instruksiTerpilih,
        instruksiTambahan,
        uraian: uraianDisposisi,
        deadline: deadline || null,
        bidangTujuan: bidangTerpilih,
      });
      showToast('Disposisi berhasil disimpan dan dikirim ke bidang tujuan');
      fetchSurat();
      setInstruksiTerpilih([]);
      setInstruksiTambahan('');
      setUraianDisposisi('');
      setDeadline('');
      setBidangTerpilih([]);
    } catch (error) {
      showToast(error.response?.data?.message || 'Gagal menyimpan disposisi', 'warning');
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-400">Memuat data...</div>;
  if (!surat) return <div className="p-6 text-center text-gray-400">Surat tidak ditemukan</div>;

  // Susun data timeline dari data surat
  const disposisiPertama = surat.disposisi?.[0];
  const delegasiPertama = disposisiPertama?.delegasi?.[0];
  const tindakLanjut = disposisiPertama?.tindakLanjut;

  const timelineSteps = [
    {
      label: 'Surat Masuk Diinput',
      done: true,
      waktu: surat.createdAt,
      oleh: surat.createdBy?.nama,
      icon: '📥',
    },
    {
      label: 'Disposisi oleh Pimpinan',
      done: !!disposisiPertama,
      waktu: disposisiPertama?.createdAt,
      oleh: disposisiPertama?.createdBy?.nama,
      icon: '📝',
      keterangan: disposisiPertama ? `Ditujukan ke: ${JSON.parse(disposisiPertama.bidangTujuan || '[]').join(', ')}` : null,
    },
    {
      label: 'Delegasi ke Pelaksana',
      done: !!delegasiPertama,
      waktu: delegasiPertama?.createdAt,
      oleh: delegasiPertama?.createdBy?.nama,
      icon: '👥',
      keterangan: delegasiPertama?.dikerjakanLangsung ? 'Dikerjakan langsung oleh Kepala Bidang' : null,
    },
    {
      label: 'Tindak Lanjut Diisi',
      done: !!tindakLanjut?.sudahDisubmit,
      waktu: tindakLanjut?.createdAt,
      oleh: tindakLanjut?.createdBy?.nama,
      icon: '🛠️',
    },
    {
      label: tindakLanjut?.hasilVerifikasi === 'kembalikan' ? 'Dikembalikan oleh Pimpinan' : 'Diverifikasi Selesai',
      done: !!tindakLanjut?.hasilVerifikasi,
      waktu: tindakLanjut?.hasilVerifikasi ? tindakLanjut?.updatedAt : null,
      oleh: null,
      icon: tindakLanjut?.hasilVerifikasi === 'kembalikan' ? '↩️' : '✅',
    },
  ];

  const statusBadge = () => {
    if (tindakLanjut?.hasilVerifikasi === 'selesai') return { label: 'Selesai', warna: 'bg-green-50 text-green-700' };
    if (tindakLanjut?.hasilVerifikasi === 'kembalikan') return { label: 'Dikembalikan', warna: 'bg-red-50 text-red-700' };
    if (tindakLanjut?.sudahDisubmit) return { label: 'Menunggu Verifikasi', warna: 'bg-blue-50 text-blue-700' };
    if (delegasiPertama) return { label: 'Sedang Dikerjakan', warna: 'bg-blue-50 text-blue-700' };
    if (disposisiPertama) return { label: 'Proses', warna: 'bg-blue-50 text-blue-700' };
    return { label: 'Menunggu Disposisi', warna: 'bg-yellow-50 text-yellow-700' };
  };
  const status = statusBadge();

  return (
    <div className="p-6 max-w-4xl mx-auto">
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
          <span className={`text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap ${status.warna}`}>
            {status.label}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400 text-xs mb-0.5">Nomor Surat</p>
            <p className="text-gray-800 font-medium">{surat.noSurat || '-'}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-0.5">Tanggal Masuk</p>
            <p className="text-gray-800 font-medium">{formatTanggal(surat.tglTerima)}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-gray-400 text-xs mb-0.5">Hal</p>
            <p className="text-gray-800 font-medium">{surat.hal}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-0.5">Pengirim</p>
            <p className="text-gray-800 font-medium">{surat.asalSurat}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-0.5">Sifat</p>
            <p className="text-gray-800 font-medium">{surat.sifat}</p>
          </div>
        </div>

        {surat.fileUtama && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            
              <a href={`http://localhost:3000/uploads/${surat.fileUtama}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-700 hover:underline flex items-center gap-1.5 w-fit"
            >
              📄 Lihat Berkas Surat
            </a>
          </div>
        )}
      </div>

      {/* Timeline Monitoring */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-5">
        <h2 className="text-lg font-bold text-gray-800 mb-1">📍 Monitoring Alur Surat</h2>
        <p className="text-gray-500 text-sm mb-5">Posisi surat saat ini dan riwayat prosesnya</p>

        <div className="space-y-0">
          {timelineSteps.map((step, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                    step.done ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {step.icon}
                </div>
                {idx < timelineSteps.length - 1 && (
                  <div className={`w-0.5 flex-1 min-h-[24px] ${step.done ? 'bg-blue-200' : 'bg-gray-100'}`} />
                )}
              </div>
              <div className={`pb-6 ${!step.done && 'opacity-40'}`}>
                <p className={`text-sm font-semibold ${step.done ? 'text-gray-800' : 'text-gray-400'}`}>
                  {step.label}
                </p>
                {step.done && step.waktu && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {formatWaktu(step.waktu)}
                    {step.oleh && ` • oleh ${step.oleh}`}
                  </p>
                )}
                {step.keterangan && (
                  <p className="text-xs text-gray-500 mt-1">{step.keterangan}</p>
                )}
                {!step.done && (
                  <p className="text-xs text-gray-400 mt-0.5">Belum dilakukan</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Disposisi */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-1">Disposisi Surat</h2>
        <p className="text-gray-500 text-sm mb-5">
          Tentukan instruksi disposisi, uraian arahan, dan satu atau lebih bidang tujuan
        </p>

        {!bisaDisposisi && (
          <div className="bg-blue-50 text-blue-700 text-sm px-4 py-2.5 rounded-lg mb-5">
            👁️ Anda hanya dapat melihat detail disposisi. Hanya Admin, Kadis, atau Sekdis yang dapat mengisi disposisi.
          </div>
        )}

        {disposisiPertama ? (
          <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2">
            <p><span className="text-gray-500">Instruksi:</span> {JSON.parse(disposisiPertama.instruksi || '[]').join(', ') || '-'}</p>
            {disposisiPertama.instruksiTambahan && <p><span className="text-gray-500">Instruksi Tambahan:</span> {disposisiPertama.instruksiTambahan}</p>}
            {disposisiPertama.uraian && <p><span className="text-gray-500">Uraian:</span> {disposisiPertama.uraian}</p>}
            <p><span className="text-gray-500">Bidang Tujuan:</span> {JSON.parse(disposisiPertama.bidangTujuan || '[]').join(', ')}</p>
            {disposisiPertama.deadline && <p><span className="text-gray-500">Deadline:</span> {formatTanggal(disposisiPertama.deadline)}</p>}
            <Link
              to={`/naskah/delegasi/${disposisiPertama.id}`}
              className="inline-block mt-2 text-blue-700 hover:underline text-sm font-medium"
            >
              Kelola Delegasi →
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Instruksi Disposisi {bisaDisposisi && <span className="text-red-500">*</span>}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 border border-gray-100 rounded-lg p-4">
                {INSTRUKSI_OPTIONS.map((item) => (
                  <label key={item} className={`flex items-center gap-2 text-sm text-gray-700 ${!bisaDisposisi ? 'opacity-60' : 'cursor-pointer'}`}>
                    <input
                      type="checkbox"
                      checked={instruksiTerpilih.includes(item)}
                      onChange={() => toggleInstruksi(item)}
                      disabled={!bisaDisposisi}
                      className="w-4 h-4 accent-blue-700"
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">Instruksi tambahan (opsional)</label>
              <textarea
                value={instruksiTambahan}
                onChange={(e) => setInstruksiTambahan(e.target.value)}
                disabled={!bisaDisposisi}
                rows={2}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-50"
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">Uraian Disposisi</label>
              <textarea
                value={uraianDisposisi}
                onChange={(e) => setUraianDisposisi(e.target.value)}
                disabled={!bisaDisposisi}
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-50"
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">Deadline Tanggal Pengerjaan</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                disabled={!bisaDisposisi}
                className="w-full md:w-64 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-50"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bidang Tujuan {bisaDisposisi && <span className="text-red-500">*</span>}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {BIDANG_OPTIONS.map((bidang) => (
                  <label
                    key={bidang.id}
                    className={`flex items-center gap-2.5 border rounded-lg px-3 py-2.5 transition ${
                      bidangTerpilih.includes(bidang.id) ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                    } ${bisaDisposisi ? 'cursor-pointer hover:bg-gray-50' : 'opacity-60'}`}
                  >
                    <input
                      type="checkbox"
                      checked={bidangTerpilih.includes(bidang.id)}
                      onChange={() => toggleBidang(bidang.id)}
                      disabled={!bisaDisposisi}
                      className="w-4 h-4 accent-blue-700"
                    />
                    <p className="text-sm font-medium text-gray-800">{bidang.label}</p>
                  </label>
                ))}
              </div>
            </div>

            {bisaDisposisi && (
              <button
                onClick={handleSimpanDisposisi}
                className="bg-blue-700 hover:bg-blue-800 text-white font-medium px-6 py-2.5 rounded-lg transition"
              >
                💾 Simpan Disposisi
              </button>
            )}
          </>
        )}
      </div>

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ease-out ${toast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
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