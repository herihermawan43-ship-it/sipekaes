#!/usr/bin/env python3
"""
Backend API Testing for SiPekaeS - NEW/UPDATED endpoints only
Tests: Login with new password, role-based filtering, organisasi aggregation, wilayah target CRUD, stats with new fields
"""
import requests
import json
import sys
from pathlib import Path

# Read backend URL from frontend/.env
env_file = Path('/app/frontend/.env')
BACKEND_URL = None
for line in env_file.read_text().splitlines():
    if line.startswith('REACT_APP_BACKEND_URL='):
        BACKEND_URL = line.split('=', 1)[1].strip()
        break

if not BACKEND_URL:
    print("❌ REACT_APP_BACKEND_URL not found in /app/frontend/.env")
    sys.exit(1)

BASE_URL = f"{BACKEND_URL}/api"
print(f"🔗 Testing backend at: {BASE_URL}\n")

# Test counters
passed = 0
failed = 0
test_results = []

def test(name, condition, details=""):
    global passed, failed
    if condition:
        passed += 1
        print(f"✅ {name}")
        test_results.append({"name": name, "status": "PASS", "details": details})
    else:
        failed += 1
        print(f"❌ {name}")
        if details:
            print(f"   Details: {details}")
        test_results.append({"name": name, "status": "FAIL", "details": details})

def login(username, password):
    """Helper to login and return token"""
    try:
        r = requests.post(f"{BASE_URL}/auth/login", json={"username": username, "password": password}, timeout=10)
        if r.status_code == 200:
            return r.json().get('access_token')
        return None
    except Exception as e:
        return None

print("=" * 80)
print("TEST 1: Login super admin with NEW password")
print("=" * 80)

# Test 1.1: Login with NEW password should succeed
r = requests.post(f"{BASE_URL}/auth/login", json={"username": "superadmin", "password": "SiPekaeS@2025"}, timeout=10)
test(
    "Login superadmin with NEW password (SiPekaeS@2025)",
    r.status_code == 200 and 'access_token' in r.json(),
    f"Status: {r.status_code}, Response: {r.json() if r.status_code == 200 else r.text}"
)
if r.status_code == 200:
    superadmin_token = r.json()['access_token']
    user = r.json().get('user', {})
    test(
        "Superadmin user object returned with role=super_admin",
        user.get('role') == 'super_admin' and user.get('username') == 'superadmin',
        f"User: {user}"
    )
else:
    print(f"   ⚠️  Cannot proceed with superadmin tests - login failed")
    superadmin_token = None

# Test 1.2: Login with OLD password should FAIL
r = requests.post(f"{BASE_URL}/auth/login", json={"username": "superadmin", "password": "admin123"}, timeout=10)
test(
    "Login superadmin with OLD password (admin123) should FAIL with 401",
    r.status_code == 401,
    f"Status: {r.status_code}, Response: {r.text[:200]}"
)

print("\n" + "=" * 80)
print("TEST 2: Role-based area filtering")
print("=" * 80)

# Test 2.1: Login as koordinator (kecamatan_kerja='Cikembar')
koordinator_token = login("koordinator", "admin123")
test(
    "Login koordinator/admin123",
    koordinator_token is not None,
    f"Token: {'obtained' if koordinator_token else 'failed'}"
)

if koordinator_token:
    headers = {"Authorization": f"Bearer {koordinator_token}"}
    r = requests.get(f"{BASE_URL}/simpatisan", headers=headers, timeout=10)
    test(
        "GET /api/simpatisan as koordinator returns 200",
        r.status_code == 200,
        f"Status: {r.status_code}"
    )
    if r.status_code == 200:
        items = r.json()
        # Check all items have kecamatan='Cikembar'
        all_cikembar = all(item.get('kecamatan') == 'Cikembar' for item in items)
        test(
            "All simpatisan items filtered to kecamatan='Cikembar'",
            all_cikembar,
            f"Total items: {len(items)}, Sample: {items[0] if items else 'empty'}"
        )

