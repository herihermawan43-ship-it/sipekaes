import React, { useState } from 'react';
import { kegiatanApi, agendaApi, tugasApi } from '../lib/api';
import { useEntity } from '../hooks/useEntity';
import { Calendar, MapPin, Users, Plus, Clock, CheckCircle2, AlertCircle, Edit, Trash2 } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import EntityFormDialog from '../components/EntityFormDialog';
import ConfirmDialog from '../components/ConfirmDialog';

const STATUS_KEGIATAN = [
  { value: 'rencana', label: 'Rencana' },
  { value: 'progress', label: 'Berjalan' },
  { value: 'selesai', label: 'Selesai' },
];

const KEGIATAN_FIELDS = [
  { name: 'nama', label: 'Nama Kegiatan', required: true, full: true },
  { name: 'tanggal', label: 'Tanggal', placeholder: 'mis. 12 Agustus 2026' },
  { name: 'jam', label: 'Jam', placeholder: 'mis. 09:00 - 12:00' },
  { name: 'lokasi', label: 'Lokasi', full: true },
  { name: 'wilayah', label: 'Wilayah / Kecamatan' },
  { name: 'status', label: 'Status', type: 'select', options: STATUS_KEGIATAN },
  { name: 'target', label: 'Target Peserta' },
  { name: 'hadir', label: 'Jumlah Hadir' },
  { name: 'foto', label: 'URL Foto', placeholder: 'https://...', full: true },
];

