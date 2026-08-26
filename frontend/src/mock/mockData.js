// Mock data for SiPekaeS

export const USERS = [
  { id: 1, username: 'superadmin', password: 'admin123', name: 'Heri Setiawan', role: 'super_admin', roleLabel: 'Super Admin', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop' },
  { id: 2, username: 'adminpusat', password: 'admin123', name: 'Budi Santoso', role: 'admin_pusat', roleLabel: 'Admin Pusat', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' },
  { id: 3, username: 'admininput', password: 'admin123', name: 'Siti Aminah', role: 'admin_input', roleLabel: 'Admin Input', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop' },
  { id: 4, username: 'koordinator', password: 'admin123', name: 'Agus Rahman', role: 'koordinator', roleLabel: 'Koordinator', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop' },
  { id: 5, username: 'saksi', password: 'admin123', name: 'Dewi Lestari', role: 'saksi', roleLabel: 'Saksi TPS', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop' },
];

export const KECAMATAN_LIST = [
  { name: 'Cikembar', baseline: 35000, target: 70000, realisasi: 48230, simpatisan: 8250, kader: 620, saksi: 1120, coords: [-6.9634, 106.8317] },
  { name: 'Cisaat', baseline: 60000, target: 125000, realisasi: 82400, simpatisan: 12300, kader: 890, saksi: 1500, coords: [-6.9014, 106.8994] },
  { name: 'Palabuhanratu', baseline: 80000, target: 160000, realisasi: 108600, simpatisan: 18500, kader: 1100, saksi: 2200, coords: [-6.9856, 106.5511] },
  { name: 'Parungkuda', baseline: 45000, target: 90000, realisasi: 56300, simpatisan: 9800, kader: 720, saksi: 1300, coords: [-6.8214, 106.7783] },
  { name: 'Cibadak', baseline: 40000, target: 80000, realisasi: 49200, simpatisan: 8700, kader: 650, saksi: 1200, coords: [-6.8878, 106.7811] },
  { name: 'Sukaraja', baseline: 38000, target: 76000, realisasi: 45800, simpatisan: 7900, kader: 590, saksi: 1050, coords: [-6.8611, 106.9611] },
  { name: 'Sukalarang', baseline: 32000, target: 64000, realisasi: 39600, simpatisan: 6800, kader: 510, saksi: 950, coords: [-6.8422, 106.9689] },
  { name: 'Kadudampit', baseline: 28000, target: 56000, realisasi: 34000, simpatisan: 5900, kader: 440, saksi: 820, coords: [-6.8783, 106.8933] },
  { name: 'Cicantayan', baseline: 30000, target: 60000, realisasi: 37200, simpatisan: 6400, kader: 480, saksi: 890, coords: [-6.9256, 106.8483] },
  { name: 'Nagrak', baseline: 42000, target: 84000, realisasi: 51600, simpatisan: 9100, kader: 680, saksi: 1230, coords: [-6.8339, 106.7514] },
  { name: 'Kalapanunggal', baseline: 25000, target: 50000, realisasi: 30500, simpatisan: 5200, kader: 390, saksi: 720, coords: [-6.7550, 106.6667] },
  { name: 'Cikakak', baseline: 22000, target: 44000, realisasi: 27200, simpatisan: 4700, kader: 350, saksi: 650, coords: [-6.9556, 106.5000] },
  { name: 'Bantargadung', baseline: 20000, target: 40000, realisasi: 24800, simpatisan: 4200, kader: 315, saksi: 590, coords: [-7.0011, 106.6739] },
  { name: 'Jampangkulon', baseline: 27000, target: 54000, realisasi: 32900, simpatisan: 5600, kader: 420, saksi: 780, coords: [-7.2456, 106.6817] },
  { name: 'Surade', baseline: 31000, target: 62000, realisasi: 38400, simpatisan: 6600, kader: 495, saksi: 920, coords: [-7.3167, 106.6167] },
];

export const CHART_DATA = [
  { month: 'Jan', realisasi: 250000, baseline: 250000 },
  { month: 'Feb', realisasi: 320000, baseline: 290000 },
  { month: 'Mar', realisasi: 410000, baseline: 340000 },
  { month: 'Apr', realisasi: 490000, baseline: 380000 },
  { month: 'Mei', realisasi: 560000, baseline: 420000 },
  { month: 'Jun', realisasi: 620000, baseline: 460000 },
  { month: 'Jul', realisasi: 680000, baseline: 490000 },
  { month: 'Agu', realisasi: 730000, baseline: 520000 },
  { month: 'Sep', realisasi: 770000, baseline: 550000 },
  { month: 'Okt', realisasi: 810000, baseline: 575000 },
  { month: 'Nov', realisasi: 840000, baseline: 590000 },
  { month: 'Des', realisasi: 850320, baseline: 600000 },
];

export const SIMPATISAN = [
  { id: 1, nama: 'Budi Santoso', nik: '3202011234560001', hp: '0812-2345-1234', kecamatan: 'Cikembar', desa: 'Mekarjaya', rw: 'RW 04', rt: 'RT 02', alamat: 'Jl. Merdeka No. 12', tanggal: '18 Mei 2025', status: 'aktif' },
  { id: 2, nama: 'Siti Aminah', nik: '3202011234560002', hp: '0812-3456-5678', kecamatan: 'Cisaat', desa: 'Sukamaju', rw: 'RW 02', rt: 'RT 01', alamat: 'Jl. Raya Cisaat 45', tanggal: '18 Mei 2025', status: 'aktif' },
  { id: 3, nama: 'Agus Rahman', nik: '3202011234560003', hp: '0812-4567-9011', kecamatan: 'Palabuhanratu', desa: 'Citarik', rw: 'RW 01', rt: 'RT 03', alamat: 'Jl. Pelabuhan No. 88', tanggal: '17 Mei 2025', status: 'aktif' },
  { id: 4, nama: 'Dewi Lestari', nik: '3202011234560004', hp: '0812-5678-1121', kecamatan: 'Parungkuda', desa: 'Sundawenang', rw: 'RW 03', rt: 'RT 04', alamat: 'Kp. Bojong RT 04', tanggal: '17 Mei 2025', status: 'aktif' },
  { id: 5, nama: 'Rudi Hermawan', nik: '3202011234560005', hp: '0812-6789-3141', kecamatan: 'Cibadak', desa: 'Karangtengah', rw: 'RW 06', rt: 'RT 02', alamat: 'Jl. Raya Cibadak 210', tanggal: '17 Mei 2025', status: 'aktif' },
  { id: 6, nama: 'Yuni Kartika', nik: '3202011234560006', hp: '0813-1122-3344', kecamatan: 'Sukaraja', desa: 'Selaawi', rw: 'RW 02', rt: 'RT 05', alamat: 'Jl. Sukaraja 12', tanggal: '16 Mei 2025', status: 'aktif' },
  { id: 7, nama: 'Rina Wulandari', nik: '3202011234560007', hp: '0813-2233-4455', kecamatan: 'Cikembar', desa: 'Bojongkembar', rw: 'RW 05', rt: 'RT 01', alamat: 'Kp. Cikembar 45', tanggal: '16 Mei 2025', status: 'menunggu' },
  { id: 8, nama: 'Ahmad Fauzi', nik: '3202011234560008', hp: '0813-3344-5566', kecamatan: 'Nagrak', desa: 'Cisarua', rw: 'RW 07', rt: 'RT 03', alamat: 'Jl. Nagrak Utara', tanggal: '15 Mei 2025', status: 'aktif' },
  { id: 9, nama: 'Sri Handayani', nik: '3202011234560009', hp: '0813-4455-6677', kecamatan: 'Cisaat', desa: 'Selajambe', rw: 'RW 04', rt: 'RT 02', alamat: 'Jl. Selajambe No. 3', tanggal: '15 Mei 2025', status: 'aktif' },
  { id: 10, nama: 'Andi Pratama', nik: '3202011234560010', hp: '0813-5566-7788', kecamatan: 'Kadudampit', desa: 'Muaradua', rw: 'RW 01', rt: 'RT 04', alamat: 'Kp. Muaradua', tanggal: '15 Mei 2025', status: 'aktif' },
];

export const KADER = [
  { id: 1, nama: 'H. Ahmad Rifai', jabatan: 'Ketua DPC', kecamatan: 'Palabuhanratu', desa: 'Citarik', hp: '0812-1111-2222', tanggal: '10 Jan 2025' },
  { id: 2, nama: 'Hj. Nur Aisyah', jabatan: 'Sekretaris', kecamatan: 'Cisaat', desa: 'Sukamaju', hp: '0812-2222-3333', tanggal: '10 Jan 2025' },
  { id: 3, nama: 'H. Sutrisno', jabatan: 'Bendahara', kecamatan: 'Cikembar', desa: 'Mekarjaya', hp: '0812-3333-4444', tanggal: '12 Jan 2025' },
  { id: 4, nama: 'Drs. Bambang W.', jabatan: 'Koordinator Kecamatan', kecamatan: 'Sukaraja', desa: 'Selaawi', hp: '0812-4444-5555', tanggal: '15 Jan 2025' },
  { id: 5, nama: 'Hj. Fatimah', jabatan: 'Koordinator Desa', kecamatan: 'Nagrak', desa: 'Cisarua', hp: '0812-5555-6666', tanggal: '15 Jan 2025' },
  { id: 6, nama: 'M. Yusuf, S.E.', jabatan: 'Koordinator RW', kecamatan: 'Parungkuda', desa: 'Sundawenang', hp: '0812-6666-7777', tanggal: '18 Jan 2025' },
  { id: 7, nama: 'Iwan Kurniawan', jabatan: 'Koordinator RW', kecamatan: 'Cibadak', desa: 'Karangtengah', hp: '0812-7777-8888', tanggal: '20 Jan 2025' },
  { id: 8, nama: 'Hj. Rohati', jabatan: 'Kader Perempuan', kecamatan: 'Cisaat', desa: 'Selajambe', hp: '0812-8888-9999', tanggal: '22 Jan 2025' },
];

export const SAKSI = [
  { id: 1, nama: 'Dedi Kurnia', tps: 'TPS 01', kecamatan: 'Cikembar', desa: 'Mekarjaya', hp: '0813-1010-2020', status: 'terverifikasi' },
  { id: 2, nama: 'Wati Susanti', tps: 'TPS 05', kecamatan: 'Cisaat', desa: 'Sukamaju', hp: '0813-2020-3030', status: 'terverifikasi' },
  { id: 3, nama: 'Hendra Wijaya', tps: 'TPS 12', kecamatan: 'Palabuhanratu', desa: 'Citarik', hp: '0813-3030-4040', status: 'terverifikasi' },
  { id: 4, nama: 'Lilis Suryani', tps: 'TPS 08', kecamatan: 'Parungkuda', desa: 'Sundawenang', hp: '0813-4040-5050', status: 'pending' },
  { id: 5, nama: 'Rahmat Hidayat', tps: 'TPS 03', kecamatan: 'Cibadak', desa: 'Karangtengah', hp: '0813-5050-6060', status: 'terverifikasi' },
  { id: 6, nama: 'Nining Suciati', tps: 'TPS 15', kecamatan: 'Sukaraja', desa: 'Selaawi', hp: '0813-6060-7070', status: 'terverifikasi' },
  { id: 7, nama: 'Tono Sudirman', tps: 'TPS 07', kecamatan: 'Nagrak', desa: 'Cisarua', hp: '0813-7070-8080', status: 'pending' },
  { id: 8, nama: 'Endang Rahmawati', tps: 'TPS 09', kecamatan: 'Cisaat', desa: 'Selajambe', hp: '0813-8080-9090', status: 'terverifikasi' },
];

export const AKTIVITAS = [
  { id: 1, type: 'simpatisan', title: 'Penambahan Simpatisan Baru', desc: 'RW 04, Kel. Cikembar, Kec. Cikembar', time: '10 menit lalu' },
  { id: 2, type: 'kader', title: 'Update Data Kader', desc: 'RW 02, Kel. Palabuhanratu, Kec. Palabuhanratu', time: '35 menit lalu' },
  { id: 3, type: 'saksi', title: 'Pendataan Saksi TPS 12', desc: 'Desa Sukamanja, Kec. Cisaat', time: '1 jam lalu' },
  { id: 4, type: 'target', title: 'Input Target Suara Kecamatan', desc: 'Kec. Cidahu', time: '2 jam lalu' },
  { id: 5, type: 'kegiatan', title: 'Kampanye Tatap Muka Selesai', desc: 'Desa Mekarjaya, Kec. Cikembar', time: '3 jam lalu' },
  { id: 6, type: 'simpatisan', title: 'Verifikasi 25 Simpatisan', desc: 'Kec. Nagrak', time: '5 jam lalu' },
];

export const KEGIATAN = [
  { id: 1, nama: 'Kampanye Tatap Muka', tanggal: '18 Mei 2025', jam: '10:00 - 12:00', lokasi: 'Desa Mekarjaya, Kec. Cikembar', wilayah: 'RW 04', hadir: 120, target: 150, foto: 'https://images.unsplash.com/photo-1591115765373-5207764f72e4?w=400', status: 'selesai' },
  { id: 2, nama: 'Rapat Koordinasi Kader', tanggal: '19 Mei 2025', jam: '14:00 - 16:00', lokasi: 'Aula Kecamatan', wilayah: 'Kec. Cisaat', hadir: 25, target: 30, foto: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400', status: 'selesai' },
  { id: 3, nama: 'Pemasangan Spanduk', tanggal: '20 Mei 2025', jam: '08:00 - 12:00', lokasi: 'Jl. Raya Cibadak', wilayah: 'Cibadak', hadir: 0, target: 100, progress: 75, foto: 'https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?w=400', status: 'progress' },
  { id: 4, nama: 'Door to Door', tanggal: '21 Mei 2025', jam: '08:00 - 15:00', lokasi: 'Desa Sukamanja, Kec. Cisaat', wilayah: 'RW 02, 03, 04', hadir: 0, target: 200, progress: 60, foto: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400', status: 'progress' },
  { id: 5, nama: 'Sosialisasi Program', tanggal: '22 Mei 2025', jam: '19:00 - 21:00', lokasi: 'Balai Desa Karangtengah', wilayah: 'Cibadak', hadir: 0, target: 80, foto: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400', status: 'rencana' },
];

export const AGENDA = [
  { id: 1, judul: 'Rapat Pleno Pengurus', tanggal: '25 Mei 2025', jam: '09:00', lokasi: 'Kantor DPC Sukabumi', tipe: 'internal' },
  { id: 2, judul: 'Kampanye Akbar', tanggal: '01 Juni 2025', jam: '14:00', lokasi: 'Lapangan Merdeka Sukabumi', tipe: 'publik' },
  { id: 3, judul: 'Silaturahmi Tokoh Masyarakat', tanggal: '05 Juni 2025', jam: '19:30', lokasi: 'Rumah Kyai Palabuhanratu', tipe: 'publik' },
  { id: 4, judul: 'Pelatihan Saksi TPS', tanggal: '10 Juni 2025', jam: '08:00', lokasi: 'Aula Gedung DPC', tipe: 'internal' },
];

export const TUGAS = [
  { id: 1, judul: 'Verifikasi 500 Simpatisan Baru', deadline: '25 Mei 2025', pic: 'Tim Admin Input', progress: 65, prioritas: 'tinggi' },
  { id: 2, judul: 'Rekrut Saksi TPS Palabuhanratu', deadline: '30 Mei 2025', pic: 'Koordinator Wilayah', progress: 40, prioritas: 'tinggi' },
  { id: 3, judul: 'Update Data Kader Cisaat', deadline: '28 Mei 2025', pic: 'Admin Pusat', progress: 80, prioritas: 'sedang' },
  { id: 4, judul: 'Distribusi APK ke 47 Kecamatan', deadline: '15 Juni 2025', pic: 'Tim Logistik', progress: 25, prioritas: 'sedang' },
  { id: 5, judul: 'Pelaporan Mingguan Wilayah', deadline: '24 Mei 2025', pic: 'Semua Koordinator', progress: 90, prioritas: 'rendah' },
];

export const QUICK_COUNT_DATA = [
  { paslon: 'Paslon 1', suara: 42.5, warna: '#EF4444' },
  { paslon: 'Paslon 2 (Kami)', suara: 51.3, warna: '#F97316' },
  { paslon: 'Paslon 3', suara: 6.2, warna: '#3B82F6' },
];

export const NOTIFIKASI = [
  { id: 1, title: 'Target Suara Cikembar Tercapai 69%', time: '5 menit lalu', unread: true },
  { id: 2, title: 'Saksi TPS Baru Terverifikasi', time: '15 menit lalu', unread: true },
  { id: 3, title: 'Rapat Koordinasi Besok Pukul 14:00', time: '1 jam lalu', unread: true },
  { id: 4, title: 'Data Simpatisan Perlu Diverifikasi', time: '2 jam lalu', unread: false },
];

export const STATS = {
  simpatisan: { value: 125430, growth: 12.5 },
  kader: { value: 8754, growth: 8.2 },
  saksi: { value: 15230, growth: 10.1 },
  rw: { value: 2340, total: 3000, tercover: 78 },
  baseline: 600000,
  target: 1250000,
  realisasi: 850320,
  targetPersen: 68,
  kecamatan: 47,
  desa: 381,
};
