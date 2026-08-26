"""Seed database with demo users, kader, simpatisan, saksi, and wilayah targets.

Data DPC/DPRA/Pelopor/RKI di-embed sebagai keanggotaan pada Kader (single source of truth).
"""
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
from auth import hash_password
from models import uid
from datetime import datetime

load_dotenv(Path(__file__).parent / '.env')
client = AsyncIOMotorClient(os.environ['MONGO_URL'])
db = client[os.environ['DB_NAME']]

# Password default untuk semua demo user: password sesuai username
DEMO_USERS = [
    {'username': 'superadmin', 'password': 'SiPekaeS@2025', 'name': 'Heri Setiawan', 'role': 'super_admin', 'roleLabel': 'Super Admin',
     'avatar': 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop',
     'kecamatan_kerja': '', 'desa_kerja': '', 'tps_kerja': ''},
    {'username': 'adminpusat', 'password': 'admin123', 'name': 'Budi Santoso', 'role': 'admin_pusat', 'roleLabel': 'Admin Pusat',
     'avatar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
     'kecamatan_kerja': '', 'desa_kerja': '', 'tps_kerja': ''},
    {'username': 'admininput', 'password': 'admin123', 'name': 'Siti Aminah', 'role': 'admin_input', 'roleLabel': 'Admin Input',
     'avatar': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
     'kecamatan_kerja': '', 'desa_kerja': '', 'tps_kerja': ''},
    {'username': 'koordinator', 'password': 'admin123', 'name': 'Agus Rahman', 'role': 'koordinator', 'roleLabel': 'Koordinator Kec. Cikembar',
     'avatar': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
     'kecamatan_kerja': 'Cikembar', 'desa_kerja': '', 'tps_kerja': ''},
    {'username': 'saksi', 'password': 'admin123', 'name': 'Dewi Lestari', 'role': 'saksi', 'roleLabel': 'Saksi TPS 01 Cikembar',
     'avatar': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
     'kecamatan_kerja': 'Cikembar', 'desa_kerja': 'Mekarjaya', 'tps_kerja': 'TPS 01'},
]

SIMPATISAN_SEED = [
    {'nama': 'Budi Santoso', 'nik': '3202011234560001', 'hp': '081223451234', 'kecamatan': 'Cikembar', 'desa': 'Mekarjaya', 'rw': 'RW 04', 'rt': 'RT 02', 'alamat': 'Jl. Merdeka No. 12'},
    {'nama': 'Siti Aminah', 'nik': '3202011234560002', 'hp': '081234565678', 'kecamatan': 'Cisaat', 'desa': 'Sukamaju', 'rw': 'RW 02', 'rt': 'RT 01', 'alamat': 'Jl. Raya Cisaat 45'},
    {'nama': 'Agus Rahman', 'nik': '3202011234560003', 'hp': '081245679011', 'kecamatan': 'Palabuhanratu', 'desa': 'Citarik', 'rw': 'RW 01', 'rt': 'RT 03', 'alamat': 'Jl. Pelabuhan No. 88'},
    {'nama': 'Dewi Lestari', 'nik': '3202011234560004', 'hp': '081256781121', 'kecamatan': 'Parungkuda', 'desa': 'Sundawenang', 'rw': 'RW 03', 'rt': 'RT 04', 'alamat': 'Kp. Bojong RT 04'},
    {'nama': 'Rudi Hermawan', 'nik': '3202011234560005', 'hp': '081267893141', 'kecamatan': 'Cibadak', 'desa': 'Karangtengah', 'rw': 'RW 06', 'rt': 'RT 02', 'alamat': 'Jl. Raya Cibadak 210'},
    {'nama': 'Yuni Kartika', 'nik': '3202011234560006', 'hp': '081311223344', 'kecamatan': 'Sukaraja', 'desa': 'Selaawi', 'rw': 'RW 02', 'rt': 'RT 05', 'alamat': 'Jl. Sukaraja 12'},
    # sekaligus Pengurus DPRA
    {'nama': 'Deden Supriatna', 'nik': '3202011234560020', 'hp': '081320001004', 'kecamatan': 'Cibadak', 'desa': 'Karangtengah', 'rw': 'RW 06', 'rt': 'RT 03', 'alamat': 'Cibadak Utara 22',
     'is_pengurus_dpra': True, 'jabatan_dpra': 'Anggota'},
    {'nama': 'Popon Suryati', 'nik': '3202011234560021', 'hp': '081320001005', 'kecamatan': 'Nagrak', 'desa': 'Cisarua', 'rw': 'RW 07', 'rt': 'RT 02', 'alamat': 'Nagrak Barat 11',
     'is_pengurus_dpra': True, 'jabatan_dpra': 'Anggota'},
    # sekaligus Anggota Pelopor
    {'nama': 'Wulandari S.', 'nik': '3202011234560030', 'hp': '081430002002', 'kecamatan': 'Cisaat', 'desa': 'Sukamaju', 'rw': 'RW 02', 'rt': 'RT 04', 'alamat': 'Sukamaju 5',
     'is_pelopor': True, 'peran_pelopor': 'Anggota'},
]

