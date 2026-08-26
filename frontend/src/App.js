import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/toaster';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Simpatisan from './pages/Simpatisan';
import Kader from './pages/Kader';
import Saksi from './pages/Saksi';
import StrukturJaringan from './pages/StrukturJaringan';
import { Kecamatan, Desa, RW, LaporanWilayah } from './pages/Wilayah';
import SebaranPeta from './pages/SebaranPeta';
import { Kegiatan, Agenda, Tugas } from './pages/Aktivitas';
import { TargetSuara, ProgressSuara, BaselineSuara, QuickCount } from './pages/SuaraPages';
import { Pengguna, Pengaturan } from './pages/UserSettings';
import { PengurusDPC, PengurusDPRA, AnggotaPelopor, AnggotaRKI } from './pages/OrganisasiPages';
import { useAuth } from './context/AuthContext';

const PageWrap = ({ title, subtitle, children }) => {
  const { user } = useAuth();
  const finalSub = subtitle || (user ? `Selamat datang, ${user.name}` : '');
  return (
    <DashboardLayout title={title} subtitle={finalSub}>
      {children}
    </DashboardLayout>
  );
};

const routes = [
  { path: '/dashboard', title: 'Dashboard', subtitle: 'Pantau progress pemenangan di Kabupaten Sukabumi', el: <Dashboard /> },
  { path: '/simpatisan', title: 'Simpatisan', subtitle: 'Kelola data simpatisan di seluruh wilayah', el: <Simpatisan /> },
  { path: '/kader', title: 'Kader', subtitle: 'Data kader & pengurus organisasi', el: <Kader /> },
  { path: '/saksi', title: 'Saksi TPS', subtitle: 'Data saksi Tempat Pemungutan Suara', el: <Saksi /> },
  { path: '/struktur', title: 'Struktur Jaringan', subtitle: 'Hierarki organisasi pemenangan', el: <StrukturJaringan /> },
  { path: '/pengurus-dpc', title: 'Pengurus DPC', subtitle: 'Struktur pengurus Dewan Pimpinan Cabang', el: <PengurusDPC /> },
  { path: '/pengurus-dpra', title: 'Pengurus DPRA', subtitle: 'Struktur pengurus Dewan Pimpinan Ranting', el: <PengurusDPRA /> },
  { path: '/pelopor', title: 'Anggota Pelopor', subtitle: 'Data anggota Pelopor per wilayah', el: <AnggotaPelopor /> },
  { path: '/rki', title: 'Anggota RKI', subtitle: 'Data anggota Relawan Kader Independen', el: <AnggotaRKI /> },
  { path: '/kecamatan', title: 'Kecamatan', subtitle: '47 Kecamatan di Kabupaten Sukabumi', el: <Kecamatan /> },
  { path: '/desa', title: 'Desa / Kelurahan', subtitle: '381 Desa/Kelurahan aktif', el: <Desa /> },
  { path: '/rw', title: 'RW', subtitle: 'Sebaran RW di seluruh wilayah', el: <RW /> },
  { path: '/peta', title: 'Sebaran Peta', subtitle: 'Peta interaktif kekuatan wilayah', el: <SebaranPeta /> },
  { path: '/laporan', title: 'Laporan Wilayah', subtitle: 'Laporan aktivitas per wilayah', el: <LaporanWilayah /> },
  { path: '/kegiatan', title: 'Kegiatan', subtitle: 'Aktivitas kampanye & aksi lapangan', el: <Kegiatan /> },
  { path: '/agenda', title: 'Agenda', subtitle: 'Jadwal kegiatan yang akan datang', el: <Agenda /> },
  { path: '/tugas', title: 'Tugas', subtitle: 'Daftar tugas & progress penyelesaian', el: <Tugas /> },
  { path: '/target-suara', title: 'Target Suara', subtitle: 'Target perolehan suara per wilayah', el: <TargetSuara /> },
  { path: '/progress-suara', title: 'Progress Suara', subtitle: 'Realisasi perolehan suara', el: <ProgressSuara /> },
  { path: '/baseline-suara', title: 'Baseline Suara', subtitle: 'Estimasi suara awal per wilayah', el: <BaselineSuara /> },
  { path: '/quick-count', title: 'Quick Count', subtitle: 'Hasil real-time perhitungan cepat', el: <QuickCount /> },
  { path: '/pengguna', title: 'Pengguna', subtitle: 'Kelola akses pengguna sistem', el: <Pengguna /> },
  { path: '/pengaturan', title: 'Pengaturan', subtitle: 'Konfigurasi sistem & profil', el: <Pengaturan /> },
];

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            {routes.map(r => (
              <Route
                key={r.path}
                path={r.path}
                element={
                  <ProtectedRoute>
                    <PageWrap title={r.title} subtitle={r.subtitle}>{r.el}</PageWrap>
                  </ProtectedRoute>
                }
              />
            ))}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
