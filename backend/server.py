from fastapi import FastAPI, APIRouter, Depends, HTTPException, UploadFile, File, status, Query
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Optional
from datetime import datetime, timedelta
import io
import openpyxl

from models import (
    LoginRequest, TokenResponse, UserOut,
    Simpatisan, SimpatisanBase, Kader, KaderBase, Saksi, SaksiBase,
    WilayahTarget, WilayahTargetBase, uid
)
from auth import (
    hash_password, verify_password, create_access_token, get_current_user
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="SiPekaeS API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# -------- helper --------
def clean(doc):
    if doc:
        doc.pop('_id', None)
        doc.pop('hashed_password', None)
    return doc

def clean_list(items):
    return [clean(d) for d in items]

def area_filter(current: dict):
    """Return Mongo filter based on user role for koordinator/saksi."""
    role = current.get('role')
    if role in ('super_admin', 'admin_pusat', 'admin_input'):
        return {}
    # koordinator or saksi: fetch profile
    return None  # will be resolved async via helper below

async def get_area_filter(current: dict):
    role = current.get('role')
    if role in ('super_admin', 'admin_pusat', 'admin_input'):
        return {}
    user = await db.users.find_one({"username": current['sub']})
    if not user:
        return {}
    q = {}
    if role == 'koordinator':
        if user.get('kecamatan_kerja'): q['kecamatan'] = user['kecamatan_kerja']
        if user.get('desa_kerja'): q['desa'] = user['desa_kerja']
    elif role == 'saksi':
        if user.get('kecamatan_kerja'): q['kecamatan'] = user['kecamatan_kerja']
        if user.get('tps_kerja'): q['tps'] = user['tps_kerja']
    return q

# ================ ROOT ================
@api_router.get("/")
async def root():
    return {"message": "SiPekaeS API v2.0"}

# ================ AUTH ================
@api_router.post("/auth/login", response_model=TokenResponse)
async def login(payload: LoginRequest):
    user = await db.users.find_one({"username": payload.username})
    if not user or not verify_password(payload.password, user['hashed_password']):
        raise HTTPException(status_code=401, detail="Username atau password salah")
    token = create_access_token({"sub": user['username'], "id": user['id'], "role": user['role']})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": UserOut(
            id=user['id'], username=user['username'], name=user['name'],
            role=user['role'], roleLabel=user.get('roleLabel'), avatar=user.get('avatar'),
            kecamatan_kerja=user.get('kecamatan_kerja', ''),
            desa_kerja=user.get('desa_kerja', ''),
            tps_kerja=user.get('tps_kerja', ''),
        )
    }

@api_router.get("/auth/me", response_model=UserOut)
async def me(current=Depends(get_current_user)):
    user = await db.users.find_one({"username": current['sub']})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserOut(
        id=user['id'], username=user['username'], name=user['name'],
        role=user['role'], roleLabel=user.get('roleLabel'), avatar=user.get('avatar'),
        kecamatan_kerja=user.get('kecamatan_kerja', ''),
        desa_kerja=user.get('desa_kerja', ''),
        tps_kerja=user.get('tps_kerja', ''),
    )

@api_router.get("/users", response_model=List[UserOut])
async def list_users(current=Depends(get_current_user)):
    users = await db.users.find().to_list(1000)
    return [UserOut(
        id=u['id'], username=u['username'], name=u['name'],
        role=u['role'], roleLabel=u.get('roleLabel'), avatar=u.get('avatar'),
        kecamatan_kerja=u.get('kecamatan_kerja', ''),
        desa_kerja=u.get('desa_kerja', ''),
        tps_kerja=u.get('tps_kerja', ''),
    ) for u in users]

