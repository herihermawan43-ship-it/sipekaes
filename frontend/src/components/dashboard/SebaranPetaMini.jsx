import React from 'react';
import { MapContainer, TileLayer, Circle, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import { KECAMATAN_LIST } from '../../mock/mockData';
import { formatNumber } from '../shared/UI';

const strengthColor = (pct) => {
  if (pct >= 80) return '#059669'; // sangat kuat
  if (pct >= 60) return '#84CC16'; // kuat
  if (pct >= 40) return '#EAB308'; // sedang
  if (pct >= 20) return '#F97316'; // lemah
  return '#DC2626'; // sangat lemah
};

const SebaranPetaMini = () => {
  const center = [-6.95, 106.85];
  return (
    <div className="relative rounded-xl overflow-hidden border border-gray-100" style={{ height: 280 }}>
      <div className="absolute top-3 left-3 z-[400] bg-white rounded-xl shadow-md p-3 text-xs">
        <p className="font-extrabold mb-2">Kekuatan Dukungan</p>
        <div className="space-y-1">
          {[
            { c: '#059669', l: 'Sangat Kuat (80-100%)' },
            { c: '#84CC16', l: 'Kuat (60-79%)' },
            { c: '#EAB308', l: 'Sedang (40-59%)' },
            { c: '#F97316', l: 'Lemah (20-39%)' },
            { c: '#DC2626', l: 'Sangat Lemah (0-19%)' },
          ].map(x => (
            <div key={x.l} className="flex items-center gap-2 font-semibold">
              <span className="w-3 h-3 rounded" style={{ background: x.c }}></span>
              {x.l}
            </div>
          ))}
        </div>
      </div>

      <MapContainer center={center} zoom={9} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        {KECAMATAN_LIST.map(k => {
          const pct = Math.round((k.realisasi / k.target) * 100);
          return (
            <React.Fragment key={k.name}>
              <Circle
                center={k.coords}
                radius={5000}
                pathOptions={{ color: strengthColor(pct), fillColor: strengthColor(pct), fillOpacity: 0.3, weight: 1 }}
              />
              <CircleMarker
                center={k.coords}
                radius={7}
                pathOptions={{ color: '#fff', fillColor: strengthColor(pct), fillOpacity: 1, weight: 2 }}
              >
                <Tooltip direction="top" offset={[0, -8]} opacity={1}>
                  <span className="font-bold">{k.name}</span> ({pct}%)
                </Tooltip>
                <Popup>
                  <div className="font-semibold text-xs">
                    <p className="font-extrabold text-sm mb-1">{k.name}</p>
                    <p>Simpatisan: <b>{formatNumber(k.simpatisan)}</b></p>
                    <p>Kader: <b>{formatNumber(k.kader)}</b></p>
                    <p>Saksi: <b>{formatNumber(k.saksi)}</b></p>
                    <p>Baseline: <b>{formatNumber(k.baseline)}</b></p>
                    <p>Realisasi: <b>{formatNumber(k.realisasi)}</b> ({pct}%)</p>
                    <p>Target: <b>{formatNumber(k.target)}</b></p>
                  </div>
                </Popup>
              </CircleMarker>
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default SebaranPetaMini;
