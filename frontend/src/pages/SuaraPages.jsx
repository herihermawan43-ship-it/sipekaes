import React, { useState, useEffect, useMemo } from 'react';
import { formatNumber } from '../components/shared/UI';
import { Target, Flag, TrendingUp, Vote, Save, Plus, Trash2, Edit2, Check } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { wilayahTargetApi, statsApi } from '../lib/api';
import { toast } from '../hooks/use-toast';
import { KECAMATAN_LIST as ALL_KEC } from '../mock/mockData';
import { QUICK_COUNT_DATA } from '../mock/mockData';
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

export const QuickCount = () => (
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
);
