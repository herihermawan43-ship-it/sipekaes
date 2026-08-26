import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, UserCheck, ShieldCheck, Network,
  MapPin, Building2, Home, Map, FileText, CalendarDays,
  Calendar, ListTodo, Target, TrendingUp, Flag, Vote,
  UserCog, Settings, LifeBuoy, Sparkles, Crown, Building, GraduationCap, Users2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Role access rules: which roles can see which paths
const ALL_ROLES = ['super_admin','admin_pusat','admin_input','koordinator','saksi'];
const ADMIN_ROLES = ['super_admin','admin_pusat','admin_input'];
const KOORDINATOR_UP = ['super_admin','admin_pusat','admin_input','koordinator'];

const menuSections = [
  { items: [{ to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ALL_ROLES }] },
  {
    title: 'DATA & JARINGAN',
    items: [
      { to: '/simpatisan', icon: Users, label: 'Simpatisan', roles: KOORDINATOR_UP },
      { to: '/kader', icon: UserCheck, label: 'Kader', roles: KOORDINATOR_UP },
      { to: '/saksi', icon: ShieldCheck, label: 'Saksi', roles: ALL_ROLES },
      { to: '/struktur', icon: Network, label: 'Struktur Jaringan', roles: KOORDINATOR_UP },
    ]
  },
  {
    title: 'STRUKTUR ORGANISASI',
    items: [
      { to: '/pengurus-dpc', icon: Crown, label: 'Pengurus DPC', roles: KOORDINATOR_UP },
      { to: '/pengurus-dpra', icon: Building, label: 'Pengurus DPRA', roles: KOORDINATOR_UP },
      { to: '/pelopor', icon: GraduationCap, label: 'Anggota Pelopor', roles: KOORDINATOR_UP },
      { to: '/rki', icon: Users2, label: 'Anggota RKI', roles: KOORDINATOR_UP },
    ]
  },
  {
    title: 'WILAYAH',
    items: [
      { to: '/kecamatan', icon: Building2, label: 'Kecamatan', roles: KOORDINATOR_UP },
      { to: '/desa', icon: Home, label: 'Desa / Kelurahan', roles: KOORDINATOR_UP },
      { to: '/rw', icon: MapPin, label: 'RW', roles: KOORDINATOR_UP },
      { to: '/peta', icon: Map, label: 'Sebaran Peta', roles: KOORDINATOR_UP },
      { to: '/laporan', icon: FileText, label: 'Laporan Wilayah', roles: KOORDINATOR_UP },
    ]
  },
  {
    title: 'AKTIVITAS',
    items: [
      { to: '/kegiatan', icon: CalendarDays, label: 'Kegiatan', roles: KOORDINATOR_UP },
      { to: '/agenda', icon: Calendar, label: 'Agenda', roles: ALL_ROLES },
      { to: '/tugas', icon: ListTodo, label: 'Tugas', roles: KOORDINATOR_UP },
    ]
  },
  {
    title: 'SUARA & TARGET',
    items: [
      { to: '/target-suara', icon: Target, label: 'Target Suara', roles: ADMIN_ROLES },
      { to: '/progress-suara', icon: TrendingUp, label: 'Progress Suara', roles: KOORDINATOR_UP },
      { to: '/baseline-suara', icon: Flag, label: 'Baseline Suara', roles: ADMIN_ROLES },
      { to: '/quick-count', icon: Vote, label: 'Quick Count', roles: ['super_admin','admin_pusat','admin_input','saksi'] },
    ]
  },
  {
    title: 'PENGATURAN',
    items: [
      { to: '/pengguna', icon: UserCog, label: 'Pengguna', roles: ['super_admin','admin_pusat'] },
      { to: '/pengaturan', icon: Settings, label: 'Pengaturan', roles: ADMIN_ROLES },
    ]
  },
];

const Sidebar = ({ collapsed = false, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role;

  const visibleSections = menuSections
    .map(section => ({ ...section, items: section.items.filter(it => !it.roles || it.roles.includes(role)) }))
    .filter(section => section.items.length > 0);

  const handleNav = () => { if (onClose) onClose(); };

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-64'} sidebar-gradient text-white flex flex-col h-screen sticky top-0 transition-all duration-300`}>
      <div className="px-6 pt-6 pb-5 border-b border-white/10 cursor-pointer" onClick={() => navigate('/dashboard')}>
        {collapsed ? (
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Sparkles className="w-6 h-6" />
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-extrabold tracking-tight leading-none">SiPekaeS</h1>
            <p className="text-[10px] font-semibold tracking-[0.15em] mt-1 opacity-90">PUSAT KOORDINASI SUKABUMI</p>
          </>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto no-scrollbar py-4">
        {visibleSections.map((section, idx) => (
          <div key={idx} className="mb-4">
            {section.title && !collapsed && (
              <p className="px-6 pb-2 text-[10px] font-bold tracking-[0.15em] opacity-70">{section.title}</p>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={handleNav}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-6 py-2.5 text-sm font-semibold transition-all relative ${
                      isActive
                        ? 'bg-white text-orange-600 shadow-md'
                        : 'text-white/95 hover:bg-white/10'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={2.2} />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="p-3 mt-auto">
        <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-white text-orange-600 font-semibold text-sm shadow-md hover:shadow-lg transition-all">
          <LifeBuoy className="w-5 h-5" strokeWidth={2.4} />
          {!collapsed && <span>Bantuan & Panduan</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
