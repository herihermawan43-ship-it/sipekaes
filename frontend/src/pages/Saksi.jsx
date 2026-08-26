import React from 'react';
import { ShieldCheck, Plus, Search, Filter, Edit, Trash2, MapPin } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { SAKSI } from '../mock/mockData';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '../components/ui/table';

const Saksi = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-4 gap-4">
      {[
        { l: 'Total Saksi TPS', v: '15.230', c: 'text-orange-600', bg: 'bg-orange-50' },
        { l: 'Terverifikasi', v: '13.850', c: 'text-emerald-600', bg: 'bg-emerald-50' },
        { l: 'Pending', v: '1.380', c: 'text-amber-600', bg: 'bg-amber-50' },
        { l: 'Coverage TPS', v: '87%', c: 'text-blue-600', bg: 'bg-blue-50' },
      ].map(s => (
        <div key={s.l} className="bg-white rounded-2xl p-5 card-shadow card-hover">
          <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
            <ShieldCheck className={`w-5 h-5 ${s.c}`} />
          </div>
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
            <Input placeholder="Cari saksi..." className="pl-9 h-10 w-64" />
          </div>
          <Button variant="outline" className="h-10 gap-2"><Filter className="w-4 h-4" /> Filter</Button>
          <Button className="h-10 bg-orange-500 hover:bg-orange-600 gap-2 font-bold"><Plus className="w-4 h-4" /> Tambah Saksi</Button>
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
          {SAKSI.map(s => (
            <TableRow key={s.id} className="hover:bg-orange-50/30">
              <TableCell className="font-bold">{s.nama}</TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-orange-100 text-orange-700 text-xs font-bold">
                  <MapPin className="w-3 h-3" /> {s.tps}
                </span>
              </TableCell>
              <TableCell className="font-semibold">{s.kecamatan}</TableCell>
              <TableCell className="font-medium">{s.desa}</TableCell>
              <TableCell className="font-medium">{s.hp}</TableCell>
              <TableCell>
                <Badge className={s.status === 'terverifikasi' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : 'bg-amber-100 text-amber-700 hover:bg-amber-100'}>
                  {s.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
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
);

export default Saksi;
