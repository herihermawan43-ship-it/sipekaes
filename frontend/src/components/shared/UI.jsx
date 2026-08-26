import React from 'react';
import { TrendingUp, ArrowUp } from 'lucide-react';

export const StatCard = ({ icon: Icon, label, value, growth, sub, iconBg = 'bg-orange-50', iconColor = 'text-orange-500', progress }) => (
  <div className="bg-white rounded-2xl p-5 card-shadow card-hover animate-fade-up">
    <div className="flex items-start justify-between mb-3">
      <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${iconColor}`} strokeWidth={2.3} />
      </div>
      {progress !== undefined && (
        <div className="relative w-12 h-12">
          <svg className="w-12 h-12 -rotate-90">
            <circle cx="24" cy="24" r="20" stroke="#FED7AA" strokeWidth="4" fill="none" />
            <circle
              cx="24" cy="24" r="20" stroke="#F97316" strokeWidth="4" fill="none"
              strokeDasharray={125.6}
              strokeDashoffset={125.6 - (125.6 * progress) / 100}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-orange-600">{progress}%</span>
        </div>
      )}
    </div>
    <p className="text-sm font-semibold text-gray-500">{label}</p>
    <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{value}</h3>
    {growth !== undefined && (
      <div className="flex items-center gap-1 mt-2 text-xs font-bold text-emerald-600">
        <ArrowUp className="w-3.5 h-3.5" />
        <span>{growth}%</span>
        <span className="text-gray-400 font-medium ml-1">dari bulan lalu</span>
      </div>
    )}
    {sub && <p className="text-xs text-gray-400 font-medium mt-2">{sub}</p>}
  </div>
);

export const SectionCard = ({ title, action, children, className = '' }) => (
  <div className={`bg-white rounded-2xl p-6 card-shadow ${className}`}>
    <div className="flex items-center justify-between mb-5">
      <h3 className="text-sm font-extrabold tracking-wide text-gray-900 uppercase">{title}</h3>
      {action}
    </div>
    {children}
  </div>
);

export const formatNumber = (n) => new Intl.NumberFormat('id-ID').format(n);
