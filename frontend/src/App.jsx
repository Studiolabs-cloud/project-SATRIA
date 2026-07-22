import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import InputKegiatan from './pages/InputKegiatan';

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/input-kegiatan" element={<InputKegiatan />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;