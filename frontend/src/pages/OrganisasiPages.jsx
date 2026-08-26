import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Users2, Crown, Building, GraduationCap, Phone, MapPin } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useEntity } from '../hooks/useEntity';
import { dpcApi, dpraApi, peloporApi, rkiApi } from '../lib/api';
import EntityFormDialog from '../components/EntityFormDialog';
import ConfirmDialog from '../components/ConfirmDialog';
import { KECAMATAN_LIST } from '../mock/mockData';

const KEC_OPTS = KECAMATAN_LIST.map(k => ({ value: k.name, label: k.name }));

// ============ Reusable card page ============
const CardListPage = ({ api, entityLabel, fields, iconGradient = 'from-orange-400 to-orange-600', renderMeta, headerIcon: Icon }) => {
  const { items, loading, create, update, remove } = useEntity(api, entityLabel);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  const filtered = items.filter(k =>
    (k.nama || '').toLowerCase().includes(search.toLowerCase()) ||
    (k.jabatan || '').toLowerCase().includes(search.toLowerCase()) ||
    (k.kecamatan || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {[
          { l: `Total ${entityLabel}`, v: items.length },
          { l: 'Kecamatan Aktif', v: new Set(items.map(i => i.kecamatan).filter(Boolean)).size },
          { l: 'Jabatan Unik', v: new Set(items.map(i => i.jabatan || i.peran).filter(Boolean)).size },
          { l: 'Ditambah Bulan Ini', v: items.filter(i => new Date(i.tanggal) > new Date(Date.now() - 30*24*3600*1000)).length },
        ].map(s => (
          <div key={s.l} className="bg-white rounded-2xl p-5 card-shadow card-hover">
            <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center mb-3">
              <Icon className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-sm font-semibold text-gray-500">{s.l}</p>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{s.v}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 card-shadow">
        <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
          <h3 className="text-lg font-extrabold">Daftar {entityLabel}</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Cari ${entityLabel.toLowerCase()}...`} className="pl-9 h-10 w-64" />
            </div>
            <Button onClick={() => { setEditData(null); setDialogOpen(true); }} className="h-10 bg-orange-500 hover:bg-orange-600 gap-2 font-bold">
              <Plus className="w-4 h-4" /> Tambah {entityLabel}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400 font-semibold">Memuat data...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400 font-semibold">Belum ada data. Klik "Tambah {entityLabel}" untuk memulai.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(k => (
              <div key={k.id} className="border border-gray-100 rounded-2xl p-4 hover:border-orange-300 card-hover">
                <div className="flex items-start gap-3">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${iconGradient} flex items-center justify-center text-white font-extrabold text-lg`}>
                    {k.nama?.split(' ')[0]?.charAt(0)}{k.nama?.split(' ')[1]?.charAt(0) || ''}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-gray-900 truncate">{k.nama}</p>
                    {(k.jabatan || k.peran) && <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 mt-1">{k.jabatan || k.peran}</Badge>}
                  </div>
                </div>
                <div className="mt-3 space-y-1 text-xs font-semibold text-gray-600">
                  {renderMeta ? renderMeta(k) : (
                    <>
                      {k.kecamatan && <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-orange-500" />{k.kecamatan}{k.desa && `, ${k.desa}`}</p>}
                      {k.hp && <p className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-orange-500" />{k.hp}</p>}
                    </>
                  )}
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  <button onClick={() => { setEditData(k); setDialogOpen(true); }} className="flex-1 py-1.5 text-xs font-bold text-orange-600 hover:bg-orange-50 rounded-lg flex items-center justify-center gap-1"><Edit className="w-3.5 h-3.5" /> Edit</button>
                  <button onClick={() => setConfirmDel(k)} className="flex-1 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg flex items-center justify-center gap-1"><Trash2 className="w-3.5 h-3.5" /> Hapus</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <EntityFormDialog open={dialogOpen} onOpenChange={setDialogOpen}
        title={editData ? `Edit ${entityLabel}` : `Tambah ${entityLabel}`}
        fields={fields} initialData={editData}
        onSubmit={async (d) => editData ? await update(editData.id, d) : await create(d)}
      />
      <ConfirmDialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}
        title={`Hapus ${entityLabel}?`} description={`"${confirmDel?.nama}" akan dihapus.`}
        onConfirm={async () => { await remove(confirmDel.id); }}
      />
    </div>
  );
};

// ============ PENGURUS DPC ============
export const PengurusDPC = () => (
  <CardListPage
    api={dpcApi}
    entityLabel="Pengurus DPC"
    headerIcon={Crown}
    iconGradient="from-orange-500 to-red-500"
    fields={[
      { name: 'nama', label: 'Nama Lengkap', required: true },
      { name: 'jabatan', label: 'Jabatan', required: true, type: 'select', options: [
        'Ketua DPC','Wakil Ketua','Sekretaris','Wakil Sekretaris','Bendahara','Wakil Bendahara',
        'Kaderisasi','Humas','Litbang','Organisasi','Bidang Perempuan','Bidang Pemuda',
        'Bidang Keagamaan','Bidang Ekonomi','Bidang Hukum'
      ].map(v => ({value:v,label:v})) },
      { name: 'hp', label: 'No. HP' },
      { name: 'alamat', label: 'Alamat', full: true },
    ]}
  />
);

// ============ PENGURUS DPRA ============
export const PengurusDPRA = () => (
  <CardListPage
    api={dpraApi}
    entityLabel="Pengurus DPRA"
    headerIcon={Building}
    iconGradient="from-amber-400 to-orange-500"
    fields={[
      { name: 'nama', label: 'Nama Lengkap', required: true },
      { name: 'jabatan', label: 'Jabatan', required: true, type: 'select', options: [
        'Ketua DPRA','Sekretaris','Bendahara','Anggota','Koordinator','Humas'
      ].map(v => ({value:v,label:v})) },
      { name: 'kecamatan', label: 'Kecamatan', required: true, type: 'select', options: KEC_OPTS },
      { name: 'desa', label: 'Desa / Kelurahan', required: true },
      { name: 'hp', label: 'No. HP' },
      { name: 'kategori', label: 'Kategori', type: 'select', options: [{value:'kader',label:'Kader'},{value:'simpatisan',label:'Simpatisan'}] },
    ]}
    renderMeta={(k) => (
      <>
        <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-orange-500" />{k.kecamatan}, {k.desa}</p>
        {k.hp && <p className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-orange-500" />{k.hp}</p>}
        {k.kategori && <p className="text-[10px] font-bold uppercase tracking-wide text-orange-600 mt-1">Kategori: {k.kategori}</p>}
      </>
    )}
  />
);

// ============ PELOPOR ============
export const AnggotaPelopor = () => (
  <CardListPage
    api={peloporApi}
    entityLabel="Anggota Pelopor"
    headerIcon={GraduationCap}
    iconGradient="from-orange-400 to-amber-500"
    fields={[
      { name: 'nama', label: 'Nama Lengkap', required: true },
      { name: 'peran', label: 'Peran', type: 'select', options: [
        'Koordinator','Wakil Koordinator','Sekretaris','Anggota'
      ].map(v => ({value:v,label:v})) },
      { name: 'kecamatan', label: 'Kecamatan', required: true, type: 'select', options: KEC_OPTS },
      { name: 'desa', label: 'Desa / Kelurahan' },
      { name: 'hp', label: 'No. HP' },
    ]}
  />
);

// ============ RKI ============
export const AnggotaRKI = () => (
  <CardListPage
    api={rkiApi}
    entityLabel="Anggota RKI"
    headerIcon={Users2}
    iconGradient="from-red-400 to-orange-500"
    fields={[
      { name: 'nama', label: 'Nama Lengkap', required: true },
      { name: 'jabatan', label: 'Jabatan', type: 'select', options: [
        'Ketua RKI','Sekretaris','Bendahara','Anggota'
      ].map(v => ({value:v,label:v})) },
      { name: 'kecamatan', label: 'Kecamatan', required: true, type: 'select', options: KEC_OPTS },
      { name: 'desa', label: 'Desa / Kelurahan' },
      { name: 'hp', label: 'No. HP' },
    ]}
  />
);