KADER_SEED = [
    {'nama': 'H. Ahmad Rifai, S.H.', 'jabatan': 'Ketua DPC', 'kecamatan': 'Palabuhanratu', 'desa': 'Citarik', 'rw': 'RW 01', 'hp': '081211111001', 'alamat': 'Palabuhanratu',
     'is_pengurus_dpc': True, 'jabatan_dpc': 'Ketua DPC'},
    {'nama': 'Hj. Nur Aisyah, M.Pd.', 'jabatan': 'Sekretaris DPC', 'kecamatan': 'Cisaat', 'desa': 'Sukamaju', 'rw': 'RW 02', 'hp': '081211111002', 'alamat': 'Cisaat',
     'is_pengurus_dpc': True, 'jabatan_dpc': 'Sekretaris'},
    {'nama': 'H. Sutrisno, S.E.', 'jabatan': 'Bendahara DPC', 'kecamatan': 'Cikembar', 'desa': 'Mekarjaya', 'rw': 'RW 03', 'hp': '081211111003', 'alamat': 'Cikembar',
     'is_pengurus_dpc': True, 'jabatan_dpc': 'Bendahara'},
    {'nama': 'Drs. Bambang W.', 'jabatan': 'Kaderisasi', 'kecamatan': 'Sukaraja', 'desa': 'Selaawi', 'rw': 'RW 04', 'hp': '081211111004', 'alamat': 'Sukaraja',
     'is_pengurus_dpc': True, 'jabatan_dpc': 'Kaderisasi'},
    {'nama': 'Iwan Kurniawan', 'jabatan': 'Humas', 'kecamatan': 'Cibadak', 'desa': 'Karangtengah', 'rw': 'RW 07', 'hp': '081211111005', 'alamat': 'Cibadak',
     'is_pengurus_dpc': True, 'jabatan_dpc': 'Humas'},
    # Pengurus DPRA
    {'nama': 'Ust. Zaenal Abidin', 'jabatan': 'Ketua DPRA Cikembar', 'kecamatan': 'Cikembar', 'desa': 'Mekarjaya', 'rw': 'RW 04', 'hp': '081320001001', 'alamat': 'Mekarjaya',
     'is_pengurus_dpra': True, 'jabatan_dpra': 'Ketua DPRA'},
    {'nama': 'Rusman Efendi', 'jabatan': 'Sekretaris DPRA Cisaat', 'kecamatan': 'Cisaat', 'desa': 'Sukamaju', 'rw': 'RW 02', 'hp': '081320001002', 'alamat': 'Sukamaju',
     'is_pengurus_dpra': True, 'jabatan_dpra': 'Sekretaris'},
    # Pelopor + Kader
    {'nama': 'Aditya Nugraha', 'jabatan': 'Koordinator Kecamatan', 'kecamatan': 'Cikembar', 'desa': 'Mekarjaya', 'rw': 'RW 05', 'hp': '081430002001', 'alamat': 'Mekarjaya',
     'is_pelopor': True, 'peran_pelopor': 'Koordinator'},
    # RKI + Kader
    {'nama': 'H. Slamet Riyadi', 'jabatan': 'Kader Aktif', 'kecamatan': 'Cikembar', 'desa': 'Mekarjaya', 'rw': 'RW 04', 'hp': '081540003001', 'alamat': 'Mekarjaya',
     'is_rki': True, 'jabatan_rki': 'Ketua RKI'},
    {'nama': 'Rian Firmansyah', 'jabatan': 'Kader Aktif', 'kecamatan': 'Cisaat', 'desa': 'Sukamaju', 'rw': 'RW 03', 'hp': '081540003002', 'alamat': 'Sukamaju',
     'is_rki': True, 'jabatan_rki': 'Sekretaris'},
]

