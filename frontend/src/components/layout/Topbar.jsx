import React, { useState } from 'react';
import { Menu, Bell, ChevronDown, CalendarDays, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NOTIFIKASI } from '../../mock/mockData';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from '../ui/dropdown-menu';

const Topbar = ({ title, subtitle, onToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [pemilu, setPemilu] = useState('Pemilu 2029');
  const unread = NOTIFIKASI.filter(n => n.unread).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white px-8 py-5 flex items-center justify-between border-b border-gray-100">
      <div className="flex items-center gap-4">
        <button onClick={onToggle} className="p-2 rounded-lg hover:bg-orange-50 text-gray-600 hover:text-orange-600 transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 mt-0.5 font-medium">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Pemilu Select */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-orange-300 transition-colors">
            <CalendarDays className="w-4 h-4 text-orange-500" />
            {pemilu}
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {['Pemilu 2029', 'Pemilu 2024', 'Pilkada 2024'].map(p => (
              <DropdownMenuItem key={p} onClick={() => setPemilu(p)}>{p}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger className="relative p-2.5 rounded-lg border border-gray-200 hover:border-orange-300 transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {unread}
              </span>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {NOTIFIKASI.map(n => (
              <DropdownMenuItem key={n.id} className="flex-col items-start py-3">
                <div className="flex items-center gap-2 w-full">
                  {n.unread && <span className="w-2 h-2 rounded-full bg-orange-500" />}
                  <span className="font-semibold text-sm">{n.title}</span>
                </div>
                <span className="text-xs text-gray-500 ml-4">{n.time}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-lg border border-gray-200 hover:border-orange-300 transition-colors">
            <img src={user?.avatar} alt={user?.name} className="w-9 h-9 rounded-full object-cover" />
            <div className="text-left">
              <p className="text-sm font-bold text-gray-900 leading-tight">{user?.name}</p>
              <p className="text-xs text-orange-600 font-semibold">{user?.roleLabel}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem><User className="w-4 h-4 mr-2" /> Profil</DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="text-red-600"><LogOut className="w-4 h-4 mr-2" /> Keluar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Topbar;
