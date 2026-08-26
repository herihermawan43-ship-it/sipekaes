from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid

def uid():
    return str(uuid.uuid4())

# ============ AUTH ============
class UserBase(BaseModel):
    username: str
    name: str
    role: str  # super_admin, admin_pusat, admin_input, koordinator, saksi
    roleLabel: Optional[str] = None
    avatar: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: str

class UserInDB(UserBase):
    id: str = Field(default_factory=uid)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

# ============ SIMPATISAN ============
class SimpatisanBase(BaseModel):
    nama: str
    nik: Optional[str] = ""
    hp: Optional[str] = ""
    kecamatan: str
    desa: Optional[str] = ""
    rw: Optional[str] = ""
    rt: Optional[str] = ""
    alamat: Optional[str] = ""
    status: str = "aktif"

class Simpatisan(SimpatisanBase):
    id: str = Field(default_factory=uid)
    tanggal: datetime = Field(default_factory=datetime.utcnow)

# ============ KADER ============
class KaderBase(BaseModel):
    nama: str
    jabatan: str
    kecamatan: str
    desa: Optional[str] = ""
    rw: Optional[str] = ""
    hp: Optional[str] = ""
    alamat: Optional[str] = ""

class Kader(KaderBase):
    id: str = Field(default_factory=uid)
    tanggal: datetime = Field(default_factory=datetime.utcnow)

# ============ SAKSI ============
class SaksiBase(BaseModel):
    nama: str
    tps: str
    kecamatan: str
    desa: Optional[str] = ""
    rw: Optional[str] = ""
    hp: Optional[str] = ""
    status: str = "pending"  # pending / terverifikasi

class Saksi(SaksiBase):
    id: str = Field(default_factory=uid)
    tanggal: datetime = Field(default_factory=datetime.utcnow)

# ============ PENGURUS DPC ============
class PengurusDPCBase(BaseModel):
    nama: str
    jabatan: str  # Ketua, Sekretaris, Bendahara, Kaderisasi, Humas, dll
    hp: Optional[str] = ""
    alamat: Optional[str] = ""
    foto: Optional[str] = ""

class PengurusDPC(PengurusDPCBase):
    id: str = Field(default_factory=uid)
    tanggal: datetime = Field(default_factory=datetime.utcnow)

# ============ PENGURUS DPRA ============
class PengurusDPRABase(BaseModel):
    nama: str
    jabatan: str
    kecamatan: str
    desa: str
    hp: Optional[str] = ""
    kategori: str = "kader"  # kader / simpatisan

class PengurusDPRA(PengurusDPRABase):
    id: str = Field(default_factory=uid)
    tanggal: datetime = Field(default_factory=datetime.utcnow)

# ============ ANGGOTA PELOPOR ============
class PeloporBase(BaseModel):
    nama: str
    kecamatan: str
    desa: Optional[str] = ""
    hp: Optional[str] = ""
    peran: Optional[str] = "Anggota"

class Pelopor(PeloporBase):
    id: str = Field(default_factory=uid)
    tanggal: datetime = Field(default_factory=datetime.utcnow)

# ============ ANGGOTA RKI ============
class RKIBase(BaseModel):
    nama: str
    jabatan: Optional[str] = "Anggota"
    kecamatan: str
    desa: Optional[str] = ""
    hp: Optional[str] = ""

class RKI(RKIBase):
    id: str = Field(default_factory=uid)
    tanggal: datetime = Field(default_factory=datetime.utcnow)