export const Kegiatan = () => {
  const { items, loading, create, update, remove } = useEntity(kegiatanApi, 'Kegiatan');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  const handleSubmit = async (data) => {
    const payload = { ...data, target: Number(data.target) || 0, hadir: Number(data.hadir) || 0 };
    return editData ? update(editData.id, payload) : create(payload);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-extrabold">Kegiatan Pemenangan</h3>
          <p className="text-sm text-gray-500 font-medium">Kelola seluruh kegiatan kampanye & aksi lapangan</p>
        </div>
        <Button onClick={() => { setEditData(null); setDialogOpen(true); }} className="bg-orange-500 hover:bg-orange-600 gap-2 font-bold">
          <Plus className="w-4 h-4" /> Tambah Kegiatan
        </Button>
      </div>

      {loading ? (
        <p className="text-center py-10 text-gray-400 font-semibold">Memuat...</p>
      ) : items.length === 0 ? (
        <p className="text-center py-10 text-gray-400 font-semibold">Belum ada kegiatan. Klik "Tambah Kegiatan" untuk mulai.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {items.map(k => (
            <div key={k.id} className="bg-white rounded-2xl overflow-hidden card-shadow card-hover">
              <div className="relative h-40 bg-gray-100">
                {k.foto && <img src={k.foto} alt={k.nama} className="w-full h-full object-cover" />}
                <div className="absolute top-3 right-3">
                  <Badge className={
                    k.status === 'selesai' ? 'bg-emerald-500 text-white' :
                    k.status === 'progress' ? 'bg-amber-500 text-white' :
                    'bg-blue-500 text-white'
                  }>{k.status}</Badge>
                </div>
                <div className="absolute top-3 left-3 flex gap-1">
                  <button onClick={() => { setEditData(k); setDialogOpen(true); }} className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-gray-600 hover:text-orange-600"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => setConfirmDel(k)} className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-gray-600 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="p-5">
                <h4 className="font-extrabold text-lg text-gray-900">{k.nama}</h4>
                <div className="mt-2 space-y-1 text-xs font-semibold text-gray-600">
                  <p className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-orange-500" /> {k.tanggal} · {k.jam}</p>
                  <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-orange-500" /> {k.lokasi}</p>
                  <p className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-orange-500" /> {k.wilayah}</p>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs font-bold"><span>Kehadiran</span><span className="text-emerald-600">{k.hadir || 0} / {k.target || 0}</span></div>
                  <div className="h-2 bg-gray-100 rounded-full mt-1 overflow-hidden"><div className="h-full bg-emerald-500" style={{width: `${k.target ? (k.hadir/k.target)*100 : 0}%`}}></div></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <EntityFormDialog
        open={dialogOpen} onOpenChange={setDialogOpen}
        title={editData ? 'Edit Kegiatan' : 'Tambah Kegiatan Baru'}
        fields={KEGIATAN_FIELDS} initialData={editData} onSubmit={handleSubmit}
      />
      <ConfirmDialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}
        title="Hapus Kegiatan?" description={`Kegiatan "${confirmDel?.nama}" akan dihapus permanen.`}
        onConfirm={() => remove(confirmDel.id)}
      />
    </div>
  );
};

const AGENDA_FIELDS = [
  { name: 'judul', label: 'Judul Agenda', required: true, full: true },
  { name: 'tanggal', label: 'Tanggal', placeholder: 'mis. 12 Agu 2026' },
  { name: 'jam', label: 'Jam', placeholder: 'mis. 09:00' },
  { name: 'lokasi', label: 'Lokasi', full: true },
  { name: 'tipe', label: 'Tipe', type: 'select', options: [{ value: 'publik', label: 'Publik' }, { value: 'internal', label: 'Internal' }] },
];

export const Agenda = () => {
  const { items, loading, create, update, remove } = useEntity(agendaApi, 'Agenda');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  const handleSubmit = (data) => editData ? update(editData.id, data) : create(data);

  const tanggalParts = (t) => (t || '').split(' ');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-extrabold">Agenda Kegiatan</h3>
          <p className="text-sm text-gray-500 font-medium">Jadwal kegiatan yang akan datang</p>
        </div>
        <Button onClick={() => { setEditData(null); setDialogOpen(true); }} className="bg-orange-500 hover:bg-orange-600 gap-2 font-bold">
          <Plus className="w-4 h-4" /> Tambah Agenda
        </Button>
      </div>

      {loading ? (
        <p className="text-center py-10 text-gray-400 font-semibold">Memuat...</p>
      ) : items.length === 0 ? (
        <p className="text-center py-10 text-gray-400 font-semibold">Belum ada agenda. Klik "Tambah Agenda" untuk mulai.</p>
      ) : (
        <div className="space-y-4">
          {items.map(a => {
            const parts = tanggalParts(a.tanggal);
            return (
              <div key={a.id} className="bg-white rounded-2xl p-5 card-shadow card-hover flex items-center gap-5">
                <div className="text-center bg-orange-100 rounded-2xl p-4 min-w-[80px]">
                  <p className="text-xs font-bold text-orange-700">{(parts[1] || '').toUpperCase()}</p>
                  <p className="text-3xl font-extrabold text-orange-600">{parts[0] || '-'}</p>
                  <p className="text-xs font-bold text-orange-700">{parts[2] || ''}</p>
                </div>
                <div className="flex-1">
                  <h4 className="font-extrabold text-lg">{a.judul}</h4>
                  <div className="flex flex-wrap items-center gap-4 mt-1 text-sm font-semibold text-gray-600">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {a.jam} WIB</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {a.lokasi}</span>
                  </div>
                </div>
                <Badge className={a.tipe === 'publik' ? 'bg-orange-100 text-orange-700 hover:bg-orange-100' : 'bg-blue-100 text-blue-700 hover:bg-blue-100'}>
                  {a.tipe}
                </Badge>
                <button onClick={() => { setEditData(a); setDialogOpen(true); }} className="p-1.5 rounded-lg hover:bg-orange-50 text-gray-500 hover:text-orange-600"><Edit className="w-4 h-4" /></button>
                <button onClick={() => setConfirmDel(a)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
              </div>
            );
          })}
        </div>
      )}

      <EntityFormDialog
        open={dialogOpen} onOpenChange={setDialogOpen}
        title={editData ? 'Edit Agenda' : 'Tambah Agenda Baru'}
        fields={AGENDA_FIELDS} initialData={editData} onSubmit={handleSubmit}
      />
      <ConfirmDialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}
        title="Hapus Agenda?" description={`Agenda "${confirmDel?.judul}" akan dihapus permanen.`}
        onConfirm={() => remove(confirmDel.id)}
      />
    </div>
  );
};

const TUGAS_FIELDS = [
  { name: 'judul', label: 'Judul Tugas', required: true, full: true },
  { name: 'pic', label: 'PIC (Penanggung Jawab)', required: true },
  { name: 'deadline', label: 'Deadline', placeholder: 'mis. 30 Agu 2026' },
  { name: 'prioritas', label: 'Prioritas', type: 'select', options: [{ value: 'tinggi', label: 'Tinggi' }, { value: 'sedang', label: 'Sedang' }, { value: 'rendah', label: 'Rendah' }] },
  { name: 'status', label: 'Status', type: 'select', options: [{ value: 'progress', label: 'Progress' }, { value: 'selesai', label: 'Selesai' }, { value: 'overdue', label: 'Overdue' }] },
  { name: 'progress', label: 'Progress (%)', placeholder: '0-100' },
];

export const Tugas = () => {
  const { items, loading, create, update, remove } = useEntity(tugasApi, 'Tugas');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  const handleSubmit = (data) => {
    const payload = { ...data, progress: Math.max(0, Math.min(100, Number(data.progress) || 0)) };
    return editData ? update(editData.id, payload) : create(payload);
  };

  const prioColor = (p) => p === 'tinggi' ? 'bg-red-100 text-red-700' : p === 'sedang' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700';

  const stats = [
    { l: 'Total Tugas', v: items.length, c: 'text-orange-600', bg: 'bg-orange-50', i: AlertCircle },
    { l: 'Selesai', v: items.filter(t => t.status === 'selesai').length, c: 'text-emerald-600', bg: 'bg-emerald-50', i: CheckCircle2 },
    { l: 'Progress', v: items.filter(t => t.status === 'progress').length, c: 'text-amber-600', bg: 'bg-amber-50', i: Clock },
    { l: 'Overdue', v: items.filter(t => t.status === 'overdue').length, c: 'text-red-600', bg: 'bg-red-50', i: AlertCircle },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.l} className="bg-white rounded-2xl p-5 card-shadow card-hover">
            <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center mb-3`}><s.i className={`w-5 h-5 ${s.c}`} /></div>
            <p className="text-sm font-semibold text-gray-500">{s.l}</p>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{s.v}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 card-shadow">
        <div className="flex justify-between mb-5">
          <h3 className="text-xl font-extrabold">Daftar Tugas</h3>
          <Button onClick={() => { setEditData(null); setDialogOpen(true); }} className="bg-orange-500 hover:bg-orange-600 gap-2 font-bold">
            <Plus className="w-4 h-4" /> Tambah Tugas
          </Button>
        </div>
        {loading ? (
          <p className="text-center py-8 text-gray-400 font-semibold">Memuat...</p>
        ) : items.length === 0 ? (
          <p className="text-center py-8 text-gray-400 font-semibold">Belum ada tugas. Klik "Tambah Tugas" untuk mulai.</p>
        ) : (
          <div className="space-y-3">
            {items.map(t => (
              <div key={t.id} className="p-4 border border-gray-100 rounded-2xl hover:border-orange-300 card-hover">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-extrabold text-gray-900">{t.judul}</h4>
                      <Badge className={`${prioColor(t.prioritas)} hover:${prioColor(t.prioritas)}`}>Prioritas {t.prioritas}</Badge>
                    </div>
                    <p className="text-xs text-gray-500 font-semibold mt-1">PIC: {t.pic} · Deadline: {t.deadline}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-extrabold text-orange-600">{t.progress}%</span>
                    <button onClick={() => { setEditData(t); setDialogOpen(true); }} className="p-1.5 rounded-lg hover:bg-orange-50 text-gray-500 hover:text-orange-600"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => setConfirmDel(t)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-400 to-orange-500" style={{width: `${t.progress}%`}}></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <EntityFormDialog
        open={dialogOpen} onOpenChange={setDialogOpen}
        title={editData ? 'Edit Tugas' : 'Tambah Tugas Baru'}
        fields={TUGAS_FIELDS} initialData={editData} onSubmit={handleSubmit}
      />
      <ConfirmDialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}
        title="Hapus Tugas?" description={`Tugas "${confirmDel?.judul}" akan dihapus permanen.`}
        onConfirm={() => remove(confirmDel.id)}
      />
    </div>
  );
};
