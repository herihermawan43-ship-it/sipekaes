import React from 'react';
import { USERS } from '../mock/mockData';
import { UserCog, Plus, Shield, Users, UserCheck, ShieldCheck, MapPin, Bell, Lock, Palette, Globe, Save } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '../components/ui/table';

const roleIcons = {
  super_admin: Shield,
  admin_pusat: Users,
  admin_input: UserCheck,
  koordinator: MapPin,
  saksi: ShieldCheck,
};

export const Pengguna = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-5 gap-4">
      {[
        { l: 'Super Admin', v: 1, c: 'text-orange-600', bg: 'bg-orange-50', i: Shield },
        { l: 'Admin Pusat', v: 3, c: 'text-amber-600', bg: 'bg-amber-50', i: Users },
        { l: 'Admin Input', v: 47, c: 'text-orange-500', bg: 'bg-orange-50', i: UserCheck },
        { l: 'Koordinator', v: 428, c: 'text-red-500', bg: 'bg-red-50', i: MapPin },
        { l: 'Saksi TPS', v: 15230, c: 'text-emerald-600', bg: 'bg-emerald-50', i: ShieldCheck },
      ].map(s => (
        <div key={s.l} className="bg-white rounded-2xl p-5 card-shadow card-hover">
          <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center mb-3`}><s.i className={`w-5 h-5 ${s.c}`} /></div>
          <p className="text-sm font-semibold text-gray-500">{s.l}</p>
          <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{new Intl.NumberFormat('id-ID').format(s.v)}</h3>
        </div>
      ))}
    </div>

    <div className="bg-white rounded-2xl p-6 card-shadow">
      <div className="flex justify-between mb-5">
        <h3 className="text-xl font-extrabold">Daftar Pengguna</h3>
        <Button className="bg-orange-500 hover:bg-orange-600 gap-2 font-bold"><Plus className="w-4 h-4" /> Tambah Pengguna</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-orange-50/50">
            <TableHead className="font-extrabold">Pengguna</TableHead>
            <TableHead className="font-extrabold">Username</TableHead>
            <TableHead className="font-extrabold">Role</TableHead>
            <TableHead className="font-extrabold">Status</TableHead>
            <TableHead className="font-extrabold">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {USERS.map(u => {
            const Icon = roleIcons[u.role] || UserCog;
            return (
              <TableRow key={u.id} className="hover:bg-orange-50/30">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img src={u.avatar} className="w-9 h-9 rounded-full object-cover" alt={u.name} />
                    <span className="font-bold">{u.name}</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs">{u.username}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-100 text-orange-700 text-xs font-bold">
                    <Icon className="w-3.5 h-3.5" /> {u.roleLabel}
                  </span>
                </TableCell>
                <TableCell><Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">aktif</Badge></TableCell>
                <TableCell>
                  <Button variant="outline" className="h-8 text-xs font-bold">Edit</Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  </div>
);

export const Pengaturan = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2 space-y-6">
      <div className="bg-white rounded-2xl p-6 card-shadow">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center"><Globe className="w-5 h-5 text-orange-600" /></div>
          <h3 className="text-lg font-extrabold">Informasi Organisasi</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><Label className="font-semibold">Nama Organisasi</Label><Input defaultValue="DPC Partai Sukabumi" className="mt-1.5 h-10" /></div>
          <div><Label className="font-semibold">Wilayah</Label><Input defaultValue="Kabupaten Sukabumi" className="mt-1.5 h-10" /></div>
          <div><Label className="font-semibold">Alamat</Label><Input defaultValue="Jl. Pusat Koordinasi No. 1" className="mt-1.5 h-10" /></div>
          <div><Label className="font-semibold">Kontak</Label><Input defaultValue="(0266) 123-4567" className="mt-1.5 h-10" /></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 card-shadow">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center"><Bell className="w-5 h-5 text-orange-600" /></div>
          <h3 className="text-lg font-extrabold">Notifikasi</h3>
        </div>
        <div className="space-y-4">
          {[
            { l: 'Notifikasi Simpatisan Baru', d: 'Terima notifikasi setiap simpatisan baru terdaftar' },
            { l: 'Notifikasi Kegiatan', d: 'Reminder H-1 sebelum kegiatan' },
            { l: 'Notifikasi Progress Suara', d: 'Update harian progress suara' },
            { l: 'Notifikasi Quick Count', d: 'Update real-time saat pemilu' },
          ].map(n => (
            <div key={n.l} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
              <div>
                <p className="font-bold text-sm">{n.l}</p>
                <p className="text-xs text-gray-500 font-medium">{n.d}</p>
              </div>
              <Switch defaultChecked />
            </div>
          ))}
        </div>
      </div>

      <Button className="bg-orange-500 hover:bg-orange-600 gap-2 font-bold h-11"><Save className="w-4 h-4" /> Simpan Pengaturan</Button>
    </div>

    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 card-shadow">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center"><Palette className="w-5 h-5 text-orange-600" /></div>
          <h3 className="text-lg font-extrabold">Tampilan</h3>
        </div>
        <p className="text-xs font-semibold text-gray-500 mb-2">Warna Utama</p>
        <div className="flex gap-2">
          {['#F97316', '#EF4444', '#3B82F6', '#10B981', '#8B5CF6'].map(c => (
            <button key={c} className={`w-10 h-10 rounded-xl border-2 ${c === '#F97316' ? 'border-gray-900' : 'border-transparent'}`} style={{ background: c }}></button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 card-shadow">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center"><Lock className="w-5 h-5 text-orange-600" /></div>
          <h3 className="text-lg font-extrabold">Keamanan</h3>
        </div>
        <div className="space-y-3">
          <Button variant="outline" className="w-full font-bold justify-start">Ubah Password</Button>
          <Button variant="outline" className="w-full font-bold justify-start">Aktifkan 2FA</Button>
          <Button variant="outline" className="w-full font-bold justify-start">Log Aktivitas</Button>
        </div>
      </div>
    </div>
  </div>
);
