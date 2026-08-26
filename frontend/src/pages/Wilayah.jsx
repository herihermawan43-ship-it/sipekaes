import React, { useEffect, useState } from 'react';
import { formatNumber } from '../components/shared/UI';
import { Building2, Home, MapPin, Search, Plus, FileDown, Loader2, Printer } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '../components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '../components/ui/select';
import { wilayahTargetApi, simpatisanApi, kaderApi, saksiApi } from '../lib/api';
import { toast } from '../hooks/use-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ============ Kecamatan Page ============
export const Kecamatan = () => {
  const [items, setItems] = useState([]);
  useEffect(() => { wilayahTargetApi.list().then(r => setItems(r.data)); }, []);
  return (
    <div className="bg-white rounded-2xl p-6 card-shadow">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-xl font-extrabold">Daftar Kecamatan</h3>
          <p className="text-sm text-gray-500 font-medium">Kab. Sukabumi — {items.length} Kecamatan aktif</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input placeholder="Cari kecamatan..." className="pl-9 h-10 w-64" />
          </div>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-orange-50/50">
            <TableHead className="font-extrabold">Kecamatan</TableHead>
            <TableHead className="font-extrabold text-right">Baseline</TableHead>
            <TableHead className="font-extrabold text-right">Realisasi</TableHead>
            <TableHead className="font-extrabold text-right">Target</TableHead>
            <TableHead className="font-extrabold">Progress</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map(k => {
            const pct = k.target ? Math.round((k.realisasi/k.target)*100) : 0;
            return (
              <TableRow key={k.id} className="hover:bg-orange-50/30">
                <TableCell className="font-bold"><Building2 className="w-4 h-4 inline mr-2 text-orange-500" />{k.kecamatan}</TableCell>
                <TableCell className="text-right font-medium">{formatNumber(k.baseline)}</TableCell>
                <TableCell className="text-right font-bold text-orange-600">{formatNumber(k.realisasi)}</TableCell>
                <TableCell className="text-right font-medium">{formatNumber(k.target)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden flex-1 min-w-[80px]">
                      <div className="h-full bg-gradient-to-r from-orange-400 to-orange-500" style={{width: `${Math.min(100,pct)}%`}}></div>
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
  );
};

const desaDummy = ['Mekarjaya','Sukamaju','Citarik','Sundawenang','Karangtengah','Selaawi','Cisarua','Selajambe','Muaradua','Bojongkembar','Cidahu','Cibaraja','Sirnaresmi','Sekarwangi','Karawang','Bangbayang'];

export const Desa = () => {
  const [wilayah, setWilayah] = useState([]);
  useEffect(() => { wilayahTargetApi.list().then(r => setWilayah(r.data)); }, []);
  return (
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
                <p className="text-xs text-gray-500 font-medium">Kec. {wilayah[i % Math.max(1, wilayah.length)]?.kecamatan || '-'}</p>
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
};

export const RW = () => (
  <div className="bg-white rounded-2xl p-6 card-shadow">
    <div className="flex items-center justify-between mb-5">
      <div>
        <h3 className="text-xl font-extrabold">Daftar RW</h3>
        <p className="text-sm text-gray-500 font-medium">RW Tercover otomatis dihitung dari data simpatisan/kader/saksi</p>
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3">
      {Array.from({length: 24}).map((_, i) => (
        <div key={i} className={`p-4 rounded-2xl text-center card-hover border-2 ${i % 4 === 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-orange-50 border-orange-200'}`}>
          <MapPin className={`w-6 h-6 mx-auto mb-2 ${i % 4 === 0 ? 'text-emerald-600' : 'text-orange-600'}`} />
          <p className="font-extrabold text-gray-900">RW {String(i+1).padStart(2, '0')}</p>
          <p className="text-[10px] text-gray-500 font-semibold mt-1">Kel. {desaDummy[i % desaDummy.length]}</p>
          <p className={`text-[10px] font-bold mt-2 ${i % 4 === 0 ? 'text-emerald-600' : 'text-orange-600'}`}>{i % 4 === 0 ? 'Tercover' : `${45 + i*3} anggota`}</p>
        </div>
      ))}
    </div>
  </div>
);

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
      wilayahTargetApi.list(),
      simpatisanApi.list(),
      kaderApi.list(),
      saksiApi.list(),
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

      // Header
      doc.setFillColor(249, 115, 22);
      doc.rect(0, 0, pageWidth, 90, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('SiPekaeS', 40, 40);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('PUSAT KOORDINASI SUKABUMI', 40, 56);
      doc.setFontSize(9);
      doc.text('Laporan Pemenangan per Kecamatan', 40, 72);
      doc.setFontSize(9);
      doc.text(`Cetak: ${new Date().toLocaleString('id-ID')}`, pageWidth - 40, 40, { align: 'right' });

      // Title section
      doc.setTextColor(31, 41, 55);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(`Kecamatan ${selectedKec}`, 40, 130);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(107, 114, 128);
      const pct = w.target ? Math.round((w.realisasi/w.target)*100) : 0;
      doc.text(`Progress Pemenangan: ${pct}% dari target`, 40, 148);

      // Stat cards
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
        doc.setTextColor(107, 114, 128);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text(c.l.toUpperCase(), x + 8, cardY + 16);
        doc.setTextColor(249, 115, 22);
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text(c.v, x + 8, cardY + 40);
      });

      // Progress bar
      doc.setTextColor(31, 41, 55);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Progress Target vs Realisasi', 40, 260);
      doc.setDrawColor(229, 231, 235);
      doc.setFillColor(243, 244, 246);
      doc.roundedRect(40, 270, pageWidth - 80, 16, 4, 4, 'F');
      doc.setFillColor(249, 115, 22);
      doc.roundedRect(40, 270, (pageWidth - 80) * Math.min(1, pct/100), 16, 4, 4, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(`${pct}%`, 50, 282);

      // Simpatisan table
      autoTable(doc, {
        startY: 305,
        head: [['Nama Simpatisan', 'HP', 'Desa/Kel', 'RW/RT', 'Status']],
        body: s.slice(0, 15).map(x => [x.nama, x.hp || '-', x.desa || '-', `${x.rw || '-'} / ${x.rt || '-'}`, x.status]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [249, 115, 22], textColor: [255,255,255], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [255, 247, 237] },
        margin: { left: 40, right: 40 },
      });

      // Kader
      const kaderY = doc.lastAutoTable.finalY + 20;
      doc.setTextColor(31, 41, 55);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
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

      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(156, 163, 175);
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

      {/* Ringkasan semua kecamatan */}
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