# ================ CRUD Simpatisan / Kader / Saksi ================
def make_crud(prefix: str, collection: str, base_model, full_model):
    router = APIRouter()

    @router.get(f"/{prefix}")
    async def list_items(current=Depends(get_current_user)):
        q = await get_area_filter(current)
        items = await db[collection].find(q).sort("tanggal", -1).to_list(10000)
        return clean_list(items)

    @router.post(f"/{prefix}")
    async def create_item(data: base_model, current=Depends(get_current_user)):
        doc = full_model(**data.dict()).dict()
        await db[collection].insert_one(doc.copy())
        return clean(doc)

    @router.get(f"/{prefix}/{{item_id}}")
    async def get_item(item_id: str, current=Depends(get_current_user)):
        doc = await db[collection].find_one({"id": item_id})
        if not doc:
            raise HTTPException(status_code=404, detail="Not found")
        return clean(doc)

    @router.put(f"/{prefix}/{{item_id}}")
    async def update_item(item_id: str, data: base_model, current=Depends(get_current_user)):
        result = await db[collection].update_one({"id": item_id}, {"$set": data.dict()})
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Not found")
        doc = await db[collection].find_one({"id": item_id})
        return clean(doc)

    @router.delete(f"/{prefix}/{{item_id}}")
    async def delete_item(item_id: str, current=Depends(get_current_user)):
        result = await db[collection].delete_one({"id": item_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Not found")
        return {"ok": True}

    return router

api_router.include_router(make_crud("simpatisan", "simpatisan", SimpatisanBase, Simpatisan))
api_router.include_router(make_crud("kader", "kader", KaderBase, Kader))
api_router.include_router(make_crud("saksi", "saksi", SaksiBase, Saksi))

# ================ AGGREGATED ORGANISASI ================
@api_router.get("/organisasi/{jenis}")
async def get_organisasi(jenis: str, current=Depends(get_current_user)):
    """Aggregate people from simpatisan+kader+saksi where they have specific organizational role flag."""
    flag_map = {
        'dpc': ('is_pengurus_dpc', 'jabatan_dpc'),
        'dpra': ('is_pengurus_dpra', 'jabatan_dpra'),
        'pelopor': ('is_pelopor', 'peran_pelopor'),
        'rki': ('is_rki', 'jabatan_rki'),
    }
    if jenis not in flag_map:
        raise HTTPException(status_code=404, detail="Jenis organisasi tidak dikenali")
    flag_field, jabatan_field = flag_map[jenis]
    base_area = await get_area_filter(current)
    q = {**base_area, flag_field: True}
    result = []
    for coll_name, source_label in [("simpatisan", "Simpatisan"), ("kader", "Kader"), ("saksi", "Saksi")]:
        async for d in db[coll_name].find(q):
            d.pop('_id', None)
            d['source_type'] = coll_name
            d['source_label'] = source_label
            d['jabatan_organisasi'] = d.get(jabatan_field, '')
            result.append(d)
    # sort by nama
    result.sort(key=lambda x: (x.get('nama') or '').lower())
    return result

# ================ WILAYAH TARGET ================
@api_router.get("/wilayah-target")
async def list_wilayah_target(current=Depends(get_current_user)):
    items = await db.wilayah_target.find().sort("kecamatan", 1).to_list(1000)
    return clean_list(items)

@api_router.post("/wilayah-target")
async def create_wilayah_target(data: WilayahTargetBase, current=Depends(get_current_user)):
    existing = await db.wilayah_target.find_one({"kecamatan": data.kecamatan})
    if existing:
        await db.wilayah_target.update_one(
            {"kecamatan": data.kecamatan},
            {"$set": {**data.dict(), "updated_at": datetime.utcnow()}}
        )
        doc = await db.wilayah_target.find_one({"kecamatan": data.kecamatan})
        return clean(doc)
    doc = WilayahTarget(**data.dict()).dict()
    await db.wilayah_target.insert_one(doc.copy())
    return clean(doc)

@api_router.put("/wilayah-target/{item_id}")
async def update_wilayah_target(item_id: str, data: WilayahTargetBase, current=Depends(get_current_user)):
    result = await db.wilayah_target.update_one(
        {"id": item_id},
        {"$set": {**data.dict(), "updated_at": datetime.utcnow()}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    doc = await db.wilayah_target.find_one({"id": item_id})
    return clean(doc)

@api_router.delete("/wilayah-target/{item_id}")
async def delete_wilayah_target(item_id: str, current=Depends(get_current_user)):
    result = await db.wilayah_target.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return {"ok": True}

# ================ STATS ================
@api_router.get("/stats/summary")
async def stats_summary(current=Depends(get_current_user)):
    area = await get_area_filter(current)
    total_simpatisan = await db.simpatisan.count_documents(area)
    total_kader = await db.kader.count_documents(area)
    total_saksi = await db.saksi.count_documents(area)

    total_dpc = 0
    total_dpra = 0
    total_pelopor = 0
    total_rki = 0
    for coll_name in ("simpatisan", "kader", "saksi"):
        total_dpc += await db[coll_name].count_documents({**area, "is_pengurus_dpc": True})
        total_dpra += await db[coll_name].count_documents({**area, "is_pengurus_dpra": True})
        total_pelopor += await db[coll_name].count_documents({**area, "is_pelopor": True})
        total_rki += await db[coll_name].count_documents({**area, "is_rki": True})

    # RW tercover
    rw_set = set()
    for coll_name in ("simpatisan", "kader", "saksi"):
        async for d in db[coll_name].find({**area, "rw": {"$nin": ["", None]}}, {"kecamatan":1, "desa":1, "rw":1}):
            rw_set.add(f"{d.get('kecamatan')}|{d.get('desa')}|{d.get('rw')}")

    rw_tercover = len(rw_set)
    rw_total = 3000

    # Aggregate baseline/target from wilayah_target
    total_baseline = 0
    total_target = 0
    total_realisasi = 0
    async for w in db.wilayah_target.find():
        total_baseline += w.get('baseline', 0) or 0
        total_target += w.get('target', 0) or 0
        total_realisasi += w.get('realisasi', 0) or 0

    # growth (last 30 days)
    since = datetime.utcnow() - timedelta(days=30)
    growth_simpatisan = await db.simpatisan.count_documents({**area, "tanggal": {"$gte": since}})
    growth_kader = await db.kader.count_documents({**area, "tanggal": {"$gte": since}})
    growth_saksi = await db.saksi.count_documents({**area, "tanggal": {"$gte": since}})

    return {
        "simpatisan": {"value": total_simpatisan, "growth": growth_simpatisan},
        "kader": {"value": total_kader, "growth": growth_kader},
        "saksi": {"value": total_saksi, "growth": growth_saksi},
        "pengurus_dpc": total_dpc,
        "pengurus_dpra": total_dpra,
        "pelopor": total_pelopor,
        "rki": total_rki,
        "rw": {"value": rw_tercover, "total": rw_total, "tercover": round((rw_tercover / rw_total) * 100, 1) if rw_total else 0},
        "kecamatan": 47,
        "desa": 381,
        "baseline": total_baseline,
        "target": total_target if total_target else 1,
        "realisasi": total_realisasi,
    }

@api_router.get("/stats/per-kecamatan")
async def stats_per_kecamatan(current=Depends(get_current_user)):
    result = {}
    for coll_name, key in [("simpatisan", "simpatisan"), ("kader", "kader"), ("saksi", "saksi")]:
        async for row in db[coll_name].aggregate([{"$group": {"_id": "$kecamatan", "count": {"$sum": 1}}}]):
            kec = row['_id']
            if kec:
                result.setdefault(kec, {}).update({key: row['count']})
    # merge with wilayah_target
    async for w in db.wilayah_target.find():
        kec = w.get('kecamatan')
        if kec:
            result.setdefault(kec, {}).update({
                "baseline": w.get('baseline', 0),
                "target": w.get('target', 0),
                "realisasi": w.get('realisasi', 0),
            })
    return result

# ================ EXCEL IMPORT / EXPORT ================
@api_router.get("/simpatisan/template/excel")
async def download_template(current=Depends(get_current_user)):
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Template Simpatisan"
    headers = ["nama", "nik", "hp", "kecamatan", "desa", "rw", "rt", "alamat"]
    ws.append(headers)
    ws.append(["Contoh Nama", "3202010000000001", "081234567890", "Cikembar", "Mekarjaya", "RW 04", "RT 02", "Jl. Contoh No. 1"])
    for col in ws.columns:
        max_len = max(len(str(c.value or "")) for c in col)
        ws.column_dimensions[col[0].column_letter].width = max(max_len + 2, 12)
    buf = io.BytesIO()
    wb.save(buf); buf.seek(0)
    return StreamingResponse(
        buf,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=template_simpatisan.xlsx"}
    )

@api_router.post("/simpatisan/import/excel")
async def import_excel(file: UploadFile = File(...), current=Depends(get_current_user)):
    if not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="File harus berformat Excel (.xlsx)")
    content = await file.read()
    try:
        wb = openpyxl.load_workbook(io.BytesIO(content), data_only=True)
        ws = wb.active
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Gagal membaca file: {str(e)}")

    rows = list(ws.iter_rows(values_only=True))
    if len(rows) < 2:
        raise HTTPException(status_code=400, detail="File kosong")

    headers = [str(h).lower().strip() if h else "" for h in rows[0]]
    for r in ('nama', 'kecamatan'):
        if r not in headers:
            raise HTTPException(status_code=400, detail=f"Kolom '{r}' wajib ada")

    inserted = 0
    errors = []
    docs = []
    for i, row in enumerate(rows[1:], start=2):
        if not any(row): continue
        try:
            data = {}
            for h, v in zip(headers, row):
                if h and v is not None: data[h] = str(v).strip()
            if not data.get('nama') or not data.get('kecamatan'):
                errors.append(f"Baris {i}: nama/kecamatan kosong"); continue
            doc = Simpatisan(
                nama=data.get('nama',''), nik=data.get('nik',''), hp=data.get('hp',''),
                kecamatan=data.get('kecamatan',''), desa=data.get('desa',''),
                rw=data.get('rw',''), rt=data.get('rt',''), alamat=data.get('alamat',''),
                status='aktif',
            ).dict()
            docs.append(doc); inserted += 1
        except Exception as e:
            errors.append(f"Baris {i}: {str(e)}")

    if docs: await db.simpatisan.insert_many(docs)
    return {"inserted": inserted, "errors": errors[:20], "total_errors": len(errors)}

# ================ Include router ================
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown():
    client.close()
