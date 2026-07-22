import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import InputKegiatan from './pages/InputKegiatan';
import RekapSemua from './pages/RekapSemua';
import RekapTerkini from './pages/RekapTerkini';

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/input-kegiatan" element={<InputKegiatan />} />
          <Route path="/rekap-semua" element={<RekapSemua />} />
          <Route path="/rekap-terkini" element={<RekapTerkini />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;