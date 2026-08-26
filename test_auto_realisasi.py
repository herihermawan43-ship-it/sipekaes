#!/usr/bin/env python3
"""
Test Auto-Computed Realisasi Feature for SiPekaeS
Tests that realisasi in wilayah-target is now AUTO-computed from unique member counts
"""
import requests
from pathlib import Path
from dotenv import load_dotenv
import os

# Load environment
load_dotenv(Path('/app/frontend/.env'))
BASE_URL = os.getenv('REACT_APP_BACKEND_URL', 'http://localhost:8001')
API_URL = f"{BASE_URL}/api"

print(f"🔗 Testing API at: {API_URL}\n")

# Test counters
total_tests = 0
passed_tests = 0
failed_tests = []

def test(name, condition, error_msg=""):
    global total_tests, passed_tests
    total_tests += 1
    if condition:
        passed_tests += 1
        print(f"✅ {name}")
        return True
    else:
        failed_tests.append(f"{name}: {error_msg}")
        print(f"❌ {name}: {error_msg}")
        return False

def login(username, password):
    """Login and return token"""
    resp = requests.post(f"{API_URL}/auth/login", json={"username": username, "password": password})
    if resp.status_code == 200:
        data = resp.json()
        return data.get('access_token')
    return None

def headers_with_token(token):
    return {"Authorization": f"Bearer {token}"}

# Login as superadmin
print("=" * 80)
print("AUTHENTICATION")
print("=" * 80)
token = login("superadmin", "SiPekaeS@2025")
test("Login as superadmin/SiPekaeS@2025", token is not None, "Login failed")

if not token:
    print("\n❌ CRITICAL: Cannot proceed without authentication")
    exit(1)

headers = headers_with_token(token)

print("\n" + "=" * 80)
print("TEST 1: GET /api/wilayah-target - Verify realisasi is AUTO-computed")
print("=" * 80)

# Get wilayah-target list
resp = requests.get(f"{API_URL}/wilayah-target", headers=headers)
test("1.1 GET /api/wilayah-target → 200", 
     resp.status_code == 200,
     f"Status: {resp.status_code}")

wilayah_targets = resp.json() if resp.status_code == 200 else []
test("1.2 wilayah-target list is not empty",
     len(wilayah_targets) > 0,
     f"Expected non-empty list, got {len(wilayah_targets)} items")

# Find Cikembar
cikembar = next((w for w in wilayah_targets if w.get('kecamatan') == 'Cikembar'), None)
test("1.3 Found 'Cikembar' in wilayah-target list",
     cikembar is not None,
     "Cikembar not found in wilayah-target")

if cikembar:
    cikembar_realisasi = cikembar.get('realisasi', 0)
    print(f"   📊 Current realisasi for Cikembar: {cikembar_realisasi}")
    
    # Get kecamatan-detail to verify auto-computation
    resp = requests.get(f"{API_URL}/stats/kecamatan-detail", headers=headers)
    test("1.4 GET /api/stats/kecamatan-detail → 200",
         resp.status_code == 200,
         f"Status: {resp.status_code}")
    
    kec_detail = resp.json() if resp.status_code == 200 else []
    cikembar_detail = next((k for k in kec_detail if k.get('kecamatan') == 'Cikembar'), None)
    
    test("1.5 Found 'Cikembar' in kecamatan-detail",
         cikembar_detail is not None,
         "Cikembar not found in kecamatan-detail")
    
    if cikembar_detail:
        total_unik = cikembar_detail.get('total_unik', 0)
        print(f"   📊 total_unik for Cikembar from kecamatan-detail: {total_unik}")
        
        test("1.6 realisasi in wilayah-target == total_unik in kecamatan-detail",
             cikembar_realisasi == total_unik,
             f"Expected {total_unik}, got {cikembar_realisasi}")

print("\n" + "=" * 80)
print("TEST 2: Auto-increment on new member")
print("=" * 80)

# Note current realisasi for Cikembar
resp = requests.get(f"{API_URL}/wilayah-target", headers=headers)
wilayah_targets = resp.json() if resp.status_code == 200 else []
cikembar = next((w for w in wilayah_targets if w.get('kecamatan') == 'Cikembar'), None)
old_realisasi = cikembar.get('realisasi', 0) if cikembar else 0
print(f"   📊 OLD realisasi for Cikembar: {old_realisasi}")

# Create new Kader in Cikembar
kader_payload = {
    "nama": "TestAutoReal",
    "nik": "88881234567890",
    "kecamatan": "Cikembar",
    "jabatan": "Kader Aktif"
}
resp = requests.post(f"{API_URL}/kader", json=kader_payload, headers=headers)
test("2.1 POST /api/kader with TestAutoReal → 200",
     resp.status_code == 200,
     f"Status: {resp.status_code}, Response: {resp.text}")

kader_id = resp.json().get('id') if resp.status_code == 200 else None