SAKSI_SEED = [
    {'nama': 'Dedi Kurnia', 'tps': 'TPS 01', 'kecamatan': 'Cikembar', 'desa': 'Mekarjaya', 'rw': 'RW 04', 'hp': '081310102020', 'status': 'terverifikasi'},
    {'nama': 'Wati Susanti', 'tps': 'TPS 05', 'kecamatan': 'Cisaat', 'desa': 'Sukamaju', 'rw': 'RW 02', 'hp': '081320203030', 'status': 'terverifikasi'},
    {'nama': 'Hendra Wijaya', 'tps': 'TPS 12', 'kecamatan': 'Palabuhanratu', 'desa': 'Citarik', 'rw': 'RW 01', 'hp': '081330304040', 'status': 'terverifikasi'},
    {'nama': 'Lilis Suryani', 'tps': 'TPS 08', 'kecamatan': 'Parungkuda', 'desa': 'Sundawenang', 'rw': 'RW 03', 'hp': '081340405050', 'status': 'pending'},
    {'nama': 'Rahmat Hidayat', 'tps': 'TPS 03', 'kecamatan': 'Cibadak', 'desa': 'Karangtengah', 'rw': 'RW 06', 'hp': '081350506060', 'status': 'terverifikasi'},
    # Saksi + Anggota Pelopor + RKI
    {'nama': 'Ridwan Kurnia', 'tps': 'TPS 22', 'kecamatan': 'Palabuhanratu', 'desa': 'Citarik', 'rw': 'RW 05', 'hp': '081430002003', 'status': 'terverifikasi',
     'is_pelopor': True, 'peran_pelopor': 'Anggota'},
]

WILAYAH_TARGET_SEED = [
    {'kecamatan': 'Cikembar', 'baseline': 35000, 'target': 70000, 'realisasi': 48230},
    {'kecamatan': 'Cisaat', 'baseline': 60000, 'target': 125000, 'realisasi': 82400},
    {'kecamatan': 'Palabuhanratu', 'baseline': 80000, 'target': 160000, 'realisasi': 108600},
    {'kecamatan': 'Parungkuda', 'baseline': 45000, 'target': 90000, 'realisasi': 56300},
    {'kecamatan': 'Cibadak', 'baseline': 40000, 'target': 80000, 'realisasi': 49200},
    {'kecamatan': 'Sukaraja', 'baseline': 38000, 'target': 76000, 'realisasi': 45800},
    {'kecamatan': 'Sukalarang', 'baseline': 32000, 'target': 64000, 'realisasi': 39600},
    {'kecamatan': 'Kadudampit', 'baseline': 28000, 'target': 56000, 'realisasi': 34000},
    {'kecamatan': 'Cicantayan', 'baseline': 30000, 'target': 60000, 'realisasi': 37200},
    {'kecamatan': 'Nagrak', 'baseline': 42000, 'target': 84000, 'realisasi': 51600},
    {'kecamatan': 'Kalapanunggal', 'baseline': 25000, 'target': 50000, 'realisasi': 30500},
    {'kecamatan': 'Cikakak', 'baseline': 22000, 'target': 44000, 'realisasi': 27200},
    {'kecamatan': 'Bantargadung', 'baseline': 20000, 'target': 40000, 'realisasi': 24800},
    {'kecamatan': 'Jampangkulon', 'baseline': 27000, 'target': 54000, 'realisasi': 32900},
    {'kecamatan': 'Surade', 'baseline': 31000, 'target': 62000, 'realisasi': 38400},
]

async def seed():
    await db.users.delete_many({})
    for u in DEMO_USERS:
        pw = u.pop('password')
        await db.users.insert_one({**u, 'id': uid(), 'hashed_password': hash_password(pw), 'created_at': datetime.utcnow()})
    print(f"Seeded {len(DEMO_USERS)} users")

    for coll, data in [('simpatisan', SIMPATISAN_SEED), ('kader', KADER_SEED), ('saksi', SAKSI_SEED)]:
        await db[coll].delete_many({})
        for item in data:
            await db[coll].insert_one({**item, 'id': uid(), 'tanggal': datetime.utcnow()})
        print(f"Seeded {len(data)} {coll}")

    # legacy collections cleanup
    for legacy in ('pengurus_dpc', 'pengurus_dpra', 'pelopor', 'rki'):
        await db[legacy].delete_many({})

    await db.wilayah_target.delete_many({})
    for w in WILAYAH_TARGET_SEED:
        await db.wilayah_target.insert_one({**w, 'id': uid(), 'updated_at': datetime.utcnow()})
    print(f"Seeded {len(WILAYAH_TARGET_SEED)} wilayah_target")

    print("Done!")

if __name__ == '__main__':
    asyncio.run(seed())
