import React, { useState } from 'react';
import { Menu, Bell, ChevronDown, CalendarDays, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NOTIFIKASI } from '../../mock/mockData';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from '../ui/dropdown-menu';

const Topbar = ({ title, subtitle, onToggle, onMobileToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [pemilu, setPemilu] = useState('Pemilu 2029');
  const unread = NOTIFIKASI.filter(n => n.unread).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white px-4 sm:px-6 lg:px-8 py-4 lg:py-5 flex items-center justify-between border-b border-gray-100 gap-2">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Mobile hamburger */}
        <button onClick={onMobileToggle} className="lg:hidden p-2 rounded-lg hover:bg-orange-50 text-gray-600 hover:text-orange-600 transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        {/* Desktop collapse */}
        <button onClick={onToggle} className="hidden lg:block p-2 rounded-lg hover:bg-orange-50 text-gray-600 hover:text-orange-600 transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-tight truncate">{title}</h1>
          {subtitle && <p className="text-xs sm:text-sm text-gray-500 mt-0.5 font-medium truncate hidden sm:block">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Pemilu Select - hide on small mobile */}
        <DropdownMenu>
          <DropdownMenuTrigger className="hidden md:flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 lg:px-4 py-2 lg:py-2.5 text-xs lg:text-sm font-semibold text-gray-700 hover:border-orange-300 transition-colors">
            <CalendarDays className="w-4 h-4 text-orange-500" />
            <span className="hidden lg:inline">{pemilu}</span>
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
          <DropdownMenuTrigger className="relative p-2 sm:p-2.5 rounded-lg border border-gray-200 hover:border-orange-300 transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {unread}
              </span>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 sm:w-80">
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
          <DropdownMenuTrigger className="flex items-center gap-2 pl-1 sm:pl-2 pr-2 sm:pr-4 py-1 sm:py-1.5 rounded-lg border border-gray-200 hover:border-orange-300 transition-colors">
            <img src={user?.avatar} alt={user?.name} className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover" />
            <div className="text-left hidden sm:block">
              <p className="text-sm font-bold text-gray-900 leading-tight truncate max-w-[140px]">{user?.name}</p>
              <p className="text-xs text-orange-600 font-semibold truncate max-w-[140px]">{user?.roleLabel}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="sm:hidden">
              <p className="text-sm font-bold">{user?.name}</p>
              <p className="text-xs text-orange-600 font-semibold">{user?.roleLabel}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="sm:hidden" />
            <DropdownMenuLabel className="hidden sm:block">Akun Saya</DropdownMenuLabel>
            <DropdownMenuSeparator className="hidden sm:block" />
            <DropdownMenuItem><User className="w-4 h-4 mr-2" /> Profil</DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="text-red-600"><LogOut className="w-4 h-4 mr-2" /> Keluar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Topbar;