# Get wilayah-target again
resp = requests.get(f"{API_URL}/wilayah-target", headers=headers)
wilayah_targets = resp.json() if resp.status_code == 200 else []
cikembar = next((w for w in wilayah_targets if w.get('kecamatan') == 'Cikembar'), None)
new_realisasi_1 = cikembar.get('realisasi', 0) if cikembar else 0
print(f"   📊 NEW realisasi after adding Kader: {new_realisasi_1}")

test("2.2 realisasi incremented by 1 after adding Kader",
     new_realisasi_1 == old_realisasi + 1,
     f"Expected {old_realisasi + 1}, got {new_realisasi_1}")

# Create new Simpatisan in Cikembar
simpatisan_payload = {
    "nama": "TestSimpAuto",
    "nik": "99991234567890",
    "kecamatan": "Cikembar"
}
resp = requests.post(f"{API_URL}/simpatisan", json=simpatisan_payload, headers=headers)
test("2.3 POST /api/simpatisan with TestSimpAuto → 200",
     resp.status_code == 200,
     f"Status: {resp.status_code}, Response: {resp.text}")

simpatisan_id = resp.json().get('id') if resp.status_code == 200 else None

# Get wilayah-target again
resp = requests.get(f"{API_URL}/wilayah-target", headers=headers)
wilayah_targets = resp.json() if resp.status_code == 200 else []
cikembar = next((w for w in wilayah_targets if w.get('kecamatan') == 'Cikembar'), None)
new_realisasi_2 = cikembar.get('realisasi', 0) if cikembar else 0
print(f"   📊 NEW realisasi after adding Simpatisan: {new_realisasi_2}")

test("2.4 realisasi incremented by 2 total (Kader + Simpatisan)",
     new_realisasi_2 == old_realisasi + 2,
     f"Expected {old_realisasi + 2}, got {new_realisasi_2}")

# Cleanup: Delete test records
if kader_id:
    resp = requests.delete(f"{API_URL}/kader/{kader_id}", headers=headers)
    test("2.5 Cleanup: Delete TestAutoReal Kader",
         resp.status_code == 200,
         f"Status: {resp.status_code}")

if simpatisan_id:
    resp = requests.delete(f"{API_URL}/simpatisan/{simpatisan_id}", headers=headers)
    test("2.6 Cleanup: Delete TestSimpAuto Simpatisan",
         resp.status_code == 200,
         f"Status: {resp.status_code}")

print("\n" + "=" * 80)
print("TEST 3: Dedup preserved in auto-computed realisasi")
print("=" * 80)

# Get current realisasi
resp = requests.get(f"{API_URL}/wilayah-target", headers=headers)
wilayah_targets = resp.json() if resp.status_code == 200 else []
cikembar = next((w for w in wilayah_targets if w.get('kecamatan') == 'Cikembar'), None)
old_realisasi = cikembar.get('realisasi', 0) if cikembar else 0
print(f"   📊 OLD realisasi for Cikembar: {old_realisasi}")

# Create Kader with unique NIK
kader_payload = {
    "nama": "DedupTest",
    "nik": "77771234567890",
    "kecamatan": "Cikembar",
    "jabatan": "Kader Aktif"
}
resp = requests.post(f"{API_URL}/kader", json=kader_payload, headers=headers)
test("3.1 POST /api/kader with DedupTest → 200",
     resp.status_code == 200,
     f"Status: {resp.status_code}, Response: {resp.text}")

kader_id = resp.json().get('id') if resp.status_code == 200 else None

# Get realisasi after adding Kader
resp = requests.get(f"{API_URL}/wilayah-target", headers=headers)
wilayah_targets = resp.json() if resp.status_code == 200 else []
cikembar = next((w for w in wilayah_targets if w.get('kecamatan') == 'Cikembar'), None)
realisasi_after_kader = cikembar.get('realisasi', 0) if cikembar else 0
print(f"   📊 Realisasi after adding Kader: {realisasi_after_kader}")

test("3.2 realisasi incremented by 1 after adding Kader",
     realisasi_after_kader == old_realisasi + 1,
     f"Expected {old_realisasi + 1}, got {realisasi_after_kader}")

# Create Saksi with SAME NIK (should NOT increment due to dedup)
saksi_payload = {
    "nama": "DedupTest",
    "nik": "77771234567890",  # SAME NIK as Kader
    "kecamatan": "Cikembar",
    "tps": "TPS 99"
}
resp = requests.post(f"{API_URL}/saksi", json=saksi_payload, headers=headers)
test("3.3 POST /api/saksi with SAME NIK → 200",
     resp.status_code == 200,
     f"Status: {resp.status_code}, Response: {resp.text}")

saksi_id = resp.json().get('id') if resp.status_code == 200 else None

# Get realisasi after adding Saksi with same NIK
resp = requests.get(f"{API_URL}/wilayah-target", headers=headers)
wilayah_targets = resp.json() if resp.status_code == 200 else []
cikembar = next((w for w in wilayah_targets if w.get('kecamatan') == 'Cikembar'), None)
realisasi_after_saksi = cikembar.get('realisasi', 0) if cikembar else 0
print(f"   📊 Realisasi after adding Saksi with same NIK: {realisasi_after_saksi}")

