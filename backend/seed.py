"""Seed database with demo users and initial data."""
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

DEMO_USERS = [
    {'username': 'superadmin', 'name': 'Heri Setiawan', 'role': 'super_admin', 'roleLabel': 'Super Admin', 'avatar': 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop'},
    {'username': 'adminpusat', 'name': 'Budi Santoso', 'role': 'admin_pusat', 'roleLabel': 'Admin Pusat', 'avatar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop'},
    {'username': 'admininput', 'name': 'Siti Aminah', 'role': 'admin_input', 'roleLabel': 'Admin Input', 'avatar': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop'},
    {'username': 'koordinator', 'name': 'Agus Rahman', 'role': 'koordinator', 'roleLabel': 'Koordinator', 'avatar': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop'},
    {'username': 'saksi', 'name': 'Dewi Lestari', 'role': 'saksi', 'roleLabel': 'Saksi TPS', 'avatar': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop'},
]

SIMPATISAN_SEED = [
    {'nama': 'Budi Santoso', 'nik': '3202011234560001', 'hp': '0812-2345-1234', 'kecamatan': 'Cikembar', 'desa': 'Mekarjaya', 'rw': 'RW 04', 'rt': 'RT 02', 'alamat': 'Jl. Merdeka No. 12', 'status': 'aktif'},
    {'nama': 'Siti Aminah', 'nik': '3202011234560002', 'hp': '0812-3456-5678', 'kecamatan': 'Cisaat', 'desa': 'Sukamaju', 'rw': 'RW 02', 'rt': 'RT 01', 'alamat': 'Jl. Raya Cisaat 45', 'status': 'aktif'},
    {'nama': 'Agus Rahman', 'nik': '3202011234560003', 'hp': '0812-4567-9011', 'kecamatan': 'Palabuhanratu', 'desa': 'Citarik', 'rw': 'RW 01', 'rt': 'RT 03', 'alamat': 'Jl. Pelabuhan No. 88', 'status': 'aktif'},
    {'nama': 'Dewi Lestari', 'nik': '3202011234560004', 'hp': '0812-5678-1121', 'kecamatan': 'Parungkuda', 'desa': 'Sundawenang', 'rw': 'RW 03', 'rt': 'RT 04', 'alamat': 'Kp. Bojong RT 04', 'status': 'aktif'},
    {'nama': 'Rudi Hermawan', 'nik': '3202011234560005', 'hp': '0812-6789-3141', 'kecamatan': 'Cibadak', 'desa': 'Karangtengah', 'rw': 'RW 06', 'rt': 'RT 02', 'alamat': 'Jl. Raya Cibadak 210', 'status': 'aktif'},
    {'nama': 'Yuni Kartika', 'nik': '3202011234560006', 'hp': '0813-1122-3344', 'kecamatan': 'Sukaraja', 'desa': 'Selaawi', 'rw': 'RW 02', 'rt': 'RT 05', 'alamat': 'Jl. Sukaraja 12', 'status': 'aktif'},
    {'nama': 'Rina Wulandari', 'nik': '3202011234560007', 'hp': '0813-2233-4455', 'kecamatan': 'Cikembar', 'desa': 'Bojongkembar', 'rw': 'RW 05', 'rt': 'RT 01', 'alamat': 'Kp. Cikembar 45', 'status': 'menunggu'},
    {'nama': 'Ahmad Fauzi', 'nik': '3202011234560008', 'hp': '0813-3344-5566', 'kecamatan': 'Nagrak', 'desa': 'Cisarua', 'rw': 'RW 07', 'rt': 'RT 03', 'alamat': 'Jl. Nagrak Utara', 'status': 'aktif'},
    {'nama': 'Sri Handayani', 'nik': '3202011234560009', 'hp': '0813-4455-6677', 'kecamatan': 'Cisaat', 'desa': 'Selajambe', 'rw': 'RW 04', 'rt': 'RT 02', 'alamat': 'Jl. Selajambe No. 3', 'status': 'aktif'},
    {'nama': 'Andi Pratama', 'nik': '3202011234560010', 'hp': '0813-5566-7788', 'kecamatan': 'Kadudampit', 'desa': 'Muaradua', 'rw': 'RW 01', 'rt': 'RT 04', 'alamat': 'Kp. Muaradua', 'status': 'aktif'},
]

KADER_SEED = [
    {'nama': 'H. Ahmad Rifai', 'jabatan': 'Ketua DPC', 'kecamatan': 'Palabuhanratu', 'desa': 'Citarik', 'rw': 'RW 01', 'hp': '0812-1111-2222'},
    {'nama': 'Hj. Nur Aisyah', 'jabatan': 'Sekretaris', 'kecamatan': 'Cisaat', 'desa': 'Sukamaju', 'rw': 'RW 02', 'hp': '0812-2222-3333'},
    {'nama': 'H. Sutrisno', 'jabatan': 'Bendahara', 'kecamatan': 'Cikembar', 'desa': 'Mekarjaya', 'rw': 'RW 03', 'hp': '0812-3333-4444'},
    {'nama': 'Drs. Bambang W.', 'jabatan': 'Koordinator Kecamatan', 'kecamatan': 'Sukaraja', 'desa': 'Selaawi', 'rw': 'RW 04', 'hp': '0812-4444-5555'},
    {'nama': 'Hj. Fatimah', 'jabatan': 'Koordinator Desa', 'kecamatan': 'Nagrak', 'desa': 'Cisarua', 'rw': 'RW 05', 'hp': '0812-5555-6666'},
    {'nama': 'M. Yusuf, S.E.', 'jabatan': 'Koordinator RW', 'kecamatan': 'Parungkuda', 'desa': 'Sundawenang', 'rw': 'RW 06', 'hp': '0812-6666-7777'},
    {'nama': 'Iwan Kurniawan', 'jabatan': 'Koordinator RW', 'kecamatan': 'Cibadak', 'desa': 'Karangtengah', 'rw': 'RW 07', 'hp': '0812-7777-8888'},
    {'nama': 'Hj. Rohati', 'jabatan': 'Kader Perempuan', 'kecamatan': 'Cisaat', 'desa': 'Selajambe', 'rw': 'RW 08', 'hp': '0812-8888-9999'},
]

SAKSI_SEED = [
    {'nama': 'Dedi Kurnia', 'tps': 'TPS 01', 'kecamatan': 'Cikembar', 'desa': 'Mekarjaya', 'rw': 'RW 04', 'hp': '0813-1010-2020', 'status': 'terverifikasi'},
    {'nama': 'Wati Susanti', 'tps': 'TPS 05', 'kecamatan': 'Cisaat', 'desa': 'Sukamaju', 'rw': 'RW 02', 'hp': '0813-2020-3030', 'status': 'terverifikasi'},
    {'nama': 'Hendra Wijaya', 'tps': 'TPS 12', 'kecamatan': 'Palabuhanratu', 'desa': 'Citarik', 'rw': 'RW 01', 'hp': '0813-3030-4040', 'status': 'terverifikasi'},
    {'nama': 'Lilis Suryani', 'tps': 'TPS 08', 'kecamatan': 'Parungkuda', 'desa': 'Sundawenang', 'rw': 'RW 03', 'hp': '0813-4040-5050', 'status': 'pending'},
    {'nama': 'Rahmat Hidayat', 'tps': 'TPS 03', 'kecamatan': 'Cibadak', 'desa': 'Karangtengah', 'rw': 'RW 06', 'hp': '0813-5050-6060', 'status': 'terverifikasi'},
    {'nama': 'Nining Suciati', 'tps': 'TPS 15', 'kecamatan': 'Sukaraja', 'desa': 'Selaawi', 'rw': 'RW 02', 'hp': '0813-6060-7070', 'status': 'terverifikasi'},
]

DPC_SEED = [
    {'nama': 'H. Ahmad Rifai, S.H.', 'jabatan': 'Ketua DPC', 'hp': '0812-1111-1001', 'alamat': 'Palabuhanratu'},
    {'nama': 'Hj. Nur Aisyah, M.Pd.', 'jabatan': 'Sekretaris', 'hp': '0812-1111-1002', 'alamat': 'Cisaat'},
    {'nama': 'H. Sutrisno, S.E.', 'jabatan': 'Bendahara', 'hp': '0812-1111-1003', 'alamat': 'Cikembar'},
    {'nama': 'Drs. Bambang W.', 'jabatan': 'Kaderisasi', 'hp': '0812-1111-1004', 'alamat': 'Sukaraja'},
    {'nama': 'Iwan Kurniawan', 'jabatan': 'Humas', 'hp': '0812-1111-1005', 'alamat': 'Cibadak'},
    {'nama': 'M. Yusuf, S.E.', 'jabatan': 'Litbang', 'hp': '0812-1111-1006', 'alamat': 'Parungkuda'},
    {'nama': 'Hj. Rohati', 'jabatan': 'Bidang Perempuan', 'hp': '0812-1111-1007', 'alamat': 'Cisaat'},
    {'nama': 'Iwan Setiawan', 'jabatan': 'Bidang Pemuda', 'hp': '0812-1111-1008', 'alamat': 'Nagrak'},
]

DPRA_SEED = [
    {'nama': 'Ust. Zaenal Abidin', 'jabatan': 'Ketua DPRA', 'kecamatan': 'Cikembar', 'desa': 'Mekarjaya', 'hp': '0813-2000-1001', 'kategori': 'kader'},
    {'nama': 'Rusman Efendi', 'jabatan': 'Sekretaris', 'kecamatan': 'Cisaat', 'desa': 'Sukamaju', 'hp': '0813-2000-1002', 'kategori': 'kader'},
    {'nama': 'Nunung Aisyah', 'jabatan': 'Bendahara', 'kecamatan': 'Palabuhanratu', 'desa': 'Citarik', 'hp': '0813-2000-1003', 'kategori': 'kader'},
    {'nama': 'Deden Supriatna', 'jabatan': 'Anggota', 'kecamatan': 'Cibadak', 'desa': 'Karangtengah', 'hp': '0813-2000-1004', 'kategori': 'simpatisan'},
    {'nama': 'Popon Suryati', 'jabatan': 'Anggota', 'kecamatan': 'Nagrak', 'desa': 'Cisarua', 'hp': '0813-2000-1005', 'kategori': 'simpatisan'},
]

PELOPOR_SEED = [
    {'nama': 'Aditya Nugraha', 'kecamatan': 'Cikembar', 'desa': 'Mekarjaya', 'hp': '0814-3000-2001', 'peran': 'Koordinator'},
    {'nama': 'Wulandari S.', 'kecamatan': 'Cisaat', 'desa': 'Sukamaju', 'hp': '0814-3000-2002', 'peran': 'Anggota'},
    {'nama': 'Ridwan Kurnia', 'kecamatan': 'Palabuhanratu', 'desa': 'Citarik', 'hp': '0814-3000-2003', 'peran': 'Anggota'},
    {'nama': 'Yuli Astuti', 'kecamatan': 'Parungkuda', 'desa': 'Sundawenang', 'hp': '0814-3000-2004', 'peran': 'Anggota'},
]

RKI_SEED = [
    {'nama': 'H. Slamet Riyadi', 'jabatan': 'Ketua RKI', 'kecamatan': 'Cikembar', 'desa': 'Mekarjaya', 'hp': '0815-4000-3001'},
    {'nama': 'Rian Firmansyah', 'jabatan': 'Sekretaris', 'kecamatan': 'Cisaat', 'desa': 'Sukamaju', 'hp': '0815-4000-3002'},
    {'nama': 'Ade Sudrajat', 'jabatan': 'Anggota', 'kecamatan': 'Palabuhanratu', 'desa': 'Citarik', 'hp': '0815-4000-3003'},
    {'nama': 'Ela Nurlela', 'jabatan': 'Anggota', 'kecamatan': 'Nagrak', 'desa': 'Cisarua', 'hp': '0815-4000-3004'},
]

async def seed():
    # USERS
    await db.users.delete_many({})
    for u in DEMO_USERS:
        doc = {**u, 'id': uid(), 'hashed_password': hash_password('admin123'), 'created_at': datetime.utcnow()}
        await db.users.insert_one(doc)
    print(f"Seeded {len(DEMO_USERS)} users")

    for coll, data in [
        ('simpatisan', SIMPATISAN_SEED), ('kader', KADER_SEED), ('saksi', SAKSI_SEED),
        ('pengurus_dpc', DPC_SEED), ('pengurus_dpra', DPRA_SEED), ('pelopor', PELOPOR_SEED), ('rki', RKI_SEED),
    ]:
        await db[coll].delete_many({})
        for item in data:
            await db[coll].insert_one({**item, 'id': uid(), 'tanggal': datetime.utcnow()})
        print(f"Seeded {len(data)} {coll}")

    print("Done!")

if __name__ == '__main__':
    asyncio.run(seed())
