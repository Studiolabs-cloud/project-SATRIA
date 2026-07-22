import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import InputKegiatan from './pages/InputKegiatan';
import RekapSemua from './pages/RekapSemua';
import RekapTerkini from './pages/RekapTerkini';
import MasterPeserta from './pages/MasterPeserta';
import DashboardNaskah from './pages/naskah/DashboardNaskah';
import InputSuratMasuk from './pages/naskah/InputSuratMasuk';
import RekapBelum from './pages/naskah/RekapBelum';
import RekapSelesai from './pages/naskah/RekapSelesai';
import DetailSurat from './pages/naskah/DetailSurat';
import DelegasiPelaksana from './pages/naskah/DelegasiPelaksana';


function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          {/* Modul Agenda */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/input-kegiatan" element={<InputKegiatan />} />
          <Route path="/rekap-semua" element={<RekapSemua />} />
          <Route path="/rekap-terkini" element={<RekapTerkini />} />
          <Route path="/master-peserta" element={<MasterPeserta />} />
          
          {/* Modul Naskah */}
          <Route path="/naskah" element={<DashboardNaskah />} />
          <Route path="/naskah/input-surat" element={<InputSuratMasuk />} />
          <Route path="/naskah/rekap-belum" element={<RekapBelum />} />
          <Route path="/naskah/rekap-selesai" element={<RekapSelesai />} />
          <Route path="/naskah/detail/:id" element={<DetailSurat />} />
          <Route path="/naskah/delegasi/:id" element={<DelegasiPelaksana />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;