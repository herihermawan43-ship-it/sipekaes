import React, { useState, useEffect } from 'react';
import { Search, Crown, Building, GraduationCap, Users2, Phone, MapPin, Eye, MessageCircle, Info, ExternalLink } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { organisasiApi } from '../lib/api';
import { toast } from '../hooks/use-toast';
import DetailModal from '../components/DetailModal';
import { Link } from 'react-router-dom';

const SOURCE_ROUTE = { simpatisan: '/simpatisan', kader: '/kader', saksi: '/saksi' };
const SOURCE_COLOR = { simpatisan: 'bg-blue-100 text-blue-700', kader: 'bg-orange-100 text-orange-700', saksi: 'bg-purple-100 text-purple-700' };

const normalizeWa = (hp) => { if (!hp) return ''; let s = String(hp).replace(/\D/g,''); if (s.startsWith('0')) s = '62' + s.slice(1); else if (!s.startsWith('62')) s = '62' + s; return s; };

const AggregatedOrgPage = ({ jenis, entityLabel, iconGradient, headerIcon: Icon, description }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    setLoading(true);
    organisasiApi.list(jenis)
      .then(r => setItems(r.data))
      .catch(e => toast({ title: 'Gagal memuat data', description: e.message, variant: 'destructive' }))
      .finally(() => setLoading(false));
  }, [jenis]);

  const filtered = items.filter(k =>
    (k.nama || '').toLowerCase().includes(search.toLowerCase()) ||
    (k.jabatan_organisasi || '').toLowerCase().includes(search.toLowerCase()) ||
    (k.kecamatan || '').toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { l: `Total ${entityLabel}`, v: items.length },
    { l: 'Dari Kader', v: items.filter(i => i.source_type === 'kader').length },
    { l: 'Dari Simpatisan', v: items.filter(i => i.source_type === 'simpatisan').length },
    { l: 'Dari Saksi', v: items.filter(i => i.source_type === 'saksi').length },
  ];

  return (
    <div className="space-y-6">
      {/* Info banner */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-sm text-orange-900">{description}</p>
          <p className="text-xs text-orange-800 font-medium mt-1">
            Data disini adalah <b>view agregat</b> dari Simpatisan/Kader/Saksi yang dicentang sebagai {entityLabel}.
            Untuk tambah/ubah data, buka halaman Simpatisan/Kader/Saksi dan centang "Termasuk {entityLabel}" pada form.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.l} className="bg-white rounded-2xl p-5 card-shadow card-hover">
            <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center mb-3"><Icon className="w-5 h-5 text-orange-600" /></div>
            <p className="text-sm font-semibold text-gray-500">{s.l}</p>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{s.v}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 card-shadow">
        <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
          <h3 className="text-lg font-extrabold">Daftar {entityLabel}</h3>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Cari ${entityLabel.toLowerCase()}...`} className="pl-9 h-10 w-64" />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400 font-semibold">Memuat data...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400 font-semibold">
            Belum ada {entityLabel}. Centang "Termasuk {entityLabel}" saat menambah Simpatisan/Kader/Saksi.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(k => (
              <div key={`${k.source_type}-${k.id}`} className="border border-gray-100 rounded-2xl p-4 hover:border-orange-300 card-hover">
                <div className="flex items-start gap-3">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${iconGradient} flex items-center justify-center text-white font-extrabold text-lg`}>
                    {k.nama?.split(' ')[0]?.charAt(0)}{k.nama?.split(' ')[1]?.charAt(0) || ''}
                  </div>
                  <div className="flex-1 min-w-0">
                    <button onClick={() => setDetail(k)} className="font-extrabold text-gray-900 truncate text-left hover:text-orange-600">{k.nama}</button>
                    {k.jabatan_organisasi && <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 mt-1">{k.jabatan_organisasi}</Badge>}
                  </div>
                </div>
                <div className="mt-3 space-y-1 text-xs font-semibold text-gray-600">
                  <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-orange-500" />{k.kecamatan}{k.desa && `, ${k.desa}`}</p>
                  {k.hp && <p className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-orange-500" />{k.hp}</p>}
                  <p className="flex items-center gap-1.5 mt-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${SOURCE_COLOR[k.source_type]}`}>
                      <ExternalLink className="w-3 h-3" /> Sumber: {k.source_label}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  <button onClick={() => setDetail(k)} className="flex-1 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-50 rounded-lg flex items-center justify-center gap-1"><Eye className="w-3.5 h-3.5" /> Detail</button>
                  {k.hp && <a href={`https://wa.me/${normalizeWa(k.hp)}`} target="_blank" rel="noopener noreferrer" className="flex-1 py-1.5 text-xs font-bold text-emerald-600 hover:bg-emerald-50 rounded-lg flex items-center justify-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> WA</a>}
                  <Link to={SOURCE_ROUTE[k.source_type]} className="flex-1 py-1.5 text-xs font-bold text-orange-600 hover:bg-orange-50 rounded-lg flex items-center justify-center gap-1"><ExternalLink className="w-3.5 h-3.5" /> Ke {k.source_label}</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <DetailModal open={!!detail} onOpenChange={(o) => !o && setDetail(null)} data={detail} entityLabel={`${entityLabel} (${detail?.source_label || ''})`} />
    </div>
  );
};

export const PengurusDPC = () => (
  <AggregatedOrgPage jenis="dpc" entityLabel="Pengurus DPC" headerIcon={Crown} iconGradient="from-orange-500 to-red-500"
    description="Pengurus Dewan Pimpinan Cabang (tingkat Kabupaten)" />
);
export const PengurusDPRA = () => (
  <AggregatedOrgPage jenis="dpra" entityLabel="Pengurus DPRA" headerIcon={Building} iconGradient="from-amber-400 to-orange-500"
    description="Pengurus Dewan Pimpinan Ranting (tingkat Desa/Kelurahan)" />
);
export const AnggotaPelopor = () => (
  <AggregatedOrgPage jenis="pelopor" entityLabel="Anggota Pelopor" headerIcon={GraduationCap} iconGradient="from-orange-400 to-amber-500"
    description="Barisan Pelopor Pemenangan" />
);
export const AnggotaRKI = () => (
  <AggregatedOrgPage jenis="rki" entityLabel="Anggota RKI" headerIcon={Users2} iconGradient="from-red-400 to-orange-500"
    description="Relawan Kader Independen" />
);
