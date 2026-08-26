import React, { useState, useRef } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Download, Users, Upload, FileSpreadsheet, Loader2 } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useEntity } from '../hooks/useEntity';
import { simpatisanApi, excelApi } from '../lib/api';
import { toast } from '../hooks/use-toast';
import EntityFormDialog from '../components/EntityFormDialog';
import ConfirmDialog from '../components/ConfirmDialog';
import { KECAMATAN_LIST } from '../mock/mockData';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '../components/ui/table';

const FIELDS = [
  { name: 'nama', label: 'Nama Lengkap', required: true, placeholder: 'Nama sesuai KTP' },
  { name: 'nik', label: 'NIK', placeholder: '16 digit NIK' },
  { name: 'hp', label: 'No. HP', placeholder: '0812xxxx' },
  { name: 'kecamatan', label: 'Kecamatan', required: true, type: 'select', options: KECAMATAN_LIST.map(k => ({ value: k.name, label: k.name })) },
  { name: 'desa', label: 'Desa / Kelurahan', placeholder: 'Nama desa' },
  { name: 'rw', label: 'RW', placeholder: 'RW 01' },
  { name: 'rt', label: 'RT', placeholder: 'RT 01' },
  { name: 'alamat', label: 'Alamat Lengkap', full: true, placeholder: 'Jl. ...' },
];

const Simpatisan = () => {
  const { items, loading, create, update, remove, load } = useEntity(simpatisanApi, 'Simpatisan');
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);
  const [importing, setImporting] = useState(false);
  const fileRef = useRef();

  const filtered = items.filter(s =>
    s.nama?.toLowerCase().includes(search.toLowerCase()) ||
    s.hp?.includes(search) ||
    s.kecamatan?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (data) => {
    if (editData) return await update(editData.id, data);
    return await create(data);
  };

  const openAdd = () => { setEditData(null); setDialogOpen(true); };
  const openEdit = (s) => { setEditData(s); setDialogOpen(true); };

  const downloadTemplate = async () => {
    try {
      const res = await excelApi.downloadTemplate();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url; a.download = 'template_simpatisan.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
      toast({ title: 'Template terunduh' });
    } catch (e) {
      toast({ title: 'Gagal unduh template', variant: 'destructive' });
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImporting(true);
    try {
      const res = await excelApi.import(file);
      const { inserted, errors, total_errors } = res.data;
      toast({
        title: `Import selesai — ${inserted} data ditambahkan`,
        description: total_errors > 0 ? `${total_errors} baris gagal (cek konsol)` : 'Semua baris berhasil'
      });
      if (errors?.length) console.warn('Import errors:', errors);
      await load();
    } catch (err) {
      toast({ title: 'Gagal import', description: err.response?.data?.detail || err.message, variant: 'destructive' });
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  const stats = [
    { l: 'Total Simpatisan', v: items.length, c: 'text-orange-600', bg: 'bg-orange-50' },
    { l: 'Terverifikasi', v: items.filter(i => i.status === 'aktif').length, c: 'text-emerald-600', bg: 'bg-emerald-50' },
    { l: 'Menunggu Verifikasi', v: items.filter(i => i.status !== 'aktif').length, c: 'text-amber-600', bg: 'bg-amber-50' },
    { l: 'Kecamatan Aktif', v: new Set(items.map(i => i.kecamatan)).size, c: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.l} className="bg-white rounded-2xl p-5 card-shadow card-hover">
            <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <Users className={`w-5 h-5 ${s.c}`} />
            </div>
            <p className="text-sm font-semibold text-gray-500">{s.l}</p>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{new Intl.NumberFormat('id-ID').format(s.v)}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 card-shadow">
        <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-1 min-w-[300px]">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama, No. HP, atau alamat..." className="pl-9 h-10" />
            </div>
            <Button variant="outline" className="h-10 gap-2 font-semibold"><Filter className="w-4 h-4" /> Filter</Button>
          </div>
          <div className="flex gap-2">
            <input ref={fileRef} type="file" accept=".xlsx,.xls" onChange={handleImport} className="hidden" />
            <Button variant="outline" onClick={downloadTemplate} className="h-10 gap-2 font-semibold"><FileSpreadsheet className="w-4 h-4" /> Template</Button>
            <Button variant="outline" onClick={() => fileRef.current?.click()} disabled={importing} className="h-10 gap-2 font-semibold">
              {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Import Excel
            </Button>
            <Button onClick={openAdd} className="h-10 bg-orange-500 hover:bg-orange-600 gap-2 font-bold"><Plus className="w-4 h-4" /> Tambah Simpatisan</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-orange-50/50">
                <TableHead className="font-extrabold text-gray-700">Nama</TableHead>
                <TableHead className="font-extrabold text-gray-700">NIK</TableHead>
                <TableHead className="font-extrabold text-gray-700">No. HP</TableHead>
                <TableHead className="font-extrabold text-gray-700">Kecamatan</TableHead>
                <TableHead className="font-extrabold text-gray-700">Desa/Kel</TableHead>
                <TableHead className="font-extrabold text-gray-700">RW/RT</TableHead>
                <TableHead className="font-extrabold text-gray-700">Status</TableHead>
                <TableHead className="font-extrabold text-gray-700">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-gray-400 font-semibold">Memuat data...</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-gray-400 font-semibold">Tidak ada data</TableCell></TableRow>
              ) : filtered.map(s => (
                <TableRow key={s.id} className="hover:bg-orange-50/30">
                  <TableCell className="font-bold">{s.nama}</TableCell>
                  <TableCell className="font-mono text-xs">{s.nik || '-'}</TableCell>
                  <TableCell className="font-medium">{s.hp || '-'}</TableCell>
                  <TableCell className="font-semibold">{s.kecamatan}</TableCell>
                  <TableCell className="font-medium">{s.desa || '-'}</TableCell>
                  <TableCell className="font-medium">{s.rw || '-'} / {s.rt || '-'}</TableCell>
                  <TableCell>
                    <Badge className={s.status === 'aktif' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : 'bg-amber-100 text-amber-700 hover:bg-amber-100'}>
                      {s.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-orange-50 text-gray-500 hover:text-orange-600"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => setConfirmDel(s)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <EntityFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editData ? 'Edit Simpatisan' : 'Tambah Simpatisan'}
        description="Isi data simpatisan dengan lengkap"
        fields={FIELDS}
        initialData={editData}
        onSubmit={handleSubmit}
      />
      <ConfirmDialog
        open={!!confirmDel}
        onOpenChange={(o) => !o && setConfirmDel(null)}
        title="Hapus Simpatisan?"
        description={`Data "${confirmDel?.nama}" akan dihapus permanen.`}
        onConfirm={async () => { await remove(confirmDel.id); }}
      />
    </div>
  );
};

export default Simpatisan;
