import React, { useState, useEffect, useMemo } from 'react';
import { formatNumber } from '../components/shared/UI';
import { Target, Flag, TrendingUp, Vote, Save, Plus, Trash2, Edit2, Check, Info, MapPin as MapPinIcon } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { wilayahTargetApi, statsApi, quickCountApi } from '../lib/api';
import { toast } from '../hooks/use-toast';
import { KECAMATAN_LIST as ALL_KEC } from '../mock/mockData';
import EntityFormDialog from '../components/EntityFormDialog';
import ConfirmDialog from '../components/ConfirmDialog';
import { AuthContext } from '../context/AuthContext';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '../components/ui/table';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '../components/ui/select';

// ============ Editable Target Suara ============
export const TargetSuara = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editRow, setEditRow] = useState(null);
  const [form, setForm] = useState({ kecamatan: '', baseline: 0, target: 0, realisasi: 0 });
  const [adding, setAdding] = useState(false);

  const load = () => {
    setLoading(true);
    wilayahTargetApi.list().then(r => setItems(r.data)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const startEdit = (row) => {
    setEditRow(row.id);
    setForm({ kecamatan: row.kecamatan, baseline: row.baseline, target: row.target, realisasi: row.realisasi });
  };

  const saveEdit = async (id) => {
    try {
      await wilayahTargetApi.update(id, {
        kecamatan: form.kecamatan,
        baseline: Number(form.baseline) || 0,
        target: Number(form.target) || 0,
        realisasi: Number(form.realisasi) || 0,
      });
      toast({ title: 'Target berhasil diperbarui' });
      setEditRow(null);
      load();
    } catch (e) { toast({ title: 'Gagal simpan', description: e.message, variant: 'destructive' }); }
  };

  const addRow = async () => {
    if (!form.kecamatan) return toast({ title: 'Pilih kecamatan dulu', variant: 'destructive' });
    try {
      await wilayahTargetApi.upsert({
        kecamatan: form.kecamatan,
        baseline: Number(form.baseline) || 0,
        target: Number(form.target) || 0,
        realisasi: Number(form.realisasi) || 0,
      });
      toast({ title: 'Data target ditambahkan' });
      setAdding(false); setForm({ kecamatan: '', baseline: 0, target: 0, realisasi: 0 });
      load();
    } catch (e) { toast({ title: 'Gagal', variant: 'destructive' }); }
  };

  const total = items.reduce((a,b) => ({
    baseline: a.baseline + (b.baseline||0),
    target: a.target + (b.target||0),
    realisasi: a.realisasi + (b.realisasi||0),
  }), { baseline: 0, target: 0, realisasi: 0 });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 card-shadow card-hover">
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mb-3"><Target className="w-6 h-6 text-orange-600" /></div>
          <p className="text-sm font-semibold text-gray-500">Total Target Kabupaten</p>
          <h3 className="text-3xl font-extrabold text-gray-900 mt-1">{formatNumber(total.target)}</h3>
        </div>
        <div className="bg-white rounded-2xl p-6 card-shadow card-hover">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-3"><TrendingUp className="w-6 h-6 text-emerald-600" /></div>
          <p className="text-sm font-semibold text-gray-500">Total Realisasi</p>
          <h3 className="text-3xl font-extrabold text-emerald-600 mt-1">{formatNumber(total.realisasi)}</h3>
        </div>
        <div className="bg-white rounded-2xl p-6 card-shadow card-hover">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-3"><Flag className="w-6 h-6 text-amber-600" /></div>
          <p className="text-sm font-semibold text-gray-500">Baseline</p>
          <h3 className="text-3xl font-extrabold text-amber-600 mt-1">{formatNumber(total.baseline)}</h3>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 card-shadow">
        <div className="flex justify-between mb-5">
          <div>
            <h3 className="text-xl font-extrabold">Target Suara per Kecamatan</h3>
            <p className="text-sm text-gray-500 font-medium">Klik ikon edit untuk mengubah baseline / target / realisasi</p>
          </div>
          <Button onClick={() => setAdding(true)} className="bg-orange-500 hover:bg-orange-600 gap-2 font-bold"><Plus className="w-4 h-4" /> Tambah Kecamatan</Button>
        </div>

        {adding && (
          <div className="mb-4 p-4 rounded-xl bg-orange-50 border border-orange-200 grid grid-cols-5 gap-3">
            <Select value={form.kecamatan} onValueChange={(v) => setForm({...form, kecamatan: v})}>
              <SelectTrigger><SelectValue placeholder="Pilih kecamatan" /></SelectTrigger>
              <SelectContent>{ALL_KEC.map(k => <SelectItem key={k.name} value={k.name}>{k.name}</SelectItem>)}</SelectContent>
            </Select>
            <Input type="number" value={form.baseline} onChange={e => setForm({...form, baseline: e.target.value})} placeholder="Baseline" />
            <Input type="number" value={form.target} onChange={e => setForm({...form, target: e.target.value})} placeholder="Target" />
            <Input type="number" value={form.realisasi} onChange={e => setForm({...form, realisasi: e.target.value})} placeholder="Realisasi" />
            <div className="flex gap-2">
              <Button onClick={addRow} className="bg-emerald-500 hover:bg-emerald-600 font-bold flex-1">Simpan</Button>
              <Button variant="outline" onClick={() => setAdding(false)}>Batal</Button>
            </div>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow className="bg-orange-50/50">
              <TableHead className="font-extrabold">Kecamatan</TableHead>
              <TableHead className="font-extrabold text-right">Baseline</TableHead>
              <TableHead className="font-extrabold text-right">Target</TableHead>
              <TableHead className="font-extrabold text-right">Realisasi</TableHead>
              <TableHead className="font-extrabold">Progress</TableHead>
              <TableHead className="font-extrabold w-20">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-400 font-semibold">Memuat...</TableCell></TableRow>
            ) : items.map(row => {
              const pct = row.target ? Math.round((row.realisasi/row.target)*100) : 0;
              const isEdit = editRow === row.id;
              return (
                <TableRow key={row.id} className="hover:bg-orange-50/30">
                  <TableCell className="font-bold">{row.kecamatan}</TableCell>
                  <TableCell className="text-right">
                    {isEdit ? <Input type="number" value={form.baseline} onChange={e => setForm({...form, baseline: e.target.value})} className="h-8 w-32 ml-auto" />
                      : <span className="font-medium">{formatNumber(row.baseline)}</span>}
                  </TableCell>
                  <TableCell className="text-right">
                    {isEdit ? <Input type="number" value={form.target} onChange={e => setForm({...form, target: e.target.value})} className="h-8 w-32 ml-auto" />
                      : <span className="font-medium">{formatNumber(row.target)}</span>}
                  </TableCell>
                  <TableCell className="text-right">
                    {isEdit ? <Input type="number" value={form.realisasi} onChange={e => setForm({...form, realisasi: e.target.value})} className="h-8 w-32 ml-auto" />
                      : <span className="font-bold text-orange-600">{formatNumber(row.realisasi)}</span>}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden flex-1 min-w-[80px]">
                        <div className="h-full bg-gradient-to-r from-orange-400 to-orange-500" style={{width: `${Math.min(100,pct)}%`}}></div>
                      </div>
                      <span className="text-xs font-extrabold text-orange-600 w-10">{pct}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {isEdit ? (
                      <Button size="sm" onClick={() => saveEdit(row.id)} className="bg-emerald-500 hover:bg-emerald-600 h-8"><Check className="w-4 h-4" /></Button>
                    ) : (
                      <button onClick={() => startEdit(row)} className="p-1.5 rounded-lg hover:bg-orange-50 text-gray-500 hover:text-orange-600"><Edit2 className="w-4 h-4" /></button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

// ============ Progress Suara (read from API) ============
export const ProgressSuara = () => {
  const [items, setItems] = useState([]);
  useEffect(() => { wilayahTargetApi.list().then(r => setItems(r.data)); }, []);

  const areaData = items.map((r,i) => ({ month: r.kecamatan.slice(0,3), realisasi: r.realisasi, target: r.target }));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 card-shadow">
        <h3 className="text-lg font-extrabold mb-5">Perbandingan Realisasi per Kecamatan</h3>
        <ResponsiveContainer width="100%" height={340}>
          <AreaChart data={areaData}>
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
        <h3 className="text-lg font-extrabold mb-5">Progress Kecamatan</h3>
        <div className="space-y-4">
          {items.map(k => {
            const pct = k.target ? Math.round((k.realisasi/k.target)*100) : 0;
            return (
              <div key={k.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-bold">{k.kecamatan}</span>
                  <span className="font-extrabold text-orange-600">{formatNumber(k.realisasi)} / {formatNumber(k.target)} · {pct}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-400 to-orange-500" style={{width: `${Math.min(100,pct)}%`}}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const BaselineSuara = () => {
  const [items, setItems] = useState([]);
  useEffect(() => { wilayahTargetApi.list().then(r => setItems(r.data)); }, []);
  return (
    <div className="bg-white rounded-2xl p-6 card-shadow">
      <h3 className="text-lg font-extrabold mb-5">Baseline Suara vs Target per Kecamatan</h3>
      <ResponsiveContainer width="100%" height={480}>
        <BarChart data={items} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
          <XAxis type="number" stroke="#9CA3AF" fontSize={11} tickFormatter={v => `${v/1000}K`} />
          <YAxis dataKey="kecamatan" type="category" stroke="#9CA3AF" fontSize={11} width={110} />
          <Tooltip formatter={v => formatNumber(v)} />
          <Legend />
          <Bar dataKey="baseline" name="Baseline" fill="#FDBA74" radius={[0,4,4,0]} />
          <Bar dataKey="target" name="Target" fill="#F97316" radius={[0,4,4,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const QuickCount = () => {
  const { user } = React.useContext(AuthContext) || {};
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([quickCountApi.list(), quickCountApi.summary()])
      .then(([a, b]) => { setItems(a.data); setSummary(b.data); })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); const t = setInterval(load, 30000); return () => clearInterval(t); }, []);

  const isSaksi = user?.role === 'saksi';
  const isAdmin = ['super_admin','admin_pusat','admin_input'].includes(user?.role);
  const canDelete = ['super_admin','admin_pusat'].includes(user?.role);

  const FIELDS = [
    { type: 'section', label: 'Info TPS' },
    { name: 'tps', label: 'No. TPS', required: true, placeholder: 'TPS 01', ...(isSaksi ? {} : {}) },
    { name: 'kecamatan', label: 'Kecamatan', required: true, type: 'select', options: ALL_KEC.map(k => ({value:k.name,label:k.name})) },
    { name: 'desa', label: 'Desa / Kelurahan' },
    { name: 'dpt', label: 'Jumlah DPT (Pemilih)', placeholder: '0' },
    { type: 'section', label: 'Perolehan Suara Sah' },
    { name: 'paslon_1', label: 'Suara Paslon 1', placeholder: '0' },
    { name: 'paslon_2', label: 'Suara Paslon 2 (Kami)', placeholder: '0' },
    { name: 'paslon_3', label: 'Suara Paslon 3', placeholder: '0' },
    { name: 'suara_tidak_sah', label: 'Suara Tidak Sah', placeholder: '0' },
    { name: 'catatan', label: 'Catatan (opsional)', full: true, placeholder: 'Kejadian penting di TPS...' },
  ];

  const handleSubmit = async (data) => {
    try {
      const payload = {
        tps: data.tps, kecamatan: data.kecamatan, desa: data.desa || '',
        paslon_1: Number(data.paslon_1) || 0, paslon_2: Number(data.paslon_2) || 0, paslon_3: Number(data.paslon_3) || 0,
        suara_tidak_sah: Number(data.suara_tidak_sah) || 0, dpt: Number(data.dpt) || 0, catatan: data.catatan || '',
      };
      if (editData) await quickCountApi.update(editData.id, payload);
      else await quickCountApi.create(payload);
      toast({ title: editData ? 'Hasil TPS diperbarui' : 'Hasil TPS terkirim' });
      load(); return true;
    } catch (e) {
      toast({ title: 'Gagal simpan', description: e.response?.data?.detail || e.message, variant: 'destructive' });
      return false;
    }
  };

  return (
    <div className="space-y-6">
      {/* Info banner */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm flex-1">
          <p className="font-bold text-orange-900">Cara Kerja Quick Count</p>
          <p className="text-xs text-orange-800 font-medium mt-1">
            Setiap <b>Saksi TPS</b> input hasil suara di TPS-nya lewat tombol "Input Hasil TPS".
            Sistem akan otomatis merekap dan menampilkan hasil real-time.
            Data ter-update setiap 30 detik.
          </p>
        </div>
        {(isSaksi || isAdmin) && (
          <Button onClick={() => { setEditData(null); setDialogOpen(true); }} className="bg-orange-500 hover:bg-orange-600 gap-2 font-bold h-11">
            <Plus className="w-4 h-4" /> Input Hasil TPS
          </Button>
        )}
      </div>

      {/* Stats coverage */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { l: 'TPS Terlapor', v: summary?.total_tps_terlapor || 0, sub: `dari ${summary?.target_tps || 0} TPS target`, c: 'orange' },
          { l: 'Coverage TPS', v: `${summary?.coverage_persen || 0}%`, sub: 'Rekap masuk', c: 'emerald' },
          { l: 'Total Suara Masuk', v: formatNumber(summary?.total_suara || 0), sub: `dari DPT ${formatNumber(summary?.total_dpt || 0)}`, c: 'blue' },
          { l: 'Partisipasi', v: `${summary?.partisipasi_persen || 0}%`, sub: 'suara masuk / DPT', c: 'amber' },
        ].map(s => (
          <div key={s.l} className="bg-white rounded-2xl p-5 card-shadow card-hover">
            <div className={`w-11 h-11 rounded-xl bg-${s.c}-50 flex items-center justify-center mb-3`}>
              <Vote className={`w-5 h-5 text-${s.c}-600`} />
            </div>
            <p className="text-sm font-semibold text-gray-500">{s.l}</p>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{s.v}</h3>
            <p className="text-[10px] text-gray-400 font-semibold mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 card-shadow">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center"><Vote className="w-5 h-5 text-orange-600" /></div>
            <div>
              <h3 className="text-lg font-extrabold">Hasil Real-time</h3>
              <p className="text-xs text-gray-500 font-medium">Auto-refresh tiap 30 detik</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={summary?.paslon || []} dataKey="suara" nameKey="nama" innerRadius={65} outerRadius={100} paddingAngle={3}>
                {(summary?.paslon || []).map((e, i) => <Cell key={i} fill={e.warna} />)}
              </Pie>
              <Tooltip formatter={v => formatNumber(v)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 card-shadow">
          <h3 className="text-lg font-extrabold mb-5">Perolehan Suara Sah</h3>
          <div className="space-y-4">
            {(summary?.paslon || []).map(p => (
              <div key={p.nama}>
                <div className="flex justify-between mb-1">
                  <span className="font-extrabold">{p.nama}</span>
                  <span className="font-extrabold text-lg" style={{ color: p.warna }}>{p.persen}% <span className="text-xs text-gray-400 font-semibold">({formatNumber(p.suara)})</span></span>
                </div>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${p.persen}%`, background: p.warna }}></div>
                </div>
              </div>
            ))}
          </div>
          {summary?.paslon && summary.paslon.length > 0 && summary.total_suara_sah > 0 && (
            <div className="mt-6 p-4 rounded-xl bg-orange-50 border border-orange-200">
              <p className="text-xs font-bold text-orange-700">STATUS: DATA MASUK {summary?.coverage_persen}%</p>
              <p className="text-sm font-semibold text-gray-700 mt-1">
                {summary.paslon.reduce((max, p) => p.persen > max.persen ? p : max, summary.paslon[0]).nama} memimpin dengan {summary.paslon.reduce((max, p) => p.persen > max.persen ? p : max, summary.paslon[0]).persen}%
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Daftar hasil TPS */}
      <div className="bg-white rounded-2xl p-6 card-shadow">
        <h3 className="text-lg font-extrabold mb-5">Daftar Hasil per TPS ({items.length})</h3>
        {loading ? <p className="text-center text-gray-400 py-8 font-semibold">Memuat...</p> :
         items.length === 0 ? <p className="text-center text-gray-400 py-8 font-semibold">Belum ada hasil TPS terkirim. Saksi bisa mulai input.</p> :
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-orange-50/50">
                <TableHead className="font-extrabold">TPS</TableHead>
                <TableHead className="font-extrabold">Kecamatan / Desa</TableHead>
                <TableHead className="font-extrabold text-right">Paslon 1</TableHead>
                <TableHead className="font-extrabold text-right bg-orange-100">Paslon 2 (Kami)</TableHead>
                <TableHead className="font-extrabold text-right">Paslon 3</TableHead>
                <TableHead className="font-extrabold text-right">Tidak Sah</TableHead>
                <TableHead className="font-extrabold">Waktu Input</TableHead>
                <TableHead className="font-extrabold">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map(it => (
                <TableRow key={it.id} className="hover:bg-orange-50/30">
                  <TableCell><Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100"><MapPinIcon className="w-3 h-3 mr-1" />{it.tps}</Badge></TableCell>
                  <TableCell className="font-medium text-xs">{it.kecamatan}<br/><span className="text-gray-400">{it.desa || '-'}</span></TableCell>
                  <TableCell className="text-right font-bold text-red-600">{formatNumber(it.paslon_1)}</TableCell>
                  <TableCell className="text-right font-extrabold text-orange-600 bg-orange-50/30">{formatNumber(it.paslon_2)}</TableCell>
                  <TableCell className="text-right font-bold text-blue-600">{formatNumber(it.paslon_3)}</TableCell>
                  <TableCell className="text-right font-medium text-gray-500">{formatNumber(it.suara_tidak_sah)}</TableCell>
                  <TableCell className="text-xs font-semibold text-gray-500">{new Date(it.submitted_at).toLocaleString('id-ID', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {(isAdmin || (isSaksi && it.submitted_by === user?.username)) && <button onClick={() => { setEditData(it); setDialogOpen(true); }} className="p-1.5 rounded-lg hover:bg-orange-50 text-gray-500 hover:text-orange-600"><Edit2 className="w-4 h-4" /></button>}
                      {canDelete && <button onClick={() => setConfirmDel(it)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>}
      </div>

      <EntityFormDialog
        open={dialogOpen} onOpenChange={setDialogOpen}
        title={editData ? `Edit Hasil ${editData.tps}` : 'Input Hasil TPS'}
        description="Masukkan perolehan suara sah tiap paslon. Data ter-update ke rekap secara real-time."
        fields={FIELDS} initialData={editData}
        onSubmit={handleSubmit}
      />
      <ConfirmDialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}
        title="Hapus Hasil TPS?" description={`Data ${confirmDel?.tps} akan dihapus.`}
        onConfirm={async () => { try { await quickCountApi.remove(confirmDel.id); toast({title:'Terhapus'}); load(); } catch (e) { toast({title:'Gagal', variant:'destructive'}); } }}
      />
    </div>
  );
};