# Test 2.2: Login as saksi (kecamatan_kerja='Cikembar', tps_kerja='TPS 01')
saksi_token = login("saksi", "admin123")
test(
    "Login saksi/admin123",
    saksi_token is not None,
    f"Token: {'obtained' if saksi_token else 'failed'}"
)

if saksi_token:
    headers = {"Authorization": f"Bearer {saksi_token}"}
    r = requests.get(f"{BASE_URL}/saksi", headers=headers, timeout=10)
    test(
        "GET /api/saksi as saksi returns 200",
        r.status_code == 200,
        f"Status: {r.status_code}"
    )
    if r.status_code == 200:
        items = r.json()
        # Check all items have kecamatan='Cikembar' AND tps='TPS 01'
        all_filtered = all(
            item.get('kecamatan') == 'Cikembar' and item.get('tps') == 'TPS 01'
            for item in items
        )
        test(
            "All saksi items filtered to kecamatan='Cikembar' AND tps='TPS 01'",
            all_filtered,
            f"Total items: {len(items)}, Sample: {items[0] if items else 'empty'}"
        )

print("\n" + "=" * 80)
print("TEST 3: Organisasi aggregation endpoints")
print("=" * 80)

if not superadmin_token:
    print("⚠️  Skipping organisasi tests - no superadmin token")
else:
    headers = {"Authorization": f"Bearer {superadmin_token}"}
    
    # Test 3.1: GET /api/organisasi/dpc
    r = requests.get(f"{BASE_URL}/organisasi/dpc", headers=headers, timeout=10)
    test(
        "GET /api/organisasi/dpc returns 200",
        r.status_code == 200,
        f"Status: {r.status_code}"
    )
    if r.status_code == 200:
        items = r.json()
        test(
            "DPC list is not empty",
            len(items) > 0,
            f"Total items: {len(items)}"
        )
        if items:
            first = items[0]
            has_required_fields = all(
                field in first for field in ['source_type', 'source_label', 'jabatan_organisasi']
            )
            test(
                "DPC items have source_type, source_label, jabatan_organisasi fields",
                has_required_fields,
                f"Sample item keys: {list(first.keys())}"
            )
    
    # Test 3.2: GET /api/organisasi/dpra
    r = requests.get(f"{BASE_URL}/organisasi/dpra", headers=headers, timeout=10)
    test(
        "GET /api/organisasi/dpra returns 200",
        r.status_code == 200,
        f"Status: {r.status_code}"
    )
    if r.status_code == 200:
        items = r.json()
        test(
            "DPRA list is not empty",
            len(items) > 0,
            f"Total items: {len(items)}"
        )
    
    # Test 3.3: GET /api/organisasi/pelopor
    r = requests.get(f"{BASE_URL}/organisasi/pelopor", headers=headers, timeout=10)
    test(
        "GET /api/organisasi/pelopor returns 200",
        r.status_code == 200,
        f"Status: {r.status_code}"
    )
    if r.status_code == 200:
        items = r.json()
        test(
            "Pelopor list is not empty",
            len(items) > 0,
            f"Total items: {len(items)}"
        )
    
    # Test 3.4: GET /api/organisasi/rki
    r = requests.get(f"{BASE_URL}/organisasi/rki", headers=headers, timeout=10)
    test(
        "GET /api/organisasi/rki returns 200",
        r.status_code == 200,
        f"Status: {r.status_code}"
    )
    if r.status_code == 200:
        items = r.json()
        test(
            "RKI list is not empty",
            len(items) > 0,
            f"Total items: {len(items)}"
        )
    
    # Test 3.5: GET /api/organisasi/xyz should return 404
    r = requests.get(f"{BASE_URL}/organisasi/xyz", headers=headers, timeout=10)
    test(
        "GET /api/organisasi/xyz returns 404",
        r.status_code == 404,
        f"Status: {r.status_code}"
    )

print("\n" + "=" * 80)
print("TEST 4: Wilayah Target CRUD")
print("=" * 80)

