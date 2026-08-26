import React, { useEffect, useState } from 'react';
import { UserCog, Plus, Shield, Users, UserCheck, ShieldCheck, MapPin, Bell, Lock, Palette, Globe, Save, Edit, Trash2, Eye, EyeOff, AlertTriangle, KeyRound, Info, Trash } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { usersApi, passwordApi, adminApi } from '../lib/api';
import { toast } from '../hooks/use-toast';
import { useAuth } from '../context/AuthContext';
import EntityFormDialog from '../components/EntityFormDialog';
import ConfirmDialog from '../components/ConfirmDialog';
import { KECAMATAN_LIST } from '../mock/mockData';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '../components/ui/table';

const roleIcons = {
  super_admin: Shield, admin_pusat: Users, admin_input: UserCheck, koordinator: MapPin, saksi: ShieldCheck,
};
const ROLE_OPTIONS = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin_pusat', label: 'Admin Pusat' },
  { value: 'admin_input', label: 'Admin Input' },
  { value: 'koordinator', label: 'Koordinator' },
  { value: 'saksi', label: 'Saksi TPS' },
];

const USER_FIELDS = [
  { type: 'section', label: 'Info Akun' },
  { name: 'name', label: 'Nama Lengkap', required: true },
  { name: 'username', label: 'Username', required: true, placeholder: 'huruf kecil, tanpa spasi' },
  { name: 'password', label: 'Password', required: true, placeholder: 'Minimal 6 karakter' },
  { name: 'role', label: 'Role Pengguna', required: true, type: 'select', options: ROLE_OPTIONS },
  { name: 'roleLabel', label: 'Label Role (opsional)', placeholder: 'mis. Admin Wilayah Utara' },
  { type: 'section', label: 'Wilayah Kerja (Untuk Koordinator/Saksi)' },
  { name: 'kecamatan_kerja', label: 'Kecamatan Kerja', type: 'select', options: [{value:'',label:'-- Tidak dibatasi --'}, ...KECAMATAN_LIST.map(k => ({value:k.name,label:k.name}))] },
  { name: 'desa_kerja', label: 'Desa/Kelurahan Kerja', placeholder: 'Kosongkan bila akses semua desa' },
  { name: 'tps_kerja', label: 'TPS Kerja (khusus Saksi)', placeholder: 'mis. TPS 01' },
];

