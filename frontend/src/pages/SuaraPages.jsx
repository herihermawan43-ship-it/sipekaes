import React from 'react';
import { KECAMATAN_LIST, QUICK_COUNT_DATA, STATS, CHART_DATA } from '../mock/mockData';
import { formatNumber } from '../components/shared/UI';
import { Target, Flag, TrendingUp, Vote, ChevronDown } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';

export const TargetSuara = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white rounded-2xl p-6 card-shadow card-hover">
        <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mb-3"><Target className="w-6 h-6 text-orange-600" /></div>
        <p className="text-sm font-semibold text-gray-500">Target Suara Akhir</p>
        <h3 className="text-3xl font-extrabold text-gray-900 mt-1">{formatNumber(STATS.target)}</h3>
      </div>
      <div className="bg-white rounded-2xl p-6 card-shadow card-hover">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-3"><TrendingUp className="w-6 h-6 text-emerald-600" /></div>
        <p className="text-sm font-semibold text-gray-500">Realisasi Saat Ini</p>
        <h3 className="text-3xl font-extrabold text-emerald-600 mt-1">{formatNumber(STATS.realisasi)}</h3>
      </div>
      <div className="bg-white rounded-2xl p-6 card-shadow card-hover">
        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-3"><Flag className="w-6 h-6 text-amber-600" /></div>
        <p className="text-sm font-semibold text-gray-500">Sisa Target</p>
        <h3 className="text-3xl font-extrabold text-amber-600 mt-1">{formatNumber(STATS.target - STATS.realisasi)}</h3>
      </div>
    </div>

    <div className="bg-white rounded-2xl p-6 card-shadow">
      <h3 className="text-lg font-extrabold mb-5">Target Suara per Kecamatan</h3>
      <ResponsiveContainer width="100%" height={420}>
        <BarChart data={KECAMATAN_LIST}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
          <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} angle={-30} textAnchor="end" height={80} />
          <YAxis stroke="#9CA3AF" fontSize={11} tickFormatter={v => `${v/1000}K`} />
          <Tooltip formatter={v => formatNumber(v)} />
          <Legend />
          <Bar dataKey="baseline" name="Baseline" fill="#FDBA74" radius={[4,4,0,0]} />
          <Bar dataKey="realisasi" name="Realisasi" fill="#F97316" radius={[4,4,0,0]} />
          <Bar dataKey="target" name="Target" fill="#FED7AA" radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export const ProgressSuara = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-2xl p-6 card-shadow">
      <h3 className="text-lg font-extrabold mb-5">Progress Realisasi Sepanjang Tahun</h3>
      <ResponsiveContainer width="100%" height={340}>
        <AreaChart data={CHART_DATA}>
          <defs>
            <linearGradient id="gradOrange" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F97316" stopOpacity={0.5}/>
              <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
          <XAxis dataKey="month" stroke="#9CA3AF" fontSize={11} />
          <YAxis stroke="#9CA3AF" fontSize={11} tickFormatter={v => `${v/1000}K`} />
          <Tooltip formatter={v => formatNumber(v)} />
          <Area type="monotone" dataKey="realisasi" stroke="#F97316" fillOpacity={1} fill="url(#gradOrange)" strokeWidth={3} />
        </AreaChart>
      </ResponsiveContainer>
    </div>

    <div className="bg-white rounded-2xl p-6 card-shadow">
      <h3 className="text-lg font-extrabold mb-5">Progress per Kecamatan</h3>
      <div className="space-y-4">
        {KECAMATAN_LIST.map(k => {
          const pct = Math.round((k.realisasi/k.target)*100);
          return (
            <div key={k.name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-bold">{k.name}</span>
                <span className="font-extrabold text-orange-600">{formatNumber(k.realisasi)} / {formatNumber(k.target)} · {pct}%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-400 to-orange-500" style={{width: `${pct}%`}}></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

export const BaselineSuara = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-2xl p-6 card-shadow">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-extrabold">Baseline Suara (Estimasi Awal)</h3>
          <p className="text-sm text-gray-500 font-medium">Perbandingan baseline vs target per wilayah</p>
        </div>
        <button className="flex items-center gap-2 text-xs font-semibold border border-gray-200 rounded-lg px-3 py-1.5">Semua Wilayah <ChevronDown className="w-3.5 h-3.5" /></button>
      </div>
      <ResponsiveContainer width="100%" height={420}>
        <BarChart data={KECAMATAN_LIST} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
          <XAxis type="number" stroke="#9CA3AF" fontSize={11} tickFormatter={v => `${v/1000}K`} />
          <YAxis dataKey="name" type="category" stroke="#9CA3AF" fontSize={11} width={100} />
          <Tooltip formatter={v => formatNumber(v)} />
          <Legend />
          <Bar dataKey="baseline" name="Baseline" fill="#FDBA74" radius={[0,4,4,0]} />
          <Bar dataKey="target" name="Target" fill="#F97316" radius={[0,4,4,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export const QuickCount = () => {
  const totalSuara = QUICK_COUNT_DATA.reduce((a, b) => a + b.suara, 0);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 card-shadow">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center"><Vote className="w-5 h-5 text-orange-600" /></div>
            <div>
              <h3 className="text-lg font-extrabold">Hasil Quick Count</h3>
              <p className="text-xs text-gray-500 font-medium">Real-time · Data masuk 87% dari 15.230 TPS</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={QUICK_COUNT_DATA} dataKey="suara" innerRadius={70} outerRadius={110} paddingAngle={3}>
                {QUICK_COUNT_DATA.map((e, i) => <Cell key={i} fill={e.warna} />)}
              </Pie>
              <Tooltip formatter={v => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 card-shadow">
          <h3 className="text-lg font-extrabold mb-5">Perolehan Suara</h3>
          <div className="space-y-4">
            {QUICK_COUNT_DATA.map(p => (
              <div key={p.paslon}>
                <div className="flex justify-between mb-1">
                  <span className="font-extrabold">{p.paslon}</span>
                  <span className="font-extrabold text-lg" style={{ color: p.warna }}>{p.suara}%</span>
                </div>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${p.suara}%`, background: p.warna }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 rounded-xl bg-orange-50 border border-orange-200">
            <p className="text-xs font-bold text-orange-700">Status: DATA MASUK 87%</p>
            <p className="text-sm font-semibold text-gray-700 mt-1">Paslon 2 (Kami) memimpin dengan selisih 8.8% dari Paslon 1</p>
          </div>
        </div>
      </div>
    </div>
  );
};
