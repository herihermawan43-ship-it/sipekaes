#!/usr/bin/env python3
"""
Quick Count Endpoints Testing for SiPekaeS
Tests all Quick Count CRUD operations, summary, role restrictions, and auth
"""
import requests
from pathlib import Path
from dotenv import load_dotenv
import os

# Load environment
load_dotenv(Path('/app/frontend/.env'))
BASE_URL = os.getenv('REACT_APP_BACKEND_URL', 'http://localhost:8001')
API_URL = f"{BASE_URL}/api"

print(f"🔗 Testing Quick Count API at: {API_URL}\n")

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

# Store created IDs for cleanup
created_ids = []

print("=" * 80)
print("TEST 1: QUICK COUNT CRUD (as superadmin)")
print("=" * 80)

# Login as superadmin
superadmin_token = login("superadmin", "SiPekaeS@2025")
test("1.1 Login as superadmin/SiPekaeS@2025", 
     superadmin_token is not None, 
     "Login failed")

if superadmin_token:
    headers = headers_with_token(superadmin_token)
    
    # Test 1.1: GET /api/quick-count (initially may be empty or have existing data)
    resp = requests.get(f"{API_URL}/quick-count", headers=headers)
    test("1.2 GET /api/quick-count → 200 with array", 
         resp.status_code == 200 and isinstance(resp.json(), list),
         f"Status: {resp.status_code}, Response: {resp.text[:200]}")
    
    initial_count = len(resp.json()) if resp.status_code == 200 else 0
    print(f"   Initial quick-count entries: {initial_count}")
    
    # Test 1.2: POST /api/quick-count - create new entry
    qc_data = {
        "tps": "TPS 01",
        "kecamatan": "Cikembar",
        "desa": "Mekarjaya",
        "paslon_1": 50,
        "paslon_2": 120,
        "paslon_3": 30,
        "suara_tidak_sah": 5,
        "dpt": 250,
        "catatan": "lancar"
    }
    resp = requests.post(f"{API_URL}/quick-count", json=qc_data, headers=headers)
    test("1.3 POST /api/quick-count creates entry → 200", 
         resp.status_code == 200,
         f"Status: {resp.status_code}, Response: {resp.text[:200]}")
    
    if resp.status_code == 200:
        qc1 = resp.json()
        test("1.4 Response has id field", 
             'id' in qc1,
             f"Response: {qc1}")
        test("1.5 Response has submitted_by=superadmin", 
             qc1.get('submitted_by') == 'superadmin',
             f"submitted_by: {qc1.get('submitted_by')}")
        test("1.6 Response has submitted_at field", 
             'submitted_at' in qc1,
             f"Response: {qc1}")
        
        qc1_id = qc1.get('id')
        if qc1_id:
            created_ids.append(qc1_id)
        
        # Test 1.3: POST again with SAME tps+kecamatan → should UPDATE (upsert)
        qc_data_update = {
            "tps": "TPS 01",
            "kecamatan": "Cikembar",
            "desa": "Mekarjaya",
            "paslon_1": 55,  # Changed
            "paslon_2": 125,  # Changed
            "paslon_3": 35,  # Changed
            "suara_tidak_sah": 6,
            "dpt": 250,
            "catatan": "lancar update"
        }
        resp = requests.post(f"{API_URL}/quick-count", json=qc_data_update, headers=headers)
        test("1.7 POST with same tps+kecamatan → 200 (upsert)", 
             resp.status_code == 200,
             f"Status: {resp.status_code}, Response: {resp.text[:200]}")
        
        # Verify count remains same (no duplicate created)
        resp = requests.get(f"{API_URL}/quick-count", headers=headers)
        current_count = len(resp.json()) if resp.status_code == 200 else 0
        test("1.8 GET /api/quick-count count remains same (no duplicate)", 
             current_count == initial_count + 1,
             f"Expected {initial_count + 1}, got {current_count}")
        
        # Test 1.4: PUT /api/quick-count/{id} - update existing
        if qc1_id:
            qc_data_put = {
                "tps": "TPS 01",
                "kecamatan": "Cikembar",
                "desa": "Mekarjaya",
                "paslon_1": 60,  # Changed
                "paslon_2": 130,  # Changed
                "paslon_3": 40,  # Changed
                "suara_tidak_sah": 7,
                "dpt": 250,
                "catatan": "lancar PUT update"
            }
            resp = requests.put(f"{API_URL}/quick-count/{qc1_id}", json=qc_data_put, headers=headers)
            test("1.9 PUT /api/quick-count/{id} → 200", 
                 resp.status_code == 200,
                 f"Status: {resp.status_code}, Response: {resp.text[:200]}")
            
            if resp.status_code == 200:
                qc_updated = resp.json()
                test("1.10 PUT updated paslon_1 to 60", 
                     qc_updated.get('paslon_1') == 60,
                     f"paslon_1: {qc_updated.get('paslon_1')}")

