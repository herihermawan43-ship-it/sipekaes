import React from 'react';
import { MapContainer, TileLayer, Circle, CircleMarker, Popup, Tooltip, LayersControl } from 'react-leaflet';
import { KECAMATAN_LIST } from '../mock/mockData';
import { formatNumber } from '../components/shared/UI';
import { Filter, Layers } from 'lucide-react';
import { Button } from '../components/ui/button';

const strengthColor = (pct) => {
  if (pct >= 80) return '#059669';
  if (pct >= 60) return '#84CC16';
  if (pct >= 40) return '#EAB308';
  if (pct >= 20) return '#F97316';
  return '#DC2626';
};

const strengthLabel = (pct) => {
  if (pct >= 80) return 'Sangat Kuat';
  if (pct >= 60) return 'Kuat';
  if (pct >= 40) return 'Sedang';
  if (pct >= 20) return 'Lemah';
  return 'Sangat Lemah';
};

const SebaranPeta = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-5 gap-4">
      {[
        { c: '#059669', l: 'Sangat Kuat', v: KECAMATAN_LIST.filter(k => (k.realisasi/k.target)*100 >= 80).length },
        { c: '#84CC16', l: 'Kuat', v: KECAMATAN_LIST.filter(k => { const p = (k.realisasi/k.target)*100; return p >= 60 && p < 80; }).length },
        { c: '#EAB308', l: 'Sedang', v: KECAMATAN_LIST.filter(k => { const p = (k.realisasi/k.target)*100; return p >= 40 && p < 60; }).length },
        { c: '#F97316', l: 'Lemah', v: KECAMATAN_LIST.filter(k => { const p = (k.realisasi/k.target)*100; return p >= 20 && p < 40; }).length },
        { c: '#DC2626', l: 'Sangat Lemah', v: KECAMATAN_LIST.filter(k => (k.realisasi/k.target)*100 < 20).length },
      ].map(s => (
        <div key={s.l} className="bg-white rounded-2xl p-5 card-shadow card-hover">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: `${s.c}20` }}>
            <span className="w-5 h-5 rounded" style={{ background: s.c }}></span>
          </div>
          <p className="text-sm font-semibold text-gray-500">{s.l}</p>
          <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{s.v} <span className="text-sm font-semibold text-gray-400">kecamatan</span></h3>
        </div>
      ))}
    </div>

    <div className="bg-white rounded-2xl p-6 card-shadow">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-extrabold">Peta Sebaran Kekuatan - Kab. Sukabumi</h3>
          <p className="text-sm text-gray-500 font-medium">Area choropleth menunjukkan zona kekuatan tiap kecamatan. Klik untuk detail.</p>
        </div>
        <Button variant="outline" className="gap-2"><Filter className="w-4 h-4" /> Filter</Button>
      </div>

      <div className="rounded-2xl overflow-hidden relative" style={{ height: 620 }}>
        <MapContainer center={[-6.95, 106.85]} zoom={10} style={{ height: '100%', width: '100%' }}>
          <LayersControl position="topleft">
            <LayersControl.BaseLayer checked name="Peta Standar">
              <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Peta Satelit">
              <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution='&copy; Esri' />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Peta Topografi">
              <TileLayer url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" attribution='&copy; OpenTopoMap' />
            </LayersControl.BaseLayer>
          </LayersControl>

          {/* Choropleth-like coverage circles */}
          {KECAMATAN_LIST.map(k => {
            const pct = Math.round((k.realisasi/k.target)*100);
            return (
              <Circle
                key={`c-${k.name}`}
                center={k.coords}
                radius={5500}
                pathOptions={{ color: strengthColor(pct), fillColor: strengthColor(pct), fillOpacity: 0.35, weight: 1.5 }}
              />
            );
          })}
          {/* Marker labels */}
          {KECAMATAN_LIST.map(k => {
            const pct = Math.round((k.realisasi/k.target)*100);
            return (
              <CircleMarker
                key={k.name}
                center={k.coords}
                radius={9}
                pathOptions={{ color: '#fff', fillColor: strengthColor(pct), fillOpacity: 1, weight: 2 }}
              >
                <Tooltip direction="top" offset={[0, -8]} opacity={1} permanent={false}>
                  <b>{k.name}</b> — {strengthLabel(pct)} ({pct}%)
                </Tooltip>
                <Popup>
                  <div className="font-semibold text-xs min-w-[200px]">
                    <p className="font-extrabold text-sm mb-1 text-orange-600">{k.name}</p>
                    <div className="inline-block px-2 py-0.5 rounded text-white text-[10px] font-bold mb-2" style={{background: strengthColor(pct)}}>
                      {strengthLabel(pct)} — {pct}%
                    </div>
                    <div className="space-y-0.5">
                      <p>Simpatisan: <b>{formatNumber(k.simpatisan)}</b></p>
                      <p>Kader: <b>{formatNumber(k.kader)}</b></p>
                      <p>Saksi: <b>{formatNumber(k.saksi)}</b></p>
                      <hr className="my-1"/>
                      <p>Baseline: <b>{formatNumber(k.baseline)}</b></p>
                      <p>Realisasi: <b className="text-orange-600">{formatNumber(k.realisasi)}</b></p>
                      <p>Target: <b>{formatNumber(k.target)}</b></p>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      {/* Horizontal legend at bottom */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 px-4 py-3 rounded-xl bg-orange-50/50 border border-orange-100">
        <p className="font-extrabold text-xs flex items-center gap-1 text-gray-800"><Layers className="w-3.5 h-3.5 text-orange-600" /> KEKUATAN DUKUNGAN:</p>
        {[
          { c: '#059669', l: 'Sangat Kuat (80-100%)' },
          { c: '#84CC16', l: 'Kuat (60-79%)' },
          { c: '#EAB308', l: 'Sedang (40-59%)' },
          { c: '#F97316', l: 'Lemah (20-39%)' },
          { c: '#DC2626', l: 'Sangat Lemah (0-19%)' },
        ].map(x => (
          <div key={x.l} className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
            <span className="w-3 h-3 rounded" style={{ background: x.c }}></span>
            {x.l}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default SebaranPeta;
