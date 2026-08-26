import React, { useEffect, useState } from 'react';
import { formatNumber } from '../components/shared/UI';
import {
  Building2, Home, MapPin, Search, Plus, FileDown, Loader2, Printer,
  Users, UserCheck, ShieldCheck, Crown, Building, GraduationCap, Users2, ChevronRight, Info
} from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '../components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '../components/ui/select';
import { wilayahTargetApi, simpatisanApi, kaderApi, saksiApi, statsApi } from '../lib/api';
import { toast } from '../hooks/use-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ============ Kecamatan Page (dengan dedup) ============
export const Kecamatan = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    statsApi.kecamatanDetail().then(r => setItems(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = items.filter(k => k.kecamatan?.toLowerCase().includes(search.toLowerCase()));

  const totals = filtered.reduce((a, b) => ({
    kader: a.kader + (b.kader||0),
    saksi: a.saksi + (b.saksi||0),
    simpatisan: a.simpatisan + (b.simpatisan||0),
    total: a.total + (b.total_unik||0),
  }), { kader: 0, saksi: 0, simpatisan: 0, total: 0 });

  return (
    <div className="space-y-6">
      {/* Info banner */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-bold text-orange-900">Anti-Duplikat Otomatis</p>
          <p className="text-xs text-orange-800 font-medium mt-1">
            Jumlah orang dihitung <b>unik</b> berdasarkan NIK / nama+kecamatan. Prioritas:
            <span className="font-bold"> Kader → Saksi → Simpatisan</span>.
            Bila seorang Kader juga terdaftar sebagai Saksi, ia dihitung sekali sebagai Kader saja.
          </p>
        </div>
      </div>

      {/* Ringkasan total */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { l: 'Total Orang Unik', v: totals.total, icon: Users, c: 'orange' },
          { l: 'Kader', v: totals.kader, icon: UserCheck, c: 'amber' },
          { l: 'Saksi (Non-Kader)', v: totals.saksi, icon: ShieldCheck, c: 'emerald' },
          { l: 'Simpatisan (Murni)', v: totals.simpatisan, icon: Users, c: 'blue' },
        ].map(s => (
          <div key={s.l} className="bg-white rounded-2xl p-5 card-shadow card-hover">
            <div className={`w-11 h-11 rounded-xl bg-${s.c}-50 flex items-center justify-center mb-3`}>
              <s.icon className={`w-5 h-5 text-${s.c}-600`} />
            </div>
            <p className="text-sm font-semibold text-gray-500">{s.l}</p>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{formatNumber(s.v)}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 card-shadow">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-xl font-extrabold">Rekap per Kecamatan</h3>
            <p className="text-sm text-gray-500 font-medium">Data unik dengan hirarki Kader &gt; Saksi &gt; Simpatisan</p>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari kecamatan..." className="pl-9 h-10 w-64" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-orange-50/50">
                <TableHead className="font-extrabold">Kecamatan</TableHead>
                <TableHead className="font-extrabold text-right">Kader</TableHead>
                <TableHead className="font-extrabold text-right">Saksi</TableHead>
                <TableHead className="font-extrabold text-right">Simpatisan</TableHead>
                <TableHead className="font-extrabold text-right bg-orange-100">Total Unik</TableHead>
                <TableHead className="font-extrabold text-center">DPC</TableHead>
                <TableHead className="font-extrabold text-center">DPRA</TableHead>
                <TableHead className="font-extrabold text-center">Pelopor</TableHead>
                <TableHead className="font-extrabold text-center">RKI</TableHead>
                <TableHead className="font-extrabold text-right">Realisasi</TableHead>
                <TableHead className="font-extrabold">Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={11} className="text-center py-8 text-gray-400 font-semibold">Memuat...</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={11} className="text-center py-8 text-gray-400 font-semibold">Belum ada data</TableCell></TableRow>
              ) : filtered.map(k => {
                const pct = k.target ? Math.round(((k.realisasi||0)/k.target)*100) : 0;
                return (
                  <TableRow key={k.kecamatan} className="hover:bg-orange-50/30">
                    <TableCell className="font-bold whitespace-nowrap"><Building2 className="w-4 h-4 inline mr-2 text-orange-500" />{k.kecamatan}</TableCell>
                    <TableCell className="text-right font-bold text-amber-600">{formatNumber(k.kader||0)}</TableCell>
                    <TableCell className="text-right font-medium text-emerald-600">{formatNumber(k.saksi||0)}</TableCell>
                    <TableCell className="text-right font-medium text-blue-600">{formatNumber(k.simpatisan||0)}</TableCell>
                    <TableCell className="text-right font-extrabold text-orange-600 bg-orange-50/30">{formatNumber(k.total_unik||0)}</TableCell>
                    <TableCell className="text-center">{k.dpc > 0 ? <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">{k.dpc}</Badge> : <span className="text-gray-300">-</span>}</TableCell>
                    <TableCell className="text-center">{k.dpra > 0 ? <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">{k.dpra}</Badge> : <span className="text-gray-300">-</span>}</TableCell>
                    <TableCell className="text-center">{k.pelopor > 0 ? <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">{k.pelopor}</Badge> : <span className="text-gray-300">-</span>}</TableCell>
                    <TableCell className="text-center">{k.rki > 0 ? <Badge className="bg-red-100 text-red-700 hover:bg-red-100">{k.rki}</Badge> : <span className="text-gray-300">-</span>}</TableCell>
                    <TableCell className="text-right font-bold text-orange-600">{formatNumber(k.realisasi||0)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden flex-1 min-w-[60px]">
                          <div className="h-full bg-gradient-to-r from-orange-400 to-orange-500" style={{width: `${Math.min(100,pct)}%`}}></div>
                        </div>
                        <span className="text-xs font-extrabold text-orange-600 w-8">{pct}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

// ============ DESA / KELURAHAN (list informatif) ============
export const Desa = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterKec, setFilterKec] = useState('all');

  useEffect(() => { statsApi.desaDetail().then(r => setItems(r.data)).finally(() => setLoading(false)); }, []);

  const kecList = [...new Set(items.map(i => i.kecamatan))].filter(Boolean).sort();
  const filtered = items.filter(d =>
    (filterKec === 'all' || d.kecamatan === filterKec) &&
    (d.desa?.toLowerCase().includes(search.toLowerCase()) || d.kecamatan?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {[
          { l: 'Total Desa/Kel Aktif', v: items.length },
          { l: 'Total Kecamatan', v: kecList.length },
          { l: 'Total Kader', v: items.reduce((a,b) => a + (b.kader||0), 0) },
          { l: 'Total Orang Unik', v: items.reduce((a,b) => a + (b.total||0), 0) },
        ].map(s => (
          <div key={s.l} className="bg-white rounded-2xl p-5 card-shadow card-hover">
            <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center mb-3"><Home className="w-5 h-5 text-orange-600" /></div>
            <p className="text-sm font-semibold text-gray-500">{s.l}</p>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{formatNumber(s.v)}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 card-shadow">
        <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
          <div>
            <h3 className="text-xl font-extrabold">Daftar Desa / Kelurahan</h3>
            <p className="text-sm text-gray-500 font-medium">Otomatis terisi dari data Kader/Simpatisan/Saksi (unik)</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari desa..." className="pl-9 h-10 w-56" />
            </div>
            <Select value={filterKec} onValueChange={setFilterKec}>
              <SelectTrigger className="w-56 h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kecamatan</SelectItem>
                {kecList.map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-orange-50/50">
                <TableHead className="font-extrabold">Desa / Kelurahan</TableHead>
                <TableHead className="font-extrabold">Kecamatan</TableHead>
                <TableHead className="font-extrabold text-center">Jumlah RW</TableHead>
                <TableHead className="font-extrabold text-right">Kader</TableHead>
                <TableHead className="font-extrabold text-right">Saksi</TableHead>
                <TableHead className="font-extrabold text-right">Simpatisan</TableHead>
                <TableHead className="font-extrabold text-right bg-orange-100">Total Unik</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-400 font-semibold">Memuat...</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-400 font-semibold">Belum ada desa terisi. Tambahkan data di Kader/Simpatisan/Saksi dulu.</TableCell></TableRow>
              ) : filtered.map(d => (
                <TableRow key={`${d.kecamatan}-${d.desa}`} className="hover:bg-orange-50/30">
                  <TableCell className="font-bold"><Home className="w-4 h-4 inline mr-2 text-orange-500" />{d.desa}</TableCell>
                  <TableCell className="font-semibold">{d.kecamatan}</TableCell>
                  <TableCell className="text-center">
                    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 gap-1"><MapPin className="w-3 h-3" /> {d.rw_count} RW</Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold text-amber-600">{d.kader}</TableCell>
                  <TableCell className="text-right font-medium text-emerald-600">{d.saksi}</TableCell>
                  <TableCell className="text-right font-medium text-blue-600">{d.simpatisan}</TableCell>
                  <TableCell className="text-right font-extrabold text-orange-600 bg-orange-50/30">{d.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

// ============ RW (list informatif) ============
export const RW = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterKec, setFilterKec] = useState('all');

  useEffect(() => { statsApi.rwDetail().then(r => setItems(r.data)).finally(() => setLoading(false)); }, []);

  const kecList = [...new Set(items.map(i => i.kecamatan))].filter(Boolean).sort();
  const filtered = items.filter(r =>
    (filterKec === 'all' || r.kecamatan === filterKec) &&
    (r.rw?.toLowerCase().includes(search.toLowerCase()) ||
     r.desa?.toLowerCase().includes(search.toLowerCase()) ||
     r.kecamatan?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {[
          { l: 'RW Tercover', v: items.length, sub: 'dari ~3.000 RW target' },
          { l: 'Kecamatan Aktif', v: kecList.length },
          { l: 'Total Kader', v: items.reduce((a,b) => a + (b.kader||0), 0) },
          { l: 'Total Orang Unik', v: items.reduce((a,b) => a + (b.total||0), 0) },
        ].map(s => (
          <div key={s.l} className="bg-white rounded-2xl p-5 card-shadow card-hover">
            <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center mb-3"><MapPin className="w-5 h-5 text-orange-600" /></div>
            <p className="text-sm font-semibold text-gray-500">{s.l}</p>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{formatNumber(s.v)}</h3>
            {s.sub && <p className="text-[10px] text-gray-400 font-semibold mt-1">{s.sub}</p>}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 card-shadow">
        <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
          <div>
            <h3 className="text-xl font-extrabold">Daftar RW Tercover</h3>
            <p className="text-sm text-gray-500 font-medium">RW dianggap tercover jika ada minimal 1 Kader/Simpatisan/Saksi terdaftar</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari RW / Desa..." className="pl-9 h-10 w-56" />
            </div>
            <Select value={filterKec} onValueChange={setFilterKec}>
              <SelectTrigger className="w-56 h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kecamatan</SelectItem>
                {kecList.map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-orange-50/50">
                <TableHead className="font-extrabold">RW</TableHead>
                <TableHead className="font-extrabold">Desa / Kel</TableHead>
                <TableHead className="font-extrabold">Kecamatan</TableHead>
                <TableHead className="font-extrabold text-right">Kader</TableHead>
                <TableHead className="font-extrabold text-right">Saksi</TableHead>
                <TableHead className="font-extrabold text-right">Simpatisan</TableHead>
                <TableHead className="font-extrabold text-right bg-orange-100">Total Unik</TableHead>
                <TableHead className="font-extrabold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-gray-400 font-semibold">Memuat...</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-gray-400 font-semibold">Belum ada RW tercover</TableCell></TableRow>
              ) : filtered.map(r => (
                <TableRow key={`${r.kecamatan}-${r.desa}-${r.rw}`} className="hover:bg-orange-50/30">
                  <TableCell><span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-orange-100 text-orange-700 text-xs font-bold"><MapPin className="w-3 h-3" /> {r.rw}</span></TableCell>
                  <TableCell className="font-semibold">{r.desa || '-'}</TableCell>
                  <TableCell className="font-medium">{r.kecamatan}</TableCell>
                  <TableCell className="text-right font-bold text-amber-600">{r.kader}</TableCell>
                  <TableCell className="text-right font-medium text-emerald-600">{r.saksi}</TableCell>
                  <TableCell className="text-right font-medium text-blue-600">{r.simpatisan}</TableCell>
                  <TableCell className="text-right font-extrabold text-orange-600 bg-orange-50/30">{r.total}</TableCell>
                  <TableCell>
                    <Badge className={r.total > 5 ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : r.total >= 2 ? 'bg-amber-100 text-amber-700 hover:bg-amber-100' : 'bg-red-100 text-red-700 hover:bg-red-100'}>
                      {r.total > 5 ? 'Kuat' : r.total >= 2 ? 'Sedang' : 'Lemah'}
                    </Badge>
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

// ============ LAPORAN WILAYAH with PDF ============
export const LaporanWilayah = () => {
  const [wilayah, setWilayah] = useState([]);
  const [simpatisan, setSimpatisan] = useState([]);
  const [kader, setKader] = useState([]);
  const [saksi, setSaksi] = useState([]);
  const [selectedKec, setSelectedKec] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    Promise.all([
      wilayahTargetApi.list(), simpatisanApi.list(), kaderApi.list(), saksiApi.list(),
    ]).then(([w, s, k, sk]) => {
      setWilayah(w.data); setSimpatisan(s.data); setKader(k.data); setSaksi(sk.data);
      if (w.data.length > 0) setSelectedKec(w.data[0].kecamatan);
    });
  }, []);

  const getKecData = (name) => {
    const w = wilayah.find(x => x.kecamatan === name) || { baseline: 0, target: 0, realisasi: 0 };
    const s = simpatisan.filter(x => x.kecamatan === name);
    const k = kader.filter(x => x.kecamatan === name);
    const sk = saksi.filter(x => x.kecamatan === name);
    return { w, s, k, sk };
  };

  const generatePDF = async () => {
    if (!selectedKec) return;
    setGenerating(true);
    try {
      const { w, s, k, sk } = getKecData(selectedKec);
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();

      doc.setFillColor(249, 115, 22);
      doc.rect(0, 0, pageWidth, 90, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22); doc.setFont('helvetica', 'bold');
      doc.text('SiPekaeS', 40, 40);
      doc.setFontSize(10); doc.setFont('helvetica', 'normal');
      doc.text('PUSAT KOORDINASI SUKABUMI', 40, 56);
      doc.setFontSize(9);
      doc.text('Laporan Pemenangan per Kecamatan', 40, 72);
      doc.text(`Cetak: ${new Date().toLocaleString('id-ID')}`, pageWidth - 40, 40, { align: 'right' });

      doc.setTextColor(31, 41, 55); doc.setFontSize(18); doc.setFont('helvetica', 'bold');
      doc.text(`Kecamatan ${selectedKec}`, 40, 130);
      doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(107, 114, 128);
      const pct = w.target ? Math.round((w.realisasi/w.target)*100) : 0;
      doc.text(`Progress Pemenangan: ${pct}% dari target`, 40, 148);

      const cardY = 170;
      const cards = [
        { l: 'Baseline', v: formatNumber(w.baseline) },
        { l: 'Target', v: formatNumber(w.target) },
        { l: 'Realisasi', v: formatNumber(w.realisasi) },
        { l: 'Simpatisan', v: s.length.toString() },
        { l: 'Kader', v: k.length.toString() },
        { l: 'Saksi TPS', v: sk.length.toString() },
      ];
      cards.forEach((c, i) => {
        const cw = (pageWidth - 80 - 25) / 6;
        const x = 40 + i * (cw + 5);
        doc.setFillColor(255, 247, 237);
        doc.roundedRect(x, cardY, cw, 60, 4, 4, 'F');
        doc.setTextColor(107, 114, 128); doc.setFontSize(7); doc.setFont('helvetica', 'bold');
        doc.text(c.l.toUpperCase(), x + 8, cardY + 16);
        doc.setTextColor(249, 115, 22); doc.setFontSize(13);
        doc.text(c.v, x + 8, cardY + 40);
      });

      doc.setTextColor(31, 41, 55); doc.setFontSize(11); doc.setFont('helvetica', 'bold');
      doc.text('Progress Target vs Realisasi', 40, 260);
      doc.setFillColor(243, 244, 246);
      doc.roundedRect(40, 270, pageWidth - 80, 16, 4, 4, 'F');
      doc.setFillColor(249, 115, 22);
      doc.roundedRect(40, 270, (pageWidth - 80) * Math.min(1, pct/100), 16, 4, 4, 'F');
      doc.setTextColor(255, 255, 255); doc.setFontSize(9);
      doc.text(`${pct}%`, 50, 282);

      autoTable(doc, {
        startY: 305,
        head: [['Nama Simpatisan', 'HP', 'Desa/Kel', 'RW/RT', 'Status']],
        body: s.slice(0, 15).map(x => [x.nama, x.hp || '-', x.desa || '-', `${x.rw || '-'} / ${x.rt || '-'}`, x.status]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [249, 115, 22], textColor: [255,255,255], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [255, 247, 237] },
        margin: { left: 40, right: 40 },
      });

      const kaderY = doc.lastAutoTable.finalY + 20;
      doc.setTextColor(31, 41, 55); doc.setFontSize(11); doc.setFont('helvetica', 'bold');
      doc.text(`Daftar Kader (${k.length})`, 40, kaderY);
      autoTable(doc, {
        startY: kaderY + 5,
        head: [['Nama Kader', 'Jabatan', 'HP', 'Desa/Kel']],
        body: k.slice(0, 15).map(x => [x.nama, x.jabatan, x.hp || '-', x.desa || '-']),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [249, 115, 22], textColor: [255,255,255], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [255, 247, 237] },
        margin: { left: 40, right: 40 },
      });

      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8); doc.setTextColor(156, 163, 175);
        doc.text(`SiPekaeS - Halaman ${i} dari ${pageCount}`, pageWidth - 40, doc.internal.pageSize.getHeight() - 20, { align: 'right' });
        doc.text('© 2025 SiPekaeS. Konfidensial - Internal Tim Pemenangan.', 40, doc.internal.pageSize.getHeight() - 20);
      }

      doc.save(`Laporan_${selectedKec}_${new Date().toISOString().slice(0,10)}.pdf`);
      toast({ title: 'Laporan PDF berhasil dibuat', description: `Laporan ${selectedKec} sedang diunduh` });
    } catch (e) {
      console.error(e);
      toast({ title: 'Gagal membuat PDF', description: e.message, variant: 'destructive' });
    } finally { setGenerating(false); }
  };

  const { w, s, k, sk } = selectedKec ? getKecData(selectedKec) : { w:{baseline:0,target:0,realisasi:0}, s:[], k:[], sk:[] };
  const pct = w.target ? Math.round((w.realisasi/w.target)*100) : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 card-shadow">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-4">
          <div>
            <h3 className="text-xl font-extrabold">Cetak Laporan Wilayah</h3>
            <p className="text-sm text-gray-500 font-medium">Pilih kecamatan, lalu klik Cetak PDF untuk laporan siap kirim ke Ketua Tim</p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedKec} onValueChange={setSelectedKec}>
              <SelectTrigger className="w-64 h-11"><SelectValue placeholder="Pilih kecamatan" /></SelectTrigger>
              <SelectContent>
                {wilayah.map(w => <SelectItem key={w.id} value={w.kecamatan}>{w.kecamatan}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button onClick={generatePDF} disabled={generating || !selectedKec} className="h-11 bg-orange-500 hover:bg-orange-600 gap-2 font-bold">
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
              Cetak PDF
            </Button>
          </div>
        </div>

        {selectedKec && (
          <div className="grid grid-cols-6 gap-3 mb-5">
            {[
              { l: 'Baseline', v: formatNumber(w.baseline) },
              { l: 'Target', v: formatNumber(w.target) },
              { l: 'Realisasi', v: formatNumber(w.realisasi), c: 'text-orange-600' },
              { l: 'Simpatisan', v: s.length },
              { l: 'Kader', v: k.length },
              { l: 'Saksi TPS', v: sk.length },
            ].map(x => (
              <div key={x.l} className="p-4 rounded-xl bg-orange-50 border border-orange-100">
                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">{x.l}</p>
                <p className={`text-xl font-extrabold mt-1 ${x.c || 'text-gray-900'}`}>{x.v}</p>
              </div>
            ))}
          </div>
        )}
        {selectedKec && (
          <div>
            <div className="flex justify-between text-sm mb-1"><span className="font-bold">Progress {selectedKec}</span><span className="font-extrabold text-orange-600">{pct}%</span></div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-orange-400 to-orange-500" style={{width: `${Math.min(100,pct)}%`}}></div></div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 card-shadow">
        <h3 className="text-xl font-extrabold mb-5">Ringkasan Semua Kecamatan</h3>
        <div className="space-y-3">
          {wilayah.map(kec => {
            const p = kec.target ? Math.round((kec.realisasi/kec.target)*100) : 0;
            return (
              <div key={kec.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-orange-300 card-hover">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-bold">{kec.kecamatan}</p>
                    <p className="text-xs text-gray-500 font-medium">Realisasi {formatNumber(kec.realisasi)} dari {formatNumber(kec.target)} ({p}%)</p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => { setSelectedKec(kec.kecamatan); setTimeout(generatePDF, 200); }} className="font-bold gap-2">
                  <Printer className="w-4 h-4" /> Cetak
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