print("\n" + "=" * 80)
print("TEST 2: QUICK COUNT SUMMARY")
print("=" * 80)

if superadmin_token:
    headers = headers_with_token(superadmin_token)
    
    # Create 3 quick-count entries with different TPS
    qc_entries = [
        {
            "tps": "TPS 02",
            "kecamatan": "Cikembar",
            "desa": "Desa A",
            "paslon_1": 40,
            "paslon_2": 80,
            "paslon_3": 20,
            "suara_tidak_sah": 3,
            "dpt": 200,
            "catatan": "test 1"
        },
        {
            "tps": "TPS 03",
            "kecamatan": "Cikembar",
            "desa": "Desa B",
            "paslon_1": 30,
            "paslon_2": 70,
            "paslon_3": 15,
            "suara_tidak_sah": 2,
            "dpt": 150,
            "catatan": "test 2"
        },
        {
            "tps": "TPS 04",
            "kecamatan": "Cicurug",
            "desa": "Desa C",
            "paslon_1": 25,
            "paslon_2": 60,
            "paslon_3": 10,
            "suara_tidak_sah": 1,
            "dpt": 120,
            "catatan": "test 3"
        }
    ]
    
    for i, qc_data in enumerate(qc_entries):
        resp = requests.post(f"{API_URL}/quick-count", json=qc_data, headers=headers)
        test(f"2.{i+1} POST quick-count entry {i+1} → 200", 
             resp.status_code == 200,
             f"Status: {resp.status_code}")
        if resp.status_code == 200:
            qc_id = resp.json().get('id')
            if qc_id:
                created_ids.append(qc_id)
    
    # Test summary endpoint
    resp = requests.get(f"{API_URL}/quick-count/summary", headers=headers)
    test("2.4 GET /api/quick-count/summary → 200", 
         resp.status_code == 200,
         f"Status: {resp.status_code}, Response: {resp.text[:200]}")
    
    if resp.status_code == 200:
        summary = resp.json()
        
        # Verify required fields
        required_fields = [
            'total_tps_terlapor', 'target_tps', 'coverage_persen',
            'total_suara_sah', 'total_suara_tidak_sah', 'total_dpt',
            'partisipasi_persen', 'paslon', 'per_kecamatan'
        ]
        
        for field in required_fields:
            test(f"2.5 Summary has field '{field}'", 
                 field in summary,
                 f"Missing field: {field}")
        
        # Verify total_tps_terlapor >= 4 (we created at least 4 entries)
        test("2.6 total_tps_terlapor >= 4", 
             summary.get('total_tps_terlapor', 0) >= 4,
             f"total_tps_terlapor: {summary.get('total_tps_terlapor')}")
        
        # Verify paslon is array of 3 items
        test("2.7 paslon is array of 3 items", 
             isinstance(summary.get('paslon'), list) and len(summary.get('paslon', [])) == 3,
             f"paslon: {summary.get('paslon')}")
        
        if isinstance(summary.get('paslon'), list) and len(summary.get('paslon', [])) == 3:
            for i, paslon in enumerate(summary['paslon']):
                test(f"2.8.{i+1} paslon[{i}] has nama, suara, persen, warna", 
                     all(k in paslon for k in ['nama', 'suara', 'persen', 'warna']),
                     f"paslon[{i}]: {paslon}")
        
        # Verify per_kecamatan is array
        test("2.9 per_kecamatan is array", 
             isinstance(summary.get('per_kecamatan'), list),
             f"per_kecamatan type: {type(summary.get('per_kecamatan'))}")
        
        # Verify total_suara_sah calculation
        if 'paslon' in summary and len(summary['paslon']) == 3:
            calculated_sah = sum(p.get('suara', 0) for p in summary['paslon'])
            test("2.10 total_suara_sah matches sum of paslon suara", 
                 summary.get('total_suara_sah') == calculated_sah,
                 f"total_suara_sah: {summary.get('total_suara_sah')}, calculated: {calculated_sah}")

print("\n" + "=" * 80)
print("TEST 3: SAKSI ROLE RESTRICTIONS")
print("=" * 80)

# Login as saksi
saksi_token = login("saksi", "admin123")
test("3.1 Login as saksi/admin123", 
     saksi_token is not None, 
     "Login failed")

if saksi_token:
    headers_saksi = headers_with_token(saksi_token)
    
    # Test 3.1: GET /api/quick-count as saksi - should return only entries for saksi's area
    resp = requests.get(f"{API_URL}/quick-count", headers=headers_saksi)
    test("3.2 GET /api/quick-count as saksi → 200", 
         resp.status_code == 200,
         f"Status: {resp.status_code}, Response: {resp.text[:200]}")
    
    if resp.status_code == 200:
        saksi_entries = resp.json()
        # Saksi should only see entries for their tps_kerja="TPS 01" and kecamatan_kerja="Cikembar"
        # Verify all entries match saksi's area
        all_match = all(
            entry.get('tps') == 'TPS 01' and entry.get('kecamatan') == 'Cikembar'
            for entry in saksi_entries
        )
        test("3.3 All entries match saksi area (tps='TPS 01', kecamatan='Cikembar')", 
             all_match,
             f"Entries: {saksi_entries}")
    
    # Test 3.2: POST /api/quick-count as saksi - should work for their area
    qc_saksi_data = {
        "tps": "TPS 01",
        "kecamatan": "Cikembar",
        "desa": "Mekarjaya",
        "paslon_1": 10,
        "paslon_2": 50,
        "paslon_3": 5,
        "suara_tidak_sah": 1,
        "dpt": 100,
        "catatan": "saksi test"
    }
    resp = requests.post(f"{API_URL}/quick-count", json=qc_saksi_data, headers=headers_saksi)
    test("3.4 POST /api/quick-count as saksi (own area) → 200", 
         resp.status_code == 200,
         f"Status: {resp.status_code}, Response: {resp.text[:200]}")
    
    if resp.status_code == 200:
        saksi_qc = resp.json()
        test("3.5 Response has submitted_by=saksi", 
             saksi_qc.get('submitted_by') == 'saksi',
             f"submitted_by: {saksi_qc.get('submitted_by')}")
    
    # Test 3.3: DELETE /api/quick-count as saksi - should return 403
    if created_ids:
        resp = requests.delete(f"{API_URL}/quick-count/{created_ids[0]}", headers=headers_saksi)
        test("3.6 DELETE /api/quick-count/{id} as saksi → 403", 
             resp.status_code == 403,
             f"Expected 403, got {resp.status_code}")

print("\n" + "=" * 80)
print("TEST 4: AUTH REQUIRED")
print("=" * 80)

# Test without token
resp = requests.get(f"{API_URL}/quick-count")
test("4.1 GET /api/quick-count without token → 401", 
     resp.status_code == 401,
     f"Expected 401, got {resp.status_code}")

resp = requests.get(f"{API_URL}/quick-count/summary")
test("4.2 GET /api/quick-count/summary without token → 401", 
     resp.status_code == 401,
     f"Expected 401, got {resp.status_code}")

print("\n" + "=" * 80)
print("CLEANUP: Delete created quick-count entries")
print("=" * 80)

if superadmin_token and created_ids:
    headers = headers_with_token(superadmin_token)
    for qc_id in created_ids:
        resp = requests.delete(f"{API_URL}/quick-count/{qc_id}", headers=headers)
        test(f"Cleanup: DELETE /api/quick-count/{qc_id[:8]}...", 
             resp.status_code == 200 and resp.json().get('ok') == True,
             f"Status: {resp.status_code}")

print("\n" + "=" * 80)
print("FINAL RESULTS")
print("=" * 80)
print(f"Total tests: {total_tests}")
print(f"Passed: {passed_tests}")
print(f"Failed: {len(failed_tests)}")

if failed_tests:
    print("\n❌ FAILED TESTS:")
    for failure in failed_tests:
        print(f"  - {failure}")
    exit(1)
else:
    print("\n🎉 ALL TESTS PASSED!")
    exit(0)
