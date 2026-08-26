import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Download, Users } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { SIMPATISAN } from '../mock/mockData';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '../components/ui/table';

const Simpatisan = () => {
  const [search, setSearch] = useState('');
  const filtered = SIMPATISAN.filter(s =>
    s.nama.toLowerCase().includes(search.toLowerCase()) ||
    s.hp.includes(search) ||
    s.kecamatan.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {[
          { l: 'Total Simpatisan', v: '125.430', c: 'text-orange-600', bg: 'bg-orange-50' },
          { l: 'Terverifikasi', v: '118.230', c: 'text-emerald-600', bg: 'bg-emerald-50' },
          { l: 'Menunggu Verifikasi', v: '7.200', c: 'text-amber-600', bg: 'bg-amber-50' },
          { l: 'Tambah Hari Ini', v: '+ 342', c: 'text-blue-600', bg: 'bg-blue-50' },
        ].map(s => (
          <div key={s.l} className="bg-white rounded-2xl p-5 card-shadow card-hover">
            <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <Users className={`w-5 h-5 ${s.c}`} />
            </div>
            <p className="text-sm font-semibold text-gray-500">{s.l}</p>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{s.v}</h3>
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
            <Button variant="outline" className="h-10 gap-2 font-semibold"><Download className="w-4 h-4" /> Ekspor</Button>
            <Button className="h-10 bg-orange-500 hover:bg-orange-600 gap-2 font-bold"><Plus className="w-4 h-4" /> Tambah Simpatisan</Button>
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
                <TableHead className="font-extrabold text-gray-700">Tanggal</TableHead>
                <TableHead className="font-extrabold text-gray-700">Status</TableHead>
                <TableHead className="font-extrabold text-gray-700">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(s => (
                <TableRow key={s.id} className="hover:bg-orange-50/30">
                  <TableCell className="font-bold">{s.nama}</TableCell>
                  <TableCell className="font-mono text-xs">{s.nik}</TableCell>
                  <TableCell className="font-medium">{s.hp}</TableCell>
                  <TableCell className="font-semibold">{s.kecamatan}</TableCell>
                  <TableCell className="font-medium">{s.desa}</TableCell>
                  <TableCell className="font-medium">{s.rw} / {s.rt}</TableCell>
                  <TableCell className="font-medium">{s.tanggal}</TableCell>
                  <TableCell>
                    <Badge className={s.status === 'aktif' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : 'bg-amber-100 text-amber-700 hover:bg-amber-100'}>
                      {s.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-orange-50 text-gray-500 hover:text-orange-600"><Eye className="w-4 h-4" /></button>
                      <button className="p-1.5 rounded-lg hover:bg-orange-50 text-gray-500 hover:text-orange-600"><Edit className="w-4 h-4" /></button>
                      <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Simpatisan;
