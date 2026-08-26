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
    kecamatan_kerja: Optional[str] = ""
    desa_kerja: Optional[str] = ""
    tps_kerja: Optional[str] = ""

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

# ============ Keanggotaan (embed dalam entitas) ============
class Keanggotaan(BaseModel):
    """Flag keanggotaan struktur organisasi - embedded di Simpatisan/Kader/Saksi."""
    is_pengurus_dpc: bool = False
    jabatan_dpc: Optional[str] = ""
    is_pengurus_dpra: bool = False
    jabatan_dpra: Optional[str] = ""
    is_pelopor: bool = False
    peran_pelopor: Optional[str] = ""
    is_rki: bool = False
    jabatan_rki: Optional[str] = ""

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
    # embedded keanggotaan
    is_pengurus_dpc: bool = False
    jabatan_dpc: Optional[str] = ""
    is_pengurus_dpra: bool = False
    jabatan_dpra: Optional[str] = ""
    is_pelopor: bool = False
    peran_pelopor: Optional[str] = ""
    is_rki: bool = False
    jabatan_rki: Optional[str] = ""

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
    # embedded keanggotaan
    is_pengurus_dpc: bool = False
    jabatan_dpc: Optional[str] = ""
    is_pengurus_dpra: bool = False
    jabatan_dpra: Optional[str] = ""
    is_pelopor: bool = False
    peran_pelopor: Optional[str] = ""
    is_rki: bool = False
    jabatan_rki: Optional[str] = ""

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
    alamat: Optional[str] = ""
    status: str = "pending"
    # embedded keanggotaan
    is_pengurus_dpc: bool = False
    jabatan_dpc: Optional[str] = ""
    is_pengurus_dpra: bool = False
    jabatan_dpra: Optional[str] = ""
    is_pelopor: bool = False
    peran_pelopor: Optional[str] = ""
    is_rki: bool = False
    jabatan_rki: Optional[str] = ""

class Saksi(SaksiBase):
    id: str = Field(default_factory=uid)
    tanggal: datetime = Field(default_factory=datetime.utcnow)

# ============ WILAYAH TARGET (baseline/target per kecamatan) ============
class WilayahTargetBase(BaseModel):
    kecamatan: str
    baseline: int = 0
    target: int = 0
    realisasi: int = 0

class WilayahTarget(WilayahTargetBase):
    id: str = Field(default_factory=uid)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
