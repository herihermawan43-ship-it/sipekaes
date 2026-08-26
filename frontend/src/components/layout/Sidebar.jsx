import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, UserCheck, ShieldCheck, Network,
  MapPin, Building2, Home, Map, FileText, CalendarDays,
  Calendar, ListTodo, Target, TrendingUp, Flag, Vote,
  UserCog, Settings, LifeBuoy, Sparkles
} from 'lucide-react';

const menuSections = [
  { items: [{ to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' }] },
  {
    title: 'DATA & JARINGAN',
    items: [
      { to: '/simpatisan', icon: Users, label: 'Simpatisan' },
      { to: '/kader', icon: UserCheck, label: 'Kader' },
      { to: '/saksi', icon: ShieldCheck, label: 'Saksi' },
      { to: '/struktur', icon: Network, label: 'Struktur Jaringan' },
    ]
  },
  {
    title: 'WILAYAH',
    items: [
      { to: '/kecamatan', icon: Building2, label: 'Kecamatan' },
      { to: '/desa', icon: Home, label: 'Desa / Kelurahan' },
      { to: '/rw', icon: MapPin, label: 'RW' },
      { to: '/peta', icon: Map, label: 'Sebaran Peta' },
      { to: '/laporan', icon: FileText, label: 'Laporan Wilayah' },
    ]
  },
  {
    title: 'AKTIVITAS',
    items: [
      { to: '/kegiatan', icon: CalendarDays, label: 'Kegiatan' },
      { to: '/agenda', icon: Calendar, label: 'Agenda' },
      { to: '/tugas', icon: ListTodo, label: 'Tugas' },
    ]
  },
  {
    title: 'SUARA & TARGET',
    items: [
      { to: '/target-suara', icon: Target, label: 'Target Suara' },
      { to: '/progress-suara', icon: TrendingUp, label: 'Progress Suara' },
      { to: '/baseline-suara', icon: Flag, label: 'Baseline Suara' },
      { to: '/quick-count', icon: Vote, label: 'Quick Count' },
    ]
  },
  {
    title: 'PENGATURAN',
    items: [
      { to: '/pengguna', icon: UserCog, label: 'Pengguna' },
      { to: '/pengaturan', icon: Settings, label: 'Pengaturan' },
    ]
  },
];

const Sidebar = ({ collapsed = false }) => {
  const navigate = useNavigate();
  return (
    <aside className={`${collapsed ? 'w-20' : 'w-64'} sidebar-gradient text-white flex flex-col h-screen sticky top-0 transition-all duration-300`}>
      {/* Logo */}
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

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto no-scrollbar py-4">
        {menuSections.map((section, idx) => (
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

      {/* Bottom */}
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