export const Pengguna = () => {
  const { user: current } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  const load = () => {
    setLoading(true);
    usersApi.list().then(r => setItems(r.data)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (data) => {
    try {
      if (editData) {
        await usersApi.update(editData.id, { ...data, password: data.password || null });
        toast({ title: 'Pengguna diperbarui' });
      } else {
        await usersApi.create(data);
        toast({ title: 'Pengguna baru ditambahkan' });
      }
      load(); return true;
    } catch (e) {
      toast({ title: 'Gagal', description: e.response?.data?.detail || e.message, variant: 'destructive' });
      return false;
    }
  };

  const canAdd = ['super_admin', 'admin_pusat'].includes(current?.role);
  const canDelete = current?.role === 'super_admin';

  const stats = ROLE_OPTIONS.map(r => ({
    role: r.value, label: r.label,
    icon: roleIcons[r.value], count: items.filter(u => u.role === r.value).length,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-5 gap-4">
        {stats.map(s => (
          <div key={s.role} className="bg-white rounded-2xl p-5 card-shadow card-hover">
            <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center mb-3"><s.icon className="w-5 h-5 text-orange-600" /></div>
            <p className="text-sm font-semibold text-gray-500">{s.label}</p>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{s.count}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 card-shadow">
        <div className="flex justify-between mb-5">
          <h3 className="text-xl font-extrabold">Daftar Pengguna Sistem</h3>
          {canAdd && (
            <Button onClick={() => { setEditData(null); setDialogOpen(true); }} className="bg-orange-500 hover:bg-orange-600 gap-2 font-bold">
              <Plus className="w-4 h-4" /> Tambah Pengguna
            </Button>
          )}
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-orange-50/50">
              <TableHead className="font-extrabold">Pengguna</TableHead>
              <TableHead className="font-extrabold">Username</TableHead>
              <TableHead className="font-extrabold">Role</TableHead>
              <TableHead className="font-extrabold">Wilayah Kerja</TableHead>
              <TableHead className="font-extrabold">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-400 font-semibold">Memuat...</TableCell></TableRow>
            : items.map(u => {
              const Icon = roleIcons[u.role] || UserCog;
              return (
                <TableRow key={u.id} className="hover:bg-orange-50/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-extrabold text-sm">
                        {u.name?.split(' ')[0]?.charAt(0)}{u.name?.split(' ')[1]?.charAt(0) || ''}
                      </div>
                      <span className="font-bold">{u.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{u.username}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-100 text-orange-700 text-xs font-bold">
                      <Icon className="w-3.5 h-3.5" /> {u.roleLabel || u.role}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-gray-600">
                    {u.kecamatan_kerja || <span className="text-gray-300">- semua -</span>}
                    {u.desa_kerja && ` / ${u.desa_kerja}`}
                    {u.tps_kerja && ` / ${u.tps_kerja}`}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {canAdd && <button onClick={() => { setEditData({ ...u, password: '' }); setDialogOpen(true); }} className="p-1.5 rounded-lg hover:bg-orange-50 text-gray-500 hover:text-orange-600"><Edit className="w-4 h-4" /></button>}
                      {canDelete && u.username !== current?.username && <button onClick={() => setConfirmDel(u)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <EntityFormDialog
        open={dialogOpen} onOpenChange={setDialogOpen}
        title={editData ? `Edit Pengguna: ${editData.name}` : 'Tambah Pengguna Baru'}
        description={editData ? 'Kosongkan password bila tidak ingin mengubahnya.' : 'Password baru wajib diisi (minimal 6 karakter).'}
        fields={editData ? USER_FIELDS.map(f => f.name === 'password' ? {...f, required: false, label: 'Password Baru (opsional)'} : f) : USER_FIELDS}
        initialData={editData} onSubmit={handleSubmit}
      />
      <ConfirmDialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}
        title="Hapus Pengguna?" description={`Pengguna "${confirmDel?.name}" akan dihapus permanen.`}
        onConfirm={async () => { try { await usersApi.remove(confirmDel.id); toast({title:'Pengguna dihapus'}); load(); } catch(e) { toast({title:'Gagal', description: e.response?.data?.detail, variant:'destructive'}); } }}
      />
    </div>
  );
};

// ============ PENGATURAN with Change Password ============
export const Pengaturan = () => {
  const { user } = useAuth();
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [changing, setChanging] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleChangePw = async (e) => {
    e.preventDefault();
    if (newPw !== confirmPw) return toast({ title: 'Password konfirmasi tidak cocok', variant: 'destructive' });
    if (newPw.length < 6) return toast({ title: 'Password minimal 6 karakter', variant: 'destructive' });
    setChanging(true);
    try {
      await passwordApi.change(oldPw, newPw);
      toast({ title: 'Password berhasil diubah', description: 'Gunakan password baru untuk login berikutnya' });
      setOldPw(''); setNewPw(''); setConfirmPw('');
    } catch (e) {
      toast({ title: 'Gagal ubah password', description: e.response?.data?.detail || e.message, variant: 'destructive' });
    } finally { setChanging(false); }
  };

  const handleResetDemo = async () => {
    try {
      const res = await adminApi.resetDemo();
      const c = res.data.deleted;
      toast({ title: 'Data demo terhapus', description: `${c.simpatisan || 0} simpatisan, ${c.kader || 0} kader, ${c.saksi || 0} saksi, ${c.wilayah_target || 0} target wilayah` });
    } catch (e) {
      toast({ title: 'Gagal', description: e.response?.data?.detail || e.message, variant: 'destructive' });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Change Password */}
        <div className="bg-white rounded-2xl p-6 card-shadow">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center"><KeyRound className="w-5 h-5 text-orange-600" /></div>
            <div>
              <h3 className="text-lg font-extrabold">Ubah Password</h3>
              <p className="text-xs text-gray-500 font-medium">Amankan akun Anda dengan mengubah password default</p>
            </div>
          </div>
          <form onSubmit={handleChangePw} className="space-y-4 max-w-md">
            <div>
              <Label className="font-semibold text-sm mb-1.5 block">Password Lama</Label>
              <div className="relative">
                <Input type={showOld ? 'text' : 'password'} value={oldPw} onChange={e => setOldPw(e.target.value)} required className="h-11 pr-10" />
                <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
              </div>
            </div>
            <div>
              <Label className="font-semibold text-sm mb-1.5 block">Password Baru</Label>
              <div className="relative">
                <Input type={showNew ? 'text' : 'password'} value={newPw} onChange={e => setNewPw(e.target.value)} required minLength={6} className="h-11 pr-10" />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
              </div>
              <p className="text-[10px] text-gray-500 font-semibold mt-1">Minimal 6 karakter. Kombinasi huruf & angka disarankan.</p>
            </div>
            <div>
              <Label className="font-semibold text-sm mb-1.5 block">Konfirmasi Password Baru</Label>
              <Input type={showNew ? 'text' : 'password'} value={confirmPw} onChange={e => setConfirmPw(e.target.value)} required className="h-11" />
            </div>
            <Button type="submit" disabled={changing} className="h-11 bg-orange-500 hover:bg-orange-600 gap-2 font-bold">
              {changing ? 'Menyimpan...' : <><Save className="w-4 h-4" /> Ubah Password</>}
            </Button>
          </form>
        </div>

        {/* Reset demo data (super admin only) */}
        {user?.role === 'super_admin' && (
          <div className="bg-white rounded-2xl p-6 card-shadow border-2 border-red-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-red-600" /></div>
              <div>
                <h3 className="text-lg font-extrabold text-red-900">Siapkan untuk Publikasi</h3>
                <p className="text-xs text-red-700 font-medium">Hapus semua data demo (Simpatisan, Kader, Saksi, Target). Data pengguna tidak dihapus.</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-800 mb-4">
              <p className="flex items-start gap-2">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Setelah reset: (1) semua data simpatisan/kader/saksi kosong, (2) target/baseline per kecamatan kosong, (3) pengguna sistem tetap ada. Data tidak dapat dikembalikan!</span>
              </p>
            </div>
            {!confirmReset ? (
              <Button onClick={() => setConfirmReset(true)} variant="outline" className="border-red-300 text-red-700 hover:bg-red-50 gap-2 font-bold">
                <Trash className="w-4 h-4" /> Reset Semua Data Demo
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={async () => { await handleResetDemo(); setConfirmReset(false); }} className="bg-red-500 hover:bg-red-600 gap-2 font-bold">
                  <Trash className="w-4 h-4" /> Ya, Hapus Semua!
                </Button>
                <Button variant="outline" onClick={() => setConfirmReset(false)} className="font-bold">Batal</Button>
              </div>
            )}
          </div>
        )}

        {/* Info organization */}
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
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 card-shadow">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center"><Bell className="w-5 h-5 text-orange-600" /></div>
            <h3 className="text-lg font-extrabold">Notifikasi</h3>
          </div>
          <div className="space-y-3">
            {[
              { l: 'Simpatisan Baru', d: 'Notif setiap simpatisan baru terdaftar' },
              { l: 'Kegiatan', d: 'Reminder H-1 sebelum kegiatan' },
              { l: 'Progress Suara', d: 'Update harian progress suara' },
              { l: 'Quick Count', d: 'Update real-time saat pemilu' },
            ].map(n => (
              <div key={n.l} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                <div>
                  <p className="font-bold text-xs">{n.l}</p>
                  <p className="text-[10px] text-gray-500 font-medium">{n.d}</p>
                </div>
                <Switch defaultChecked />
              </div>
            ))}
          </div>
        </div>

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
      </div>
    </div>
  );
};
