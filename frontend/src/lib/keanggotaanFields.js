// Shared keanggotaan fields for Simpatisan/Kader/Saksi forms
const JABATAN_DPC = [
  'Ketua DPC','Wakil Ketua','Sekretaris','Wakil Sekretaris','Bendahara','Wakil Bendahara',
  'Kaderisasi','Humas','Litbang','Organisasi','Bidang Perempuan','Bidang Pemuda',
  'Bidang Keagamaan','Bidang Ekonomi','Bidang Hukum'
].map(v => ({value:v,label:v}));

const JABATAN_DPRA = [
  'Ketua DPRA','Wakil Ketua','Sekretaris','Bendahara','Kaderisasi','Humas','Anggota'
].map(v => ({value:v,label:v}));

const PERAN_PELOPOR = [
  'Koordinator','Wakil Koordinator','Sekretaris','Anggota'
].map(v => ({value:v,label:v}));

const JABATAN_RKI = [
  'Ketua RKI','Sekretaris','Bendahara','Anggota'
].map(v => ({value:v,label:v}));

export const KEANGGOTAAN_FIELDS = [
  { type: 'section', label: 'Keanggotaan Organisasi (Opsional)', description: 'Centang jika juga menjabat sebagai berikut. Otomatis muncul di tab terkait.' },
  { name: 'is_pengurus_dpc', type: 'checkbox', label: 'Termasuk Pengurus DPC', hint: 'Dewan Pimpinan Cabang tingkat Kabupaten' },
  { name: 'jabatan_dpc', label: 'Jabatan di DPC', type: 'select', options: JABATAN_DPC, showIf: { is_pengurus_dpc: true } },

  { name: 'is_pengurus_dpra', type: 'checkbox', label: 'Termasuk Pengurus DPRA', hint: 'Dewan Pimpinan Ranting tingkat Desa/Kelurahan' },
  { name: 'jabatan_dpra', label: 'Jabatan di DPRA', type: 'select', options: JABATAN_DPRA, showIf: { is_pengurus_dpra: true } },

  { name: 'is_pelopor', type: 'checkbox', label: 'Termasuk Anggota Pelopor', hint: 'Barisan pelopor pemenangan' },
  { name: 'peran_pelopor', label: 'Peran di Pelopor', type: 'select', options: PERAN_PELOPOR, showIf: { is_pelopor: true } },

  { name: 'is_rki', type: 'checkbox', label: 'Termasuk Anggota RKI', hint: 'Relawan Kader Independen' },
  { name: 'jabatan_rki', label: 'Jabatan di RKI', type: 'select', options: JABATAN_RKI, showIf: { is_rki: true } },
];
