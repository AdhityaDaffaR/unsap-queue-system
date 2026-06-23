import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeUser from './pages/user/HomeUser';
import LoginUser from './pages/user/LoginUser';
import LoginAdmin from './pages/admin/LoginAdmin';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import StatusLoket from './pages/user/StatusLoket';
import Bantuan from './pages/user/Bantuan';
import DisplayMonitor from './pages/user/DisplayMonitor';

function App() {
  return (
    <Router>
      <Routes>
        {/* Jalur untuk Mahasiswa */}
        <Route path="/" element={<HomeUser />} />
        <Route path="/login" element={<LoginUser />} />
        
        {/* Rute Status Loket Aktif */}
        <Route path="/status-loket" element={<StatusLoket />} />

        {/* Jalur untuk Admin */}
        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route path="/admin/dashboard" element={<DashboardAdmin />} />

        <Route path="/bantuan" element={<Bantuan />} />

        <Route path="/display-monitor" element={<DisplayMonitor />} />
      </Routes>
    </Router>
  );
}

export default App;