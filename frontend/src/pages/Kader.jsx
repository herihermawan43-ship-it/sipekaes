import React from 'react';
import { UserCheck, Plus, Search, Filter, Edit, Trash2, Download, Phone } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { KADER } from '../mock/mockData';

const Kader = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-4 gap-4">
      {[
        { l: 'Total Kader', v: '8.754' },
        { l: 'Koordinator Kec.', v: '47' },
        { l: 'Koordinator Desa', v: '381' },
        { l: 'Koordinator RW', v: '2.340' },
      ].map(s => (
        <div key={s.l} className="bg-white rounded-2xl p-5 card-shadow card-hover">
          <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center mb-3">
            <UserCheck className="w-5 h-5 text-orange-600" />
          </div>
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
            <Input placeholder="Cari kader..." className="pl-9 h-10 w-64" />
          </div>
          <Button variant="outline" className="h-10 gap-2"><Filter className="w-4 h-4" /> Filter</Button>
          <Button variant="outline" className="h-10 gap-2"><Download className="w-4 h-4" /> Ekspor</Button>
          <Button className="h-10 bg-orange-500 hover:bg-orange-600 gap-2 font-bold"><Plus className="w-4 h-4" /> Tambah Kader</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {KADER.map(k => (
          <div key={k.id} className="border border-gray-100 rounded-2xl p-4 hover:border-orange-300 transition-colors card-hover">
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-extrabold text-lg">
                {k.nama.split(' ')[0].charAt(0)}{k.nama.split(' ')[1]?.charAt(0) || ''}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-gray-900 truncate">{k.nama}</p>
                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 mt-1">{k.jabatan}</Badge>
              </div>
            </div>
            <div className="mt-3 space-y-1 text-xs font-semibold">
              <p><span className="text-gray-500">Wilayah:</span> {k.kecamatan}, {k.desa}</p>
              <p className="flex items-center gap-1"><Phone className="w-3 h-3 text-gray-400" /> {k.hp}</p>
              <p><span className="text-gray-500">Bergabung:</span> {k.tanggal}</p>
            </div>
            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
              <button className="flex-1 py-1.5 text-xs font-bold text-orange-600 hover:bg-orange-50 rounded-lg flex items-center justify-center gap-1"><Edit className="w-3.5 h-3.5" /> Edit</button>
              <button className="flex-1 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg flex items-center justify-center gap-1"><Trash2 className="w-3.5 h-3.5" /> Hapus</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Kader;
