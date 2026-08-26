import React from 'react';
import { Network, Users, Building2, Home, MapPin, ChevronRight } from 'lucide-react';

const nodeStyles = {
  root: 'bg-gradient-to-br from-orange-500 to-orange-600 text-white',
  l1: 'bg-orange-100 text-orange-700 border-orange-200',
  l2: 'bg-amber-50 text-amber-700 border-amber-200',
  l3: 'bg-orange-50 text-orange-600 border-orange-100',
};

const Node = ({ label, count, style = 'l1', icon: Icon }) => (
  <div className={`px-5 py-3 rounded-2xl border-2 ${nodeStyles[style]} shadow-sm text-center min-w-[240px]`}>
    <div className="flex items-center justify-center gap-2 mb-1">
      {Icon && <Icon className="w-4 h-4" strokeWidth={2.4} />}
      <p className="text-xs font-extrabold tracking-wide uppercase">{label}</p>
    </div>
    <p className="text-2xl font-extrabold">{count}</p>
  </div>
);

const StrukturJaringan = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-4 gap-4">
      {[
        { l: 'Kecamatan', v: '47', icon: Building2 },
        { l: 'Desa / Kelurahan', v: '381', icon: Home },
        { l: 'RW Aktif', v: '2.340', icon: MapPin },
        { l: 'Total Relawan', v: '41.708', icon: Users },
      ].map(s => (
        <div key={s.l} className="bg-white rounded-2xl p-5 card-shadow card-hover">
          <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center mb-3">
            <s.icon className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-sm font-semibold text-gray-500">{s.l}</p>
          <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{s.v}</h3>
        </div>
      ))}
    </div>

    <div className="bg-white rounded-2xl p-8 card-shadow">
      <h3 className="text-xl font-extrabold mb-2">Hierarki Jaringan Pemenangan</h3>
      <p className="text-sm text-gray-500 font-medium mb-8">Struktur organisasi Kabupaten Sukabumi</p>

      <div className="flex flex-col items-center gap-4">
        <Node label="KABUPATEN SUKABUMI" count="1 DPC" style="root" icon={Network} />
        <div className="w-px h-6 bg-orange-300"></div>
        <Node label="KECAMATAN" count="47" icon={Building2} />
        <div className="w-px h-6 bg-orange-300"></div>
        <Node label="DESA / KELURAHAN" count="381" style="l2" icon={Home} />
        <div className="w-px h-6 bg-orange-300"></div>
        <Node label="RW" count="±3.000" style="l3" icon={MapPin} />
        <div className="w-px h-6 bg-orange-300"></div>
        <div className="grid grid-cols-6 gap-3">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white shadow-md">
              <Users className="w-6 h-6" />
            </div>
          ))}
        </div>
        <p className="text-sm font-bold text-gray-600 mt-2">KOORDINATOR / TIM RW</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-8 border-t border-gray-100">
        {[
          { l: 'Ketua DPC', v: 1 }, { l: 'Sekretaris', v: 1 },
          { l: 'Bendahara', v: 1 }, { l: 'Koord. Kecamatan', v: 47 },
          { l: 'Koord. Desa/Kel', v: 381 }, { l: 'Koord. RW', v: 2340 },
          { l: 'Kader Aktif', v: 8754 }, { l: 'Total Relawan', v: 41708 },
        ].map(s => (
          <div key={s.l} className="flex items-center justify-between p-3 rounded-xl bg-orange-50/50 border border-orange-100">
            <span className="text-sm font-semibold text-gray-600">{s.l}</span>
            <span className="text-lg font-extrabold text-orange-600">{new Intl.NumberFormat('id-ID').format(s.v)}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default StrukturJaringan;
