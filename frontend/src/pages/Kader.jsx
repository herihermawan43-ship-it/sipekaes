import React, { useState } from 'react';
import { UserCheck, Plus, Search, Filter, Edit, Trash2, Phone, Eye, MessageCircle } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useEntity } from '../hooks/useEntity';
import { kaderApi } from '../lib/api';
import EntityFormDialog from '../components/EntityFormDialog';
import ConfirmDialog from '../components/ConfirmDialog';
import DetailModal from '../components/DetailModal';
import { KECAMATAN_LIST } from '../mock/mockData';
import { KEANGGOTAAN_FIELDS } from '../lib/keanggotaanFields';
import { useAuth } from '../context/AuthContext';

const JABATAN_OPTS = ['Ketua DPC','Sekretaris DPC','Bendahara DPC','Kaderisasi','Humas','Litbang','Bidang Perempuan','Bidang Pemuda','Koordinator Kecamatan','Koordinator Desa','Koordinator RW','Kader Aktif'].map(v => ({value: v, label: v}));

const FIELDS = [
  { type: 'section', label: 'Data Diri' },
  { name: 'nama', label: 'Nama Lengkap', required: true },
  { name: 'jabatan', label: 'Jabatan Kader', required: true, type: 'select', options: JABATAN_OPTS },
  { name: 'kecamatan', label: 'Kecamatan', required: true, type: 'select', options: KECAMATAN_LIST.map(k => ({value: k.name, label: k.name})) },
  { name: 'desa', label: 'Desa / Kelurahan' },
  { name: 'rw', label: 'RW', placeholder: 'RW 01' },
  { name: 'hp', label: 'No. HP' },
  { name: 'alamat', label: 'Alamat', full: true },
  ...KEANGGOTAAN_FIELDS,
];

const normalizeWa = (hp) => { if (!hp) return ''; let s = String(hp).replace(/\D/g,''); if (s.startsWith('0')) s = '62' + s.slice(1); else if (!s.startsWith('62')) s = '62' + s; return s; };

const Kader = () => {
  const { user } = useAuth();
  const canWrite = ['super_admin','admin_pusat','admin_input','koordinator'].includes(user?.role);
  const { items, loading, create, update, remove } = useEntity(kaderApi, 'Kader');
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);
  const [detail, setDetail] = useState(null);

  const filtered = items.filter(k => k.nama?.toLowerCase().includes(search.toLowerCase()) || k.jabatan?.toLowerCase().includes(search.toLowerCase()));

  const stats = [
    { l: 'Total Kader', v: items.length },
    { l: 'Pengurus DPC', v: items.filter(k => k.is_pengurus_dpc).length },
    { l: 'Pengurus DPRA', v: items.filter(k => k.is_pengurus_dpra).length },
    { l: 'Pelopor / RKI', v: items.filter(k => k.is_pelopor || k.is_rki).length },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.l} className="bg-white rounded-2xl p-5 card-shadow card-hover">
            <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center mb-3"><UserCheck className="w-5 h-5 text-orange-600" /></div>
            <p className="text-sm font-semibold text-gray-500">{s.l}</p>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{s.v}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 card-shadow">
        <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
          <h3 className="text-lg font-extrabold">Daftar Kader</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari kader..." className="pl-9 h-10 w-64" />
            </div>
            <Button variant="outline" className="h-10 gap-2"><Filter className="w-4 h-4" /> Filter</Button>
            {canWrite && <Button onClick={() => { setEditData(null); setDialogOpen(true); }} className="h-10 bg-orange-500 hover:bg-orange-600 gap-2 font-bold"><Plus className="w-4 h-4" /> Tambah Kader</Button>}
          </div>
        </div>

        {loading ? <div className="text-center py-12 text-gray-400 font-semibold">Memuat data...</div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(k => {
              const badges = [
                k.is_pengurus_dpc && 'DPC',
                k.is_pengurus_dpra && 'DPRA',
                k.is_pelopor && 'Pelopor',
                k.is_rki && 'RKI',
              ].filter(Boolean);
              return (
                <div key={k.id} className="border border-gray-100 rounded-2xl p-4 hover:border-orange-300 card-hover">
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-extrabold text-lg">
                      {k.nama.split(' ')[0].charAt(0)}{k.nama.split(' ')[1]?.charAt(0) || ''}
                    </div>
                    <div className="flex-1 min-w-0">
                      <button onClick={() => setDetail(k)} className="font-extrabold text-gray-900 truncate text-left hover:text-orange-600">{k.nama}</button>
                      <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 mt-1">{k.jabatan}</Badge>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 text-xs font-semibold">
                    <p><span className="text-gray-500">Wilayah:</span> {k.kecamatan}{k.desa && `, ${k.desa}`}</p>
                    {k.hp && <p className="flex items-center gap-1"><Phone className="w-3 h-3 text-gray-400" /> {k.hp}</p>}
                    {badges.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {badges.map(b => <Badge key={b} className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-[10px]">{b}</Badge>)}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 mt-3 pt-3 border-t border-gray-100">
                    <button onClick={() => setDetail(k)} className="flex-1 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-50 rounded-lg flex items-center justify-center gap-1"><Eye className="w-3.5 h-3.5" /> Detail</button>
                    {k.hp && <a href={`https://wa.me/${normalizeWa(k.hp)}`} target="_blank" rel="noopener noreferrer" className="flex-1 py-1.5 text-xs font-bold text-emerald-600 hover:bg-emerald-50 rounded-lg flex items-center justify-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> WA</a>}
                    {canWrite && <button onClick={() => { setEditData(k); setDialogOpen(true); }} className="flex-1 py-1.5 text-xs font-bold text-orange-600 hover:bg-orange-50 rounded-lg flex items-center justify-center gap-1"><Edit className="w-3.5 h-3.5" /> Edit</button>}
                    {canWrite && <button onClick={() => setConfirmDel(k)} className="py-1.5 px-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <EntityFormDialog open={dialogOpen} onOpenChange={setDialogOpen}
        title={editData ? 'Edit Kader' : 'Tambah Kader'}
        description="Data otomatis tersinkron ke DPC/DPRA/Pelopor/RKI jika dicentang."
        fields={FIELDS} initialData={editData}
        onSubmit={async (d) => editData ? await update(editData.id, d) : await create(d)}
      />
      <ConfirmDialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}
        title="Hapus Kader?" description={`Data "${confirmDel?.nama}" akan dihapus.`}
        onConfirm={async () => { await remove(confirmDel.id); }}
      />
      <DetailModal open={!!detail} onOpenChange={(o) => !o && setDetail(null)} data={detail} entityLabel="Kader" />
    </div>
  );
};

export default Kader;
