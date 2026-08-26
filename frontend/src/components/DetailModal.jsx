import React from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from './ui/dialog';
import { Button } from './ui/button';
import {
  MessageCircle, Phone, MapPin, User, Hash, Home, Building, ShieldCheck,
  Crown, GraduationCap, Users2, Building2, Copy
} from 'lucide-react';
import { Badge } from './ui/badge';
import { toast } from '../hooks/use-toast';

const normalizePhone = (hp) => {
  if (!hp) return '';
  let s = String(hp).replace(/\D/g, '');
  if (s.startsWith('0')) s = '62' + s.slice(1);
  else if (!s.startsWith('62')) s = '62' + s;
  return s;
};

const DetailModal = ({ open, onOpenChange, data, entityLabel = 'Data' }) => {
  if (!data) return null;

  const waNumber = normalizePhone(data.hp);
  const waMessage = encodeURIComponent(
    `Assalamu'alaikum ${data.nama},\n\nSaya dari Tim SiPekaeS - Pusat Koordinasi Sukabumi.\nTerima kasih atas dukungan Anda.\n\nSalam hormat.`
  );
  const waLink = waNumber ? `https://wa.me/${waNumber}?text=${waMessage}` : null;

  const copyText = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({ title: `${label} disalin`, description: text });
  };

  const rows = [
    { icon: Hash, label: 'NIK', value: data.nik },
    { icon: Phone, label: 'No. HP', value: data.hp, copyable: true },
    { icon: Building2, label: 'Kecamatan', value: data.kecamatan },
    { icon: Home, label: 'Desa / Kelurahan', value: data.desa },
    { icon: MapPin, label: 'RW / RT', value: [data.rw, data.rt].filter(Boolean).join(' / ') || '-' },
    { icon: MapPin, label: 'Alamat', value: data.alamat, full: true },
    { icon: ShieldCheck, label: 'TPS', value: data.tps },
    { icon: User, label: 'Jabatan', value: data.jabatan },
    { icon: ShieldCheck, label: 'Status', value: data.status, isBadge: true },
  ].filter(r => r.value);

  const keanggotaan = [
    data.is_pengurus_dpc && { icon: Crown, label: 'Pengurus DPC', jabatan: data.jabatan_dpc },
    data.is_pengurus_dpra && { icon: Building, label: 'Pengurus DPRA', jabatan: data.jabatan_dpra },
    data.is_pelopor && { icon: GraduationCap, label: 'Anggota Pelopor', jabatan: data.peran_pelopor },
    data.is_rki && { icon: Users2, label: 'Anggota RKI', jabatan: data.jabatan_rki },
  ].filter(Boolean);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        {/* Header */}
        <div className="sidebar-gradient p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-extrabold">
              {data.nama?.split(' ')[0]?.charAt(0)}{data.nama?.split(' ')[1]?.charAt(0) || ''}
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-2xl font-extrabold text-white">{data.nama}</DialogTitle>
              <DialogDescription className="text-white/90 font-medium">{entityLabel}{data.jabatan ? ` · ${data.jabatan}` : ''}</DialogDescription>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            {rows.map((r, i) => (
              <div key={i} className={`${r.full ? 'col-span-2' : ''} p-3 rounded-xl bg-orange-50/50 border border-orange-100`}>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-orange-700 mb-1">
                  <r.icon className="w-3 h-3" /> {r.label}
                </div>
                <div className="flex items-center justify-between gap-2">
                  {r.isBadge ? (
                    <Badge className={r.value === 'aktif' || r.value === 'terverifikasi' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : 'bg-amber-100 text-amber-700 hover:bg-amber-100'}>{r.value}</Badge>
                  ) : (
                    <p className="text-sm font-bold text-gray-900 break-words">{r.value}</p>
                  )}
                  {r.copyable && (
                    <button onClick={() => copyText(r.value, r.label)} className="p-1 rounded hover:bg-orange-100 text-orange-600 flex-shrink-0">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {keanggotaan.length > 0 && (
            <div className="mt-5">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Keanggotaan Organisasi</p>
              <div className="flex flex-wrap gap-2">
                {keanggotaan.map((k, i) => (
                  <div key={i} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-200">
                    <k.icon className="w-4 h-4 text-orange-700" />
                    <span className="text-xs font-extrabold text-orange-800">{k.label}</span>
                    {k.jabatan && <span className="text-xs font-semibold text-orange-700">— {k.jabatan}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
          {waLink && (
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 font-bold gap-2 shadow-lg shadow-emerald-500/30">
                <MessageCircle className="w-5 h-5" /> Kirim WhatsApp
              </Button>
            </a>
          )}
          {data.hp && (
            <a href={`tel:${data.hp}`} className="flex-1">
              <Button variant="outline" className="w-full h-11 font-bold gap-2">
                <Phone className="w-5 h-5" /> Telepon
              </Button>
            </a>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)} className="h-11 font-bold">Tutup</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetailModal;
