import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          {/* Halaman lain menyusul: input-kegiatan, rekap-semua, dll */}
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;