import React, { useState, useEffect } from 'react';
import {
  Users, UserCheck, ShieldCheck, MapPin, Target as TargetIcon,
  Flag, TrendingUp, ChevronDown, Filter, Plus, MoreHorizontal,
  UserPlus, RefreshCw, FileText, Megaphone, Users2, Edit, Trash2, Search, Clock, RefreshCcw
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { STATS as MOCK_STATS, CHART_DATA, KECAMATAN_LIST, AKTIVITAS, KEGIATAN } from '../mock/mockData';
import { statsApi, simpatisanApi } from '../lib/api';
import { StatCard, SectionCard, formatNumber } from '../components/shared/UI';
import SebaranPetaMini from '../components/dashboard/SebaranPetaMini';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

const ACT_ICONS = { simpatisan: UserPlus, kader: RefreshCw, saksi: FileText, target: TargetIcon, kegiatan: Megaphone };

const formatDateTime = (iso) => {
  if (!iso) return '-';
  try {
    const d = new Date(iso);
    return d.toLocaleString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' WIB';
  } catch { return iso; }
};

const formatShortDate = (iso) => {
  try { return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }); } catch { return iso; }
};

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [simpatisanList, setSimpatisanList] = useState([]);
  const [growth, setGrowth] = useState(null);
  const [loadingGrowth, setLoadingGrowth] = useState(true);

  const loadAll = () => {
    statsApi.summary().then(r => setStats(r.data)).catch(() => setStats(null));
    simpatisanApi.list().then(r => setSimpatisanList(r.data)).catch(() => {});
    setLoadingGrowth(true);
    statsApi.dailyGrowth(30).then(r => setGrowth(r.data)).catch(() => setGrowth(null)).finally(() => setLoadingGrowth(false));
  };

  useEffect(() => { loadAll(); }, []);

  // Merge real stats with fallback constants
  const s = {
    simpatisan: stats?.simpatisan || { value: 0, growth: 0 },
    kader: stats?.kader || { value: 0, growth: 0 },
    saksi: stats?.saksi || { value: 0, growth: 0 },
    rw: stats?.rw || { value: 0, total: 3000, tercover: 0 },
    baseline: stats?.baseline || MOCK_STATS.baseline,
    target: stats?.target || MOCK_STATS.target,
    realisasi: stats?.realisasi || MOCK_STATS.realisasi,
    targetPersen: stats ? Math.round((stats.realisasi / stats.target) * 100) : MOCK_STATS.targetPersen,
  };

  const donutData = [
    { name: 'Realisasi', value: s.realisasi, color: '#F97316' },
    { name: 'Baseline', value: s.baseline, color: '#FDBA74' },
    { name: 'Sisa', value: s.target - s.realisasi, color: '#F3F4F6' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <StatCard icon={Users} label="Simpatisan" value={formatNumber(s.simpatisan.value)} growth={s.simpatisan.growth} />
        <StatCard icon={UserCheck} label="Kader" value={formatNumber(s.kader.value)} growth={s.kader.growth} iconBg="bg-amber-50" iconColor="text-amber-600" />
        <StatCard icon={ShieldCheck} label="Saksi" value={formatNumber(s.saksi.value)} growth={s.saksi.growth} iconBg="bg-orange-50" iconColor="text-orange-600" />
        <StatCard icon={MapPin} label="Tim RW Tercover" value={formatNumber(s.rw.value)} sub={`dari ${formatNumber(s.rw.total)} RW`} iconBg="bg-amber-50" iconColor="text-amber-600" progress={Math.min(100, Math.round(s.rw.tercover))} />
        <StatCard icon={TargetIcon} label="Baseline Suara" value={formatNumber(s.baseline)} sub="Estimasi suara awal" iconBg="bg-orange-50" iconColor="text-orange-500" />
        <StatCard icon={Flag} label="Target Suara" value={formatNumber(s.target)} sub="Target akhir" iconBg="bg-red-50" iconColor="text-red-500" />
        <StatCard icon={TrendingUp} label="Realisasi" value={formatNumber(s.realisasi)} sub={`${s.targetPersen}% dari target`} iconBg="bg-emerald-50" iconColor="text-emerald-500" />
      </div>

      {/* Rekapan Harian 30 Hari Terakhir */}
      <div className="bg-white rounded-2xl p-6 card-shadow">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h3 className="text-sm font-extrabold tracking-wide text-gray-900 uppercase">Rekapan Harian — 30 Hari Terakhir</h3>
            <p className="text-xs text-gray-500 font-medium mt-1">Pertumbuhan Kader, Simpatisan, dan Saksi per hari</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-100">
              <Clock className="w-3.5 h-3.5 text-orange-600" />
              <div className="text-[11px] font-semibold">
                <span className="text-gray-500">Update terakhir:</span>{' '}
                <span className="text-orange-700 font-bold">{formatDateTime(growth?.last_update?.latest)}</span>
              </div>
            </div>
            <button onClick={loadAll} className="p-2 rounded-lg border border-gray-200 hover:border-orange-300 text-gray-500 hover:text-orange-600" title="Refresh">
              <RefreshCcw className={`w-4 h-4 ${loadingGrowth ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Ringkasan tambahan 30 hari */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
            <p className="text-[10px] font-bold uppercase tracking-wide text-blue-700">Simpatisan Baru</p>
            <p className="text-xl font-extrabold text-blue-800 mt-1">+ {formatNumber(growth?.totals?.simpatisan_baru_30h || 0)}</p>
            <p className="text-[9px] font-semibold text-blue-600 mt-0.5">Update: {growth?.last_update?.simpatisan ? formatShortDate(growth.last_update.simpatisan) : '-'}</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
            <p className="text-[10px] font-bold uppercase tracking-wide text-amber-700">Kader Baru</p>
            <p className="text-xl font-extrabold text-amber-800 mt-1">+ {formatNumber(growth?.totals?.kader_baru_30h || 0)}</p>
            <p className="text-[9px] font-semibold text-amber-600 mt-0.5">Update: {growth?.last_update?.kader ? formatShortDate(growth.last_update.kader) : '-'}</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
            <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-700">Saksi Baru</p>
            <p className="text-xl font-extrabold text-emerald-800 mt-1">+ {formatNumber(growth?.totals?.saksi_baru_30h || 0)}</p>
            <p className="text-[9px] font-semibold text-emerald-600 mt-0.5">Update: {growth?.last_update?.saksi ? formatShortDate(growth.last_update.saksi) : '-'}</p>
          </div>
          <div className="p-3 rounded-xl bg-orange-50 border border-orange-100">
            <p className="text-[10px] font-bold uppercase tracking-wide text-orange-700">Total Semua</p>
            <p className="text-xl font-extrabold text-orange-800 mt-1">+ {formatNumber((growth?.totals?.simpatisan_baru_30h || 0) + (growth?.totals?.kader_baru_30h || 0) + (growth?.totals?.saksi_baru_30h || 0))}</p>
            <p className="text-[9px] font-semibold text-orange-600 mt-0.5">Dalam 30 hari</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={growth?.series || []}>
            <defs>
              <linearGradient id="gradSimpatisan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="gradKader" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="gradSaksi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="date" stroke="#9CA3AF" fontSize={10} tickFormatter={formatShortDate} />
            <YAxis stroke="#9CA3AF" fontSize={11} allowDecimals={false} />
            <Tooltip
              labelFormatter={(v) => formatShortDate(v)}
              formatter={(v, name) => [formatNumber(v), name === 'simpatisan' ? 'Simpatisan Baru' : name === 'kader' ? 'Kader Baru' : name === 'saksi' ? 'Saksi Baru' : name]}
              contentStyle={{ borderRadius: 8, border: '1px solid #FED7AA' }}
            />
            <Legend wrapperStyle={{ fontSize: 12, fontWeight: 600 }} />
            <Area type="monotone" dataKey="simpatisan" name="Simpatisan" stroke="#3B82F6" strokeWidth={2.5} fill="url(#gradSimpatisan)" />
            <Area type="monotone" dataKey="kader" name="Kader" stroke="#F59E0B" strokeWidth={2.5} fill="url(#gradKader)" />
            <Area type="monotone" dataKey="saksi" name="Saksi" stroke="#10B981" strokeWidth={2.5} fill="url(#gradSaksi)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SectionCard
          title="PROGRESS PEMENANGAN (Realisasi vs Baseline)"
          action={<button className="flex items-center gap-2 text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:border-orange-300">Semua Wilayah <ChevronDown className="w-3.5 h-3.5" /></button>}
        >
          <div className="flex items-center gap-4 mb-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-orange-500"></span> Realisasi</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-1 rounded-full bg-orange-300 border-b-2 border-dashed"></span> Baseline</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={CHART_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" stroke="#9CA3AF" fontSize={11} />
              <YAxis stroke="#9CA3AF" fontSize={11} tickFormatter={v => v >= 1000000 ? `${v/1000000}M` : `${v/1000}K`} />
              <Tooltip formatter={(v) => formatNumber(v)} />
              <Line type="monotone" dataKey="realisasi" stroke="#F97316" strokeWidth={3} dot={{ r: 4, fill: '#F97316' }} />
              <Line type="monotone" dataKey="baseline" stroke="#FDBA74" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="TARGET VS REALISASI SUARA" action={<button className="text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 flex items-center gap-1">Semua Wilayah <ChevronDown className="w-3.5 h-3.5" /></button>}>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="55%" height={230}>
              <PieChart>
                <Pie data={donutData} innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={2}>
                  {donutData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-xs font-semibold text-gray-500">Target Akhir</p>
                <p className="text-lg font-extrabold text-gray-900">{formatNumber(s.target)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500">Realisasi Saat Ini</p>
                <p className="text-lg font-extrabold text-orange-500">{formatNumber(s.realisasi)} <span className="text-xs">({s.targetPersen}%)</span></p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500">Baseline</p>
                <p className="text-lg font-extrabold text-amber-500">{formatNumber(s.baseline)} <span className="text-xs">({Math.round(s.baseline/s.target*100)}%)</span></p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500">Sisa Target</p>
                <p className="text-lg font-extrabold text-gray-400">{formatNumber(s.target - s.realisasi)} <span className="text-xs">({100-s.targetPersen}%)</span></p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 text-xs font-semibold">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-orange-500"></span> Realisasi</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-300"></span> Baseline</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-gray-200"></span> Sisa Target</span>
          </div>
        </SectionCard>

        <SectionCard title="PETA KEKUATAN & SEBARAN - SUKABUMI" action={<button className="text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 flex items-center gap-1"><Filter className="w-3.5 h-3.5" /> Filter</button>}>
          <SebaranPetaMini />
        </SectionCard>
      </div>

      {/* Sebaran Jaringan + Aktivitas + Simpatisan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SectionCard title="SEBARAN JARINGAN - KABUPATEN SUKABUMI">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { l: 'Kecamatan', v: '47', p: '(100%)' },
              { l: 'Desa / Kel', v: '381', p: '(100%)' },
              { l: 'RW Total', v: '±3.000', p: '' },
              { l: 'RW Tercover', v: '2.340', p: '(78%)' },
              { l: 'Coverage', v: '78%', p: '' },
            ].map(s => (
              <div key={s.l} className="text-center p-3 rounded-xl bg-orange-50/50 border border-orange-100">
                <p className="text-[10px] font-semibold text-gray-500 uppercase mb-2 truncate">{s.l}</p>
                <p className="text-lg sm:text-xl font-extrabold text-gray-900 whitespace-nowrap">{s.v}</p>
                {s.p && <p className="text-[10px] font-bold text-emerald-600 mt-1">{s.p}</p>}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 font-medium mt-4">Data per 19 Mei 2025</p>
        </SectionCard>

        <SectionCard title="AKTIVITAS TERBARU" action={<Button variant="link" className="text-orange-600 text-xs font-bold p-0">Lihat Semua</Button>}>
          <div className="space-y-3">
            {AKTIVITAS.slice(0, 5).map(a => {
              const Icon = ACT_ICONS[a.type] || Megaphone;
              return (
                <div key={a.id} className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-orange-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{a.title}</p>
                    <p className="text-xs text-gray-500 font-medium truncate">{a.desc}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 font-semibold whitespace-nowrap">{a.time}</span>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="DATA SIMPATISAN" action={
          <Button className="bg-orange-500 hover:bg-orange-600 h-8 rounded-lg text-xs font-bold"><Plus className="w-3.5 h-3.5 mr-1" /> Tambah</Button>
        }>
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input placeholder="Cari nama / no HP / alamat..." className="pl-9 h-9 text-xs" />
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {simpatisanList.slice(0, 5).map(s => (
              <div key={s.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-orange-50 transition-colors">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{s.nama}</p>
                  <p className="text-xs text-gray-500 font-medium">{s.hp || '-'} · {s.kecamatan}</p>
                </div>
                <div className="flex gap-1">
                  <button className="p-1.5 rounded-lg hover:bg-white text-gray-500"><Edit className="w-3.5 h-3.5" /></button>
                  <button className="p-1.5 rounded-lg hover:bg-white text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-gray-400 font-semibold text-center mt-3">Menampilkan 1-{Math.min(5, simpatisanList.length)} dari {simpatisanList.length} data</p>
        </SectionCard>
      </div>

      {/* Kegiatan + Struktur */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SectionCard title="STRUKTUR JARINGAN" className="lg:col-span-1">
          <p className="text-xs text-gray-500 font-medium mb-4">Hierarki Jaringan Pemenangan Kab. Sukabumi</p>
          <div className="space-y-2">
            {[
              { l: 'KABUPATEN SUKABUMI', c: 'bg-orange-500 text-white' },
              { l: '47 KECAMATAN', c: 'bg-orange-100 text-orange-700' },
              { l: '381 DESA / KELURAHAN', c: 'bg-orange-100 text-orange-700' },
              { l: '±3.000 RW', c: 'bg-orange-100 text-orange-700' },
              { l: 'KOORDINATOR / TIM RW', c: 'bg-orange-50 text-orange-600' },
            ].map((s, i) => (
              <div key={i} className={`p-3 rounded-xl text-center font-bold text-sm ${s.c}`}>{s.l}</div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
            <div className="flex justify-between font-semibold"><span className="text-gray-500">Koordinator Kec.</span><span className="font-bold">47</span></div>
            <div className="flex justify-between font-semibold"><span className="text-gray-500">Koordinator Desa</span><span className="font-bold">381</span></div>
            <div className="flex justify-between font-semibold"><span className="text-gray-500">Koordinator RW</span><span className="font-bold">2.340</span></div>
            <div className="flex justify-between font-semibold"><span className="text-orange-600">Total Relawan</span><span className="font-extrabold text-orange-600">41.708</span></div>
          </div>
        </SectionCard>

        <SectionCard title="TARGET & PROGRESS SUARA PER KECAMATAN" className="lg:col-span-1">
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {KECAMATAN_LIST.slice(0, 8).map(k => {
              const pct = Math.round((k.realisasi / k.target) * 100);
              return (
                <div key={k.name}>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-bold text-gray-900">{k.name}</span>
                    <span className="font-extrabold text-orange-600">{pct}%</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400 font-semibold mb-1">
                    <span>Baseline {formatNumber(k.baseline)}</span>
                    <span>Target {formatNumber(k.target)}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full" style={{width: `${pct}%`}}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="KEGIATAN & AGENDA" className="lg:col-span-1" action={
          <Button className="bg-orange-500 hover:bg-orange-600 h-8 rounded-lg text-xs font-bold"><Plus className="w-3.5 h-3.5 mr-1" /> Kegiatan</Button>
        }>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {KEGIATAN.slice(0, 4).map(k => (
              <div key={k.id} className="flex gap-3 p-2 rounded-xl hover:bg-orange-50/50 transition-colors">
                <img src={k.foto} alt={k.nama} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{k.nama}</p>
                  <p className="text-[11px] text-gray-500 font-medium truncate">{k.lokasi}</p>
                  <p className="text-[11px] text-gray-500 font-medium">{k.tanggal} · {k.jam}</p>
                  {k.progress ? (
                    <div className="mt-1">
                      <div className="flex justify-between text-[10px] font-bold"><span>Progress</span><span className="text-orange-600">{k.progress}%</span></div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mt-0.5">
                        <div className="h-full bg-orange-500 rounded-full" style={{width: `${k.progress}%`}}></div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-1">
                      <div className="flex justify-between text-[10px] font-bold"><span>Hadir</span><span className="text-emerald-600">{k.hadir}/{k.target}</span></div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mt-0.5">
                        <div className="h-full bg-emerald-500 rounded-full" style={{width: `${(k.hadir/k.target)*100}%`}}></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default Dashboard;