if not superadmin_token:
    print("⚠️  Skipping wilayah target tests - no superadmin token")
else:
    headers = {"Authorization": f"Bearer {superadmin_token}"}
    
    # Test 4.1: GET /api/wilayah-target
    r = requests.get(f"{BASE_URL}/wilayah-target", headers=headers, timeout=10)
    test(
        "GET /api/wilayah-target returns 200",
        r.status_code == 200,
        f"Status: {r.status_code}"
    )
    if r.status_code == 200:
        items = r.json()
        test(
            "Wilayah target list has 15 seeded kecamatan",
            len(items) == 15,
            f"Total items: {len(items)}"
        )
        if items:
            first = items[0]
            has_fields = all(
                field in first for field in ['kecamatan', 'baseline', 'target', 'realisasi']
            )
            test(
                "Wilayah target items have baseline/target/realisasi fields",
                has_fields,
                f"Sample item: {first}"
            )
    
    # Test 4.2: POST /api/wilayah-target (create new)
    new_data = {"kecamatan": "TestKec", "baseline": 100, "target": 500, "realisasi": 200}
    r = requests.post(f"{BASE_URL}/wilayah-target", json=new_data, headers=headers, timeout=10)
    test(
        "POST /api/wilayah-target creates new item",
        r.status_code == 200 and 'id' in r.json(),
        f"Status: {r.status_code}, Response: {r.json() if r.status_code == 200 else r.text[:200]}"
    )
    created_id = None
    if r.status_code == 200:
        created_id = r.json().get('id')
        doc = r.json()
        test(
            "Created item has correct data",
            doc.get('kecamatan') == 'TestKec' and doc.get('baseline') == 100,
            f"Doc: {doc}"
        )
    
    # Test 4.3: POST again with same kecamatan (should UPDATE, not create duplicate)
    update_data = {"kecamatan": "TestKec", "baseline": 150, "target": 600, "realisasi": 250}
    r = requests.post(f"{BASE_URL}/wilayah-target", json=update_data, headers=headers, timeout=10)
    test(
        "POST /api/wilayah-target with same kecamatan updates (upsert)",
        r.status_code == 200 and r.json().get('baseline') == 150,
        f"Status: {r.status_code}, Response: {r.json() if r.status_code == 200 else r.text[:200]}"
    )
    
    # Verify no duplicate created
    r = requests.get(f"{BASE_URL}/wilayah-target", headers=headers, timeout=10)
    if r.status_code == 200:
        items = r.json()
        testkec_count = sum(1 for item in items if item.get('kecamatan') == 'TestKec')
        test(
            "No duplicate TestKec created (only 1 exists)",
            testkec_count == 1,
            f"TestKec count: {testkec_count}"
        )
    
    # Test 4.4: PUT /api/wilayah-target/{id}
    if created_id:
        put_data = {"kecamatan": "TestKec", "baseline": 200, "target": 700, "realisasi": 300}
        r = requests.put(f"{BASE_URL}/wilayah-target/{created_id}", json=put_data, headers=headers, timeout=10)
        test(
            "PUT /api/wilayah-target/{id} updates item",
            r.status_code == 200 and r.json().get('baseline') == 200,
            f"Status: {r.status_code}, Response: {r.json() if r.status_code == 200 else r.text[:200]}"
        )
    
    # Test 4.5: DELETE /api/wilayah-target/{id}
    if created_id:
        r = requests.delete(f"{BASE_URL}/wilayah-target/{created_id}", headers=headers, timeout=10)
        test(
            "DELETE /api/wilayah-target/{id} returns 200 {ok:true}",
            r.status_code == 200 and r.json().get('ok') == True,
            f"Status: {r.status_code}, Response: {r.json() if r.status_code == 200 else r.text[:200]}"
        )

print("\n" + "=" * 80)
print("TEST 5: Stats summary with new fields")
print("=" * 80)

if not superadmin_token:
    print("⚠️  Skipping stats tests - no superadmin token")
