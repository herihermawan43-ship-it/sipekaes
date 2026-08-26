import React, { useState } from 'react';
import { ShieldCheck, Plus, Search, Filter, Edit, Trash2, MapPin } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useEntity } from '../hooks/useEntity';
import { saksiApi } from '../lib/api';
import EntityFormDialog from '../components/EntityFormDialog';
import ConfirmDialog from '../components/ConfirmDialog';
import { KECAMATAN_LIST } from '../mock/mockData';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '../components/ui/table';

const FIELDS = [
  { name: 'nama', label: 'Nama Saksi', required: true },
  { name: 'tps', label: 'No. TPS', required: true, placeholder: 'TPS 01' },
  { name: 'kecamatan', label: 'Kecamatan', required: true, type: 'select', options: KECAMATAN_LIST.map(k => ({value: k.name, label: k.name})) },
  { name: 'desa', label: 'Desa / Kelurahan' },
  { name: 'rw', label: 'RW', placeholder: 'RW 01' },
  { name: 'hp', label: 'No. HP' },
  { name: 'status', label: 'Status', type: 'select', options: [{value:'pending',label:'Pending'},{value:'terverifikasi',label:'Terverifikasi'}] },
];

const Saksi = () => {
  const { items, loading, create, update, remove } = useEntity(saksiApi, 'Saksi');
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  const filtered = items.filter(s => s.nama?.toLowerCase().includes(search.toLowerCase()));

  const stats = [
    { l: 'Total Saksi TPS', v: items.length, c: 'text-orange-600', bg: 'bg-orange-50' },
    { l: 'Terverifikasi', v: items.filter(s => s.status === 'terverifikasi').length, c: 'text-emerald-600', bg: 'bg-emerald-50' },
    { l: 'Pending', v: items.filter(s => s.status === 'pending').length, c: 'text-amber-600', bg: 'bg-amber-50' },
    { l: 'Kecamatan Aktif', v: new Set(items.map(i => i.kecamatan)).size, c: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.l} className="bg-white rounded-2xl p-5 card-shadow card-hover">
            <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center mb-3`}><ShieldCheck className={`w-5 h-5 ${s.c}`} /></div>
            <p className="text-sm font-semibold text-gray-500">{s.l}</p>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{s.v}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 card-shadow">
        <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
          <h3 className="text-lg font-extrabold">Daftar Saksi TPS</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari saksi..." className="pl-9 h-10 w-64" />
            </div>
            <Button variant="outline" className="h-10 gap-2"><Filter className="w-4 h-4" /> Filter</Button>
            <Button onClick={() => { setEditData(null); setDialogOpen(true); }} className="h-10 bg-orange-500 hover:bg-orange-600 gap-2 font-bold"><Plus className="w-4 h-4" /> Tambah Saksi</Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-orange-50/50">
              <TableHead className="font-extrabold">Nama Saksi</TableHead>
              <TableHead className="font-extrabold">TPS</TableHead>
              <TableHead className="font-extrabold">Kecamatan</TableHead>
              <TableHead className="font-extrabold">Desa/Kel</TableHead>
              <TableHead className="font-extrabold">No. HP</TableHead>
              <TableHead className="font-extrabold">Status</TableHead>
              <TableHead className="font-extrabold">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-400 font-semibold">Memuat...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-400 font-semibold">Tidak ada data</TableCell></TableRow>
            ) : filtered.map(s => (
              <TableRow key={s.id} className="hover:bg-orange-50/30">
                <TableCell className="font-bold">{s.nama}</TableCell>
                <TableCell><span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-orange-100 text-orange-700 text-xs font-bold"><MapPin className="w-3 h-3" /> {s.tps}</span></TableCell>
                <TableCell className="font-semibold">{s.kecamatan}</TableCell>
                <TableCell className="font-medium">{s.desa || '-'}</TableCell>
                <TableCell className="font-medium">{s.hp || '-'}</TableCell>
                <TableCell>
                  <Badge className={s.status === 'terverifikasi' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : 'bg-amber-100 text-amber-700 hover:bg-amber-100'}>
                    {s.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditData(s); setDialogOpen(true); }} className="p-1.5 rounded-lg hover:bg-orange-50 text-gray-500 hover:text-orange-600"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => setConfirmDel(s)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <EntityFormDialog open={dialogOpen} onOpenChange={setDialogOpen}
        title={editData ? 'Edit Saksi' : 'Tambah Saksi'} fields={FIELDS} initialData={editData}
        onSubmit={async (d) => editData ? await update(editData.id, d) : await create(d)}
      />
      <ConfirmDialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}
        title="Hapus Saksi?" description={`"${confirmDel?.nama}" akan dihapus.`}
        onConfirm={async () => { await remove(confirmDel.id); }}
      />
    </div>
  );
};

export default Saksi;
