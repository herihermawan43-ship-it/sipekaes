import React from 'react';
import { KEGIATAN, AGENDA, TUGAS } from '../mock/mockData';
import { Calendar, MapPin, Users, Plus, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

export const Kegiatan = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-xl font-extrabold">Kegiatan Pemenangan</h3>
        <p className="text-sm text-gray-500 font-medium">Kelola seluruh kegiatan kampanye & aksi lapangan</p>
      </div>
      <Button className="bg-orange-500 hover:bg-orange-600 gap-2 font-bold"><Plus className="w-4 h-4" /> Tambah Kegiatan</Button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {KEGIATAN.map(k => (
        <div key={k.id} className="bg-white rounded-2xl overflow-hidden card-shadow card-hover">
          <div className="relative h-40">
            <img src={k.foto} alt={k.nama} className="w-full h-full object-cover" />
            <div className="absolute top-3 right-3">
              <Badge className={
                k.status === 'selesai' ? 'bg-emerald-500 text-white' :
                k.status === 'progress' ? 'bg-amber-500 text-white' :
                'bg-blue-500 text-white'
              }>{k.status}</Badge>
            </div>
          </div>
          <div className="p-5">
            <h4 className="font-extrabold text-lg text-gray-900">{k.nama}</h4>
            <div className="mt-2 space-y-1 text-xs font-semibold text-gray-600">
              <p className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-orange-500" /> {k.tanggal} · {k.jam}</p>
              <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-orange-500" /> {k.lokasi}</p>
              <p className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-orange-500" /> {k.wilayah}</p>
            </div>
            {k.progress ? (
              <div className="mt-3">
                <div className="flex justify-between text-xs font-bold"><span>Progress</span><span className="text-orange-600">{k.progress}%</span></div>
                <div className="h-2 bg-gray-100 rounded-full mt-1 overflow-hidden"><div className="h-full bg-orange-500" style={{width: `${k.progress}%`}}></div></div>
              </div>
            ) : (
              <div className="mt-3">
                <div className="flex justify-between text-xs font-bold"><span>Kehadiran</span><span className="text-emerald-600">{k.hadir} / {k.target}</span></div>
                <div className="h-2 bg-gray-100 rounded-full mt-1 overflow-hidden"><div className="h-full bg-emerald-500" style={{width: `${(k.hadir/k.target)*100}%`}}></div></div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const Agenda = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-xl font-extrabold">Agenda Kegiatan</h3>
        <p className="text-sm text-gray-500 font-medium">Jadwal kegiatan yang akan datang</p>
      </div>
      <Button className="bg-orange-500 hover:bg-orange-600 gap-2 font-bold"><Plus className="w-4 h-4" /> Tambah Agenda</Button>
    </div>

    <div className="space-y-4">
      {AGENDA.map(a => (
        <div key={a.id} className="bg-white rounded-2xl p-5 card-shadow card-hover flex items-center gap-5">
          <div className="text-center bg-orange-100 rounded-2xl p-4 min-w-[80px]">
            <p className="text-xs font-bold text-orange-700">{a.tanggal.split(' ')[1].toUpperCase()}</p>
            <p className="text-3xl font-extrabold text-orange-600">{a.tanggal.split(' ')[0]}</p>
            <p className="text-xs font-bold text-orange-700">{a.tanggal.split(' ')[2]}</p>
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
          <Button variant="outline" className="font-bold">Detail</Button>
        </div>
      ))}
    </div>
  </div>
);

export const Tugas = () => {
  const prioColor = (p) => p === 'tinggi' ? 'bg-red-100 text-red-700' : p === 'sedang' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700';
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {[
          { l: 'Total Tugas', v: TUGAS.length, c: 'text-orange-600', bg: 'bg-orange-50', i: AlertCircle },
          { l: 'Selesai', v: 12, c: 'text-emerald-600', bg: 'bg-emerald-50', i: CheckCircle2 },
          { l: 'Progress', v: TUGAS.length, c: 'text-amber-600', bg: 'bg-amber-50', i: Clock },
          { l: 'Overdue', v: 2, c: 'text-red-600', bg: 'bg-red-50', i: AlertCircle },
        ].map(s => (
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
          <Button className="bg-orange-500 hover:bg-orange-600 gap-2 font-bold"><Plus className="w-4 h-4" /> Tambah Tugas</Button>
        </div>
        <div className="space-y-3">
          {TUGAS.map(t => (
            <div key={t.id} className="p-4 border border-gray-100 rounded-2xl hover:border-orange-300 card-hover">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-extrabold text-gray-900">{t.judul}</h4>
                    <Badge className={`${prioColor(t.prioritas)} hover:${prioColor(t.prioritas)}`}>Prioritas {t.prioritas}</Badge>
                  </div>
                  <p className="text-xs text-gray-500 font-semibold mt-1">PIC: {t.pic} · Deadline: {t.deadline}</p>
                </div>
                <span className="text-2xl font-extrabold text-orange-600">{t.progress}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-400 to-orange-500" style={{width: `${t.progress}%`}}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