test("3.4 realisasi DID NOT increment (dedup - same NIK counted once as Kader)",
     realisasi_after_saksi == realisasi_after_kader,
     f"Expected {realisasi_after_kader} (no change), got {realisasi_after_saksi}")

# Cleanup
if kader_id:
    resp = requests.delete(f"{API_URL}/kader/{kader_id}", headers=headers)
    test("3.5 Cleanup: Delete DedupTest Kader",
         resp.status_code == 200,
         f"Status: {resp.status_code}")

if saksi_id:
    resp = requests.delete(f"{API_URL}/saksi/{saksi_id}", headers=headers)
    test("3.6 Cleanup: Delete DedupTest Saksi",
         resp.status_code == 200,
         f"Status: {resp.status_code}")

print("\n" + "=" * 80)
print("TEST 4: /api/stats/summary total_realisasi matches sum")
print("=" * 80)

# Get stats/summary
resp = requests.get(f"{API_URL}/stats/summary", headers=headers)
test("4.1 GET /api/stats/summary → 200",
     resp.status_code == 200,
     f"Status: {resp.status_code}")

summary = resp.json() if resp.status_code == 200 else {}
summary_realisasi = summary.get('realisasi', 0)
print(f"   📊 total_realisasi from stats/summary: {summary_realisasi}")

# Get all wilayah-target and sum realisasi
resp = requests.get(f"{API_URL}/wilayah-target", headers=headers)
wilayah_targets = resp.json() if resp.status_code == 200 else []
sum_realisasi = sum(w.get('realisasi', 0) for w in wilayah_targets)
print(f"   📊 Sum of realisasi from all wilayah-target: {sum_realisasi}")

test("4.2 stats/summary realisasi == sum of wilayah-target realisasi",
     summary_realisasi == sum_realisasi,
     f"Expected {sum_realisasi}, got {summary_realisasi}")

print("\n" + "=" * 80)
print("TEST 5: PUT /api/wilayah-target ignores realisasi in payload")
print("=" * 80)

# Get Cikembar wilayah-target
resp = requests.get(f"{API_URL}/wilayah-target", headers=headers)
wilayah_targets = resp.json() if resp.status_code == 200 else []
cikembar = next((w for w in wilayah_targets if w.get('kecamatan') == 'Cikembar'), None)

if cikembar:
    cikembar_id = cikembar.get('id')
    old_baseline = cikembar.get('baseline', 0)
    old_target = cikembar.get('target', 0)
    old_realisasi = cikembar.get('realisasi', 0)
    print(f"   📊 OLD values: baseline={old_baseline}, target={old_target}, realisasi={old_realisasi}")
    
    # PUT with new baseline/target and realisasi=0 (should be ignored)
    update_payload = {
        "kecamatan": "Cikembar",
        "baseline": 999,
        "target": 9999,
        "realisasi": 0  # This should be IGNORED
    }
    resp = requests.put(f"{API_URL}/wilayah-target/{cikembar_id}", json=update_payload, headers=headers)
    test("5.1 PUT /api/wilayah-target/{id} with realisasi=0 → 200",
         resp.status_code == 200,
         f"Status: {resp.status_code}, Response: {resp.text}")
    
    # GET again to verify
    resp = requests.get(f"{API_URL}/wilayah-target", headers=headers)
    wilayah_targets = resp.json() if resp.status_code == 200 else []
    cikembar = next((w for w in wilayah_targets if w.get('kecamatan') == 'Cikembar'), None)
    
    if cikembar:
        new_baseline = cikembar.get('baseline', 0)
        new_target = cikembar.get('target', 0)
        new_realisasi = cikembar.get('realisasi', 0)
        print(f"   📊 NEW values: baseline={new_baseline}, target={new_target}, realisasi={new_realisasi}")
        
        test("5.2 baseline updated to 999",
             new_baseline == 999,
             f"Expected 999, got {new_baseline}")
        
        test("5.3 target updated to 9999",
             new_target == 9999,
             f"Expected 9999, got {new_target}")
        
        test("5.4 realisasi STILL auto-computed (not 0)",
             new_realisasi == old_realisasi,
             f"Expected {old_realisasi} (auto-computed), got {new_realisasi}")
        
        # Restore original values
        restore_payload = {
            "kecamatan": "Cikembar",
            "baseline": old_baseline,
            "target": old_target,
            "realisasi": 0  # Will be ignored anyway
        }
        resp = requests.put(f"{API_URL}/wilayah-target/{cikembar_id}", json=restore_payload, headers=headers)
        test("5.5 Restore original baseline/target values",
             resp.status_code == 200,
             f"Status: {resp.status_code}")

print("\n" + "=" * 80)
print("SUMMARY")
print("=" * 80)
print(f"Total tests: {total_tests}")
print(f"Passed: {passed_tests}")
print(f"Failed: {len(failed_tests)}")

if failed_tests:
    print("\n❌ FAILED TESTS:")
    for fail in failed_tests:
        print(f"  - {fail}")
    exit(1)
else:
    print("\n🎉 ALL AUTO-COMPUTED REALISASI TESTS PASSED!")
    exit(0)
