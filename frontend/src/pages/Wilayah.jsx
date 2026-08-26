import React from 'react';
import { KECAMATAN_LIST } from '../mock/mockData';
import { formatNumber } from '../components/shared/UI';
import { Building2, Home, MapPin, Search, Plus } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '../components/ui/table';

export const Kecamatan = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-2xl p-6 card-shadow">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-xl font-extrabold">Daftar Kecamatan</h3>
          <p className="text-sm text-gray-500 font-medium">Kab. Sukabumi — 47 Kecamatan</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input placeholder="Cari kecamatan..." className="pl-9 h-10 w-64" />
          </div>
          <Button className="bg-orange-500 hover:bg-orange-600 gap-2 font-bold"><Plus className="w-4 h-4" /> Tambah</Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-orange-50/50">
            <TableHead className="font-extrabold">Kecamatan</TableHead>
            <TableHead className="font-extrabold text-right">Simpatisan</TableHead>
            <TableHead className="font-extrabold text-right">Kader</TableHead>
            <TableHead className="font-extrabold text-right">Saksi</TableHead>
            <TableHead className="font-extrabold text-right">Baseline</TableHead>
            <TableHead className="font-extrabold text-right">Realisasi</TableHead>
            <TableHead className="font-extrabold text-right">Target</TableHead>
            <TableHead className="font-extrabold">Progress</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {KECAMATAN_LIST.map(k => {
            const pct = Math.round((k.realisasi/k.target)*100);
            return (
              <TableRow key={k.name} className="hover:bg-orange-50/30">
                <TableCell className="font-bold"><Building2 className="w-4 h-4 inline mr-2 text-orange-500" />{k.name}</TableCell>
                <TableCell className="text-right font-medium">{formatNumber(k.simpatisan)}</TableCell>
                <TableCell className="text-right font-medium">{formatNumber(k.kader)}</TableCell>
                <TableCell className="text-right font-medium">{formatNumber(k.saksi)}</TableCell>
                <TableCell className="text-right font-medium">{formatNumber(k.baseline)}</TableCell>
                <TableCell className="text-right font-bold text-orange-600">{formatNumber(k.realisasi)}</TableCell>
                <TableCell className="text-right font-medium">{formatNumber(k.target)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden flex-1 min-w-[80px]">
                      <div className="h-full bg-gradient-to-r from-orange-400 to-orange-500" style={{width: `${pct}%`}}></div>
                    </div>
                    <span className="text-xs font-extrabold text-orange-600">{pct}%</span>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  </div>
);

const desaDummy = ['Mekarjaya','Sukamaju','Citarik','Sundawenang','Karangtengah','Selaawi','Cisarua','Selajambe','Muaradua','Bojongkembar','Cidahu','Cibaraja','Sirnaresmi','Sekarwangi','Karawang','Bangbayang'];

export const Desa = () => (
  <div className="bg-white rounded-2xl p-6 card-shadow">
    <div className="flex items-center justify-between mb-5">
      <div>
        <h3 className="text-xl font-extrabold">Daftar Desa / Kelurahan</h3>
        <p className="text-sm text-gray-500 font-medium">381 Desa/Kelurahan di 47 Kecamatan</p>
      </div>
      <Button className="bg-orange-500 hover:bg-orange-600 gap-2 font-bold"><Plus className="w-4 h-4" /> Tambah Desa</Button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {desaDummy.map((d, i) => (
        <div key={d} className="p-4 border border-gray-100 rounded-2xl hover:border-orange-300 card-hover">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center">
              <Home className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="font-extrabold text-gray-900">{d}</p>
              <p className="text-xs text-gray-500 font-medium">Kec. {KECAMATAN_LIST[i % KECAMATAN_LIST.length].name}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3 text-center">
            <div className="p-2 rounded-lg bg-orange-50"><p className="text-[10px] font-semibold text-gray-500">RW</p><p className="font-extrabold text-orange-600">{8 + i}</p></div>
            <div className="p-2 rounded-lg bg-amber-50"><p className="text-[10px] font-semibold text-gray-500">Kader</p><p className="font-extrabold text-amber-600">{45 + i*3}</p></div>
            <div className="p-2 rounded-lg bg-emerald-50"><p className="text-[10px] font-semibold text-gray-500">Simpatisan</p><p className="font-extrabold text-emerald-600">{300 + i*15}</p></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const RW = () => (
  <div className="bg-white rounded-2xl p-6 card-shadow">
    <div className="flex items-center justify-between mb-5">
      <div>
        <h3 className="text-xl font-extrabold">Daftar RW</h3>
        <p className="text-sm text-gray-500 font-medium">±3.000 RW — 2.340 Tercover (78%)</p>
      </div>
      <Button className="bg-orange-500 hover:bg-orange-600 gap-2 font-bold"><Plus className="w-4 h-4" /> Tambah RW</Button>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3">
      {Array.from({length: 24}).map((_, i) => (
        <div key={i} className={`p-4 rounded-2xl text-center card-hover border-2 ${i % 4 === 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-orange-50 border-orange-200'}`}>
          <MapPin className={`w-6 h-6 mx-auto mb-2 ${i % 4 === 0 ? 'text-emerald-600' : 'text-orange-600'}`} />
          <p className="font-extrabold text-gray-900">RW {String(i+1).padStart(2, '0')}</p>
          <p className="text-[10px] text-gray-500 font-semibold mt-1">Kel. {desaDummy[i % desaDummy.length]}</p>
          <p className={`text-[10px] font-bold mt-2 ${i % 4 === 0 ? 'text-emerald-600' : 'text-orange-600'}`}>{i % 4 === 0 ? 'Tercover' : `${45 + i*3} simpatisan`}</p>
        </div>
      ))}
    </div>
  </div>
);

export const LaporanWilayah = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-3 gap-4">
      {[
        { l: 'Laporan Kecamatan', v: '47', d: 'Semua kecamatan terlapor' },
        { l: 'Laporan Desa', v: '381', d: 'Semua desa aktif' },
        { l: 'Laporan RW', v: '2.340', d: '78% coverage RW' },
      ].map(s => (
        <div key={s.l} className="bg-white rounded-2xl p-6 card-shadow card-hover">
          <p className="text-sm font-semibold text-gray-500">{s.l}</p>
          <h3 className="text-3xl font-extrabold text-orange-600 mt-2">{s.v}</h3>
          <p className="text-xs text-gray-500 font-medium mt-2">{s.d}</p>
        </div>
      ))}
    </div>

    <div className="bg-white rounded-2xl p-6 card-shadow">
      <h3 className="text-xl font-extrabold mb-5">Ringkasan Laporan Terbaru</h3>
      <div className="space-y-3">
        {KECAMATAN_LIST.slice(0, 6).map(k => (
          <div key={k.name} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-orange-300 card-hover">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="font-bold">{k.name}</p>
                <p className="text-xs text-gray-500 font-medium">Simpatisan {formatNumber(k.simpatisan)} · Realisasi {formatNumber(k.realisasi)}</p>
              </div>
            </div>
            <Button variant="outline" className="font-bold">Lihat Laporan</Button>
          </div>
        ))}
      </div>
    </div>
  </div>
);