else:
    headers = {"Authorization": f"Bearer {superadmin_token}"}
    r = requests.get(f"{BASE_URL}/stats/summary", headers=headers, timeout=10)
    test(
        "GET /api/stats/summary returns 200",
        r.status_code == 200,
        f"Status: {r.status_code}"
    )
    if r.status_code == 200:
        stats = r.json()
        has_org_counts = all(
            field in stats for field in ['pengurus_dpc', 'pengurus_dpra', 'pelopor', 'rki']
        )
        test(
            "Stats has pengurus_dpc, pengurus_dpra, pelopor, rki counts",
            has_org_counts,
            f"Stats keys: {list(stats.keys())}"
        )
        
        has_wilayah_fields = all(
            field in stats for field in ['baseline', 'target', 'realisasi']
        )
        test(
            "Stats has baseline, target, realisasi aggregated from wilayah_target",
            has_wilayah_fields,
            f"baseline={stats.get('baseline')}, target={stats.get('target')}, realisasi={stats.get('realisasi')}"
        )
        
        # Verify counts are > 0 (from seeded data)
        test(
            "Organizational counts are > 0",
            stats.get('pengurus_dpc', 0) > 0 and stats.get('pengurus_dpra', 0) > 0,
            f"DPC={stats.get('pengurus_dpc')}, DPRA={stats.get('pengurus_dpra')}, Pelopor={stats.get('pelopor')}, RKI={stats.get('rki')}"
        )

print("\n" + "=" * 80)
print("TEST 6: Simpatisan with keanggotaan flags")
print("=" * 80)

if not superadmin_token:
    print("⚠️  Skipping simpatisan keanggotaan tests - no superadmin token")
else:
    headers = {"Authorization": f"Bearer {superadmin_token}"}
    
    # Test 6.1: POST /api/simpatisan with keanggotaan flags
    new_simpatisan = {
        "nama": "Test User Keanggotaan",
        "kecamatan": "Cikembar",
        "is_pengurus_dpc": True,
        "jabatan_dpc": "Ketua"
    }
    r = requests.post(f"{BASE_URL}/simpatisan", json=new_simpatisan, headers=headers, timeout=10)
    test(
        "POST /api/simpatisan with is_pengurus_dpc=True, jabatan_dpc='Ketua'",
        r.status_code == 200 and 'id' in r.json(),
        f"Status: {r.status_code}, Response: {r.json() if r.status_code == 200 else r.text[:200]}"
    )
    
    if r.status_code == 200:
        created = r.json()
        test(
            "Created simpatisan has keanggotaan fields",
            created.get('is_pengurus_dpc') == True and created.get('jabatan_dpc') == 'Ketua',
            f"is_pengurus_dpc={created.get('is_pengurus_dpc')}, jabatan_dpc={created.get('jabatan_dpc')}"
        )
        
        # Test 6.2: GET /api/organisasi/dpc should include this new user
        r = requests.get(f"{BASE_URL}/organisasi/dpc", headers=headers, timeout=10)
        if r.status_code == 200:
            dpc_list = r.json()
            found = any(item.get('nama') == 'Test User Keanggotaan' for item in dpc_list)
            test(
                "GET /api/organisasi/dpc includes newly created simpatisan with is_pengurus_dpc=True",
                found,
                f"Found in DPC list: {found}, Total DPC members: {len(dpc_list)}"
            )

print("\n" + "=" * 80)
print("TEST SUMMARY")
print("=" * 80)
print(f"✅ Passed: {passed}")
print(f"❌ Failed: {failed}")
print(f"📊 Total: {passed + failed}")
print("=" * 80)

if failed > 0:
    print("\n⚠️  FAILED TESTS:")
    for result in test_results:
        if result['status'] == 'FAIL':
            print(f"  ❌ {result['name']}")
            if result['details']:
                print(f"     {result['details']}")
    sys.exit(1)
else:
    print("\n🎉 ALL TESTS PASSED!")
    sys.exit(0)
