#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for SiPekaeS
Tests NEW endpoints: change-password, user CRUD, kader/saksi excel, reset-demo-data
"""
import requests
import io
import openpyxl
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

print("=" * 80)
print("TEST 1: CHANGE PASSWORD")
print("=" * 80)

# Login as superadmin with current password
token = login("superadmin", "SiPekaeS@2025")
test("1.1 Login with current password (SiPekaeS@2025)", token is not None, "Login failed")

if token:
    # Test 1.1: Change password successfully
    resp = requests.post(f"{API_URL}/auth/change-password", 
                        json={"old_password": "SiPekaeS@2025", "new_password": "NewPass@2025"},
                        headers=headers_with_token(token))
    test("1.2 POST /auth/change-password with correct old password", 
         resp.status_code == 200 and resp.json().get('ok') == True,
         f"Status: {resp.status_code}, Response: {resp.text}")
    
    # Test 1.2: Login with new password
    new_token = login("superadmin", "NewPass@2025")
    test("1.3 Login with new password (NewPass@2025)", 
         new_token is not None,
         "Login with new password failed")
    
    if new_token:
        # Test 1.3: Change password with wrong old password
        resp = requests.post(f"{API_URL}/auth/change-password",
                            json={"old_password": "WrongPassword", "new_password": "AnotherPass@2025"},
                            headers=headers_with_token(new_token))
        test("1.4 POST /auth/change-password with wrong old password → 400",
             resp.status_code == 400,
             f"Expected 400, got {resp.status_code}")
        
        # Test 1.4: Change password with short new password
        resp = requests.post(f"{API_URL}/auth/change-password",
                            json={"old_password": "NewPass@2025", "new_password": "12345"},
                            headers=headers_with_token(new_token))
        test("1.5 POST /auth/change-password with new password < 6 chars → 400",
             resp.status_code == 400,
             f"Expected 400, got {resp.status_code}")
        
        # IMPORTANT: Change password BACK to original
        resp = requests.post(f"{API_URL}/auth/change-password",
                            json={"old_password": "NewPass@2025", "new_password": "SiPekaeS@2025"},
                            headers=headers_with_token(new_token))
        test("1.6 RESTORE password back to SiPekaeS@2025",
             resp.status_code == 200 and resp.json().get('ok') == True,
             f"Failed to restore password: {resp.text}")
        
        # Verify restored password works
        restored_token = login("superadmin", "SiPekaeS@2025")
        test("1.7 Verify restored password works",
             restored_token is not None,
             "Login with restored password failed")
        
        token = restored_token  # Use restored token for remaining tests

print("\n" + "=" * 80)
print("TEST 2: USER CRUD")
print("=" * 80)

if token:
    # Test 2.1: Create new user
    new_user_payload = {
        "username": "testuser1",
        "password": "pass123",
        "name": "Test User",
        "role": "koordinator",
        "roleLabel": "Koordinator Cikembar",
        "kecamatan_kerja": "Cikembar"
    }
    resp = requests.post(f"{API_URL}/users", json=new_user_payload, headers=headers_with_token(token))
    test("2.1 POST /users creates new user → 200 with UserOut",
         resp.status_code == 200 and 'id' in resp.json() and resp.json().get('username') == 'testuser1',
         f"Status: {resp.status_code}, Response: {resp.text}")
    
    created_user_id = resp.json().get('id') if resp.status_code == 200 else None
    
    # Test 2.2: Create duplicate user
    resp = requests.post(f"{API_URL}/users", json=new_user_payload, headers=headers_with_token(token))
    test("2.2 POST /users with duplicate username → 400",
         resp.status_code == 400,
         f"Expected 400, got {resp.status_code}")
    
    # Test 2.3: GET users includes new user
    resp = requests.get(f"{API_URL}/users", headers=headers_with_token(token))
    users = resp.json() if resp.status_code == 200 else []
    test("2.3 GET /users includes new user",
         resp.status_code == 200 and any(u.get('username') == 'testuser1' for u in users),
         f"testuser1 not found in users list")
    
    if created_user_id:
        # Test 2.4: Update user (name change, password empty = don't change)
        update_payload = {
            "username": "testuser1",
            "password": "",  # Empty means don't change
            "name": "Test User Updated",
            "role": "koordinator",
            "roleLabel": "Koordinator Cikembar Updated",
            "kecamatan_kerja": "Cikembar"
        }
        resp = requests.put(f"{API_URL}/users/{created_user_id}", json=update_payload, headers=headers_with_token(token))
        test("2.4 PUT /users/{id} with updated name and password='' → 200",
             resp.status_code == 200 and resp.json().get('name') == 'Test User Updated',
             f"Status: {resp.status_code}, Response: {resp.text}")
        
        # Test 2.5: Login as testuser1 with original password (verify password not cleared)
        testuser_token = login("testuser1", "pass123")
        test("2.5 Login as testuser1 with pass123 → success (password not cleared)",
             testuser_token is not None,
             "Login failed - password may have been cleared")
        
        # Test 2.6: Delete user as super_admin
        resp = requests.delete(f"{API_URL}/users/{created_user_id}", headers=headers_with_token(token))
        test("2.6 DELETE /users/{id} as super_admin → 200 {ok:true}",
             resp.status_code == 200 and resp.json().get('ok') == True,
             f"Status: {resp.status_code}, Response: {resp.text}")
    
    # Test 2.7: Try to delete self (should fail)
    resp = requests.get(f"{API_URL}/auth/me", headers=headers_with_token(token))
    superadmin_id = resp.json().get('id') if resp.status_code == 200 else None
    if superadmin_id:
        resp = requests.delete(f"{API_URL}/users/{superadmin_id}", headers=headers_with_token(token))
        test("2.7 DELETE /users/{superadmin_id} (self) → 400",
             resp.status_code == 400,
             f"Expected 400, got {resp.status_code}")

print("\n" + "=" * 80)
print("TEST 3: USER CRUD PERMISSIONS")
print("=" * 80)

# Login as admininput
admininput_token = login("admininput", "admin123")
test("3.1 Login as admininput/admin123",
     admininput_token is not None,
     "Login as admininput failed")

if admininput_token:
    # Test 3.2: Try to create user (should fail - only super_admin & admin_pusat can)
    test_payload = {
        "username": "testuser2",
        "password": "pass123",
        "name": "Test User 2",
        "role": "koordinator",
        "roleLabel": "Koordinator Test"
    }
    resp = requests.post(f"{API_URL}/users", json=test_payload, headers=headers_with_token(admininput_token))
    test("3.2 POST /users with admininput token → 403",
         resp.status_code == 403,
         f"Expected 403, got {resp.status_code}")
    
    # Test 3.3: Try to delete user (should fail - only super_admin can delete)
    # First get any user id
    resp = requests.get(f"{API_URL}/users", headers=headers_with_token(token))
    if resp.status_code == 200 and len(resp.json()) > 0:
        some_user_id = resp.json()[0].get('id')
        resp = requests.delete(f"{API_URL}/users/{some_user_id}", headers=headers_with_token(admininput_token))
        test("3.3 DELETE /users/{id} with admininput token → 403",
             resp.status_code == 403,
             f"Expected 403, got {resp.status_code}")

print("\n" + "=" * 80)
print("TEST 4: KADER EXCEL")
print("=" * 80)

if token:
    # Test 4.1: Download template
    resp = requests.get(f"{API_URL}/kader/template/excel", headers=headers_with_token(token))
    test("4.1 GET /kader/template/excel → returns valid xlsx",
         resp.status_code == 200 and 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' in resp.headers.get('Content-Type', ''),
         f"Status: {resp.status_code}, Content-Type: {resp.headers.get('Content-Type')}")
    
    # Test 4.2: Create test xlsx and import
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.append(['nama', 'jabatan', 'hp', 'kecamatan', 'desa', 'rw', 'alamat'])
    ws.append(['Test Kader 1', 'Kader Aktif', '081111111111', 'Cikembar', 'Mekarjaya', 'RW 01', 'Jl. Test 1'])
    ws.append(['Test Kader 2', 'Kader Pasif', '081222222222', 'Cikembar', 'Mekarjaya', 'RW 02', 'Jl. Test 2'])
    
    buf = io.BytesIO()
    wb.save(buf)
    buf.seek(0)
    
    files = {'file': ('test_kader.xlsx', buf, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')}
    resp = requests.post(f"{API_URL}/kader/import/excel", files=files, headers=headers_with_token(token))
    test("4.2 POST /kader/import/excel with test xlsx → 200 with {inserted, errors}",
         resp.status_code == 200 and resp.json().get('inserted') == 2,
         f"Status: {resp.status_code}, Response: {resp.text}")
    
    # Test 4.3: Verify kaders were inserted
    resp = requests.get(f"{API_URL}/kader", headers=headers_with_token(token))
    kaders = resp.json() if resp.status_code == 200 else []
    test_kaders = [k for k in kaders if k.get('nama', '').startswith('Test Kader')]
    test("4.3 GET /kader → new kaders present",
         len(test_kaders) >= 2,
         f"Expected at least 2 test kaders, found {len(test_kaders)}")
    
    # Cleanup: Delete test kaders
    deleted_count = 0
    for kader in test_kaders:
        resp = requests.delete(f"{API_URL}/kader/{kader['id']}", headers=headers_with_token(token))
        if resp.status_code == 200:
            deleted_count += 1
    test("4.4 Cleanup: Delete test kaders",
         deleted_count >= 2,
         f"Only deleted {deleted_count} kaders")

print("\n" + "=" * 80)
print("TEST 5: SAKSI EXCEL")
print("=" * 80)

if token:
    # Test 5.1: Download template
    resp = requests.get(f"{API_URL}/saksi/template/excel", headers=headers_with_token(token))
    test("5.1 GET /saksi/template/excel → returns valid xlsx",
         resp.status_code == 200 and 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' in resp.headers.get('Content-Type', ''),
         f"Status: {resp.status_code}, Content-Type: {resp.headers.get('Content-Type')}")
    
    # Test 5.2: Create test xlsx and import
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.append(['nama', 'tps', 'hp', 'kecamatan', 'desa', 'rw', 'alamat', 'status'])
    ws.append(['Test Saksi 1', 'TPS 01', '081333333333', 'Cikembar', 'Mekarjaya', 'RW 01', 'Jl. Test 1', 'aktif'])
    ws.append(['Test Saksi 2', 'TPS 02', '081444444444', 'Cikembar', 'Mekarjaya', 'RW 02', 'Jl. Test 2', 'pending'])
    
    buf = io.BytesIO()
    wb.save(buf)
    buf.seek(0)
    
    files = {'file': ('test_saksi.xlsx', buf, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')}
    resp = requests.post(f"{API_URL}/saksi/import/excel", files=files, headers=headers_with_token(token))
    test("5.2 POST /saksi/import/excel with test xlsx → 200 with {inserted, errors}",
         resp.status_code == 200 and resp.json().get('inserted') == 2,
         f"Status: {resp.status_code}, Response: {resp.text}")
    
    # Test 5.3: Verify saksi were inserted
    resp = requests.get(f"{API_URL}/saksi", headers=headers_with_token(token))
    saksi_list = resp.json() if resp.status_code == 200 else []
    test_saksi = [s for s in saksi_list if s.get('nama', '').startswith('Test Saksi')]
    test("5.3 GET /saksi → new saksi present",
         len(test_saksi) >= 2,
         f"Expected at least 2 test saksi, found {len(test_saksi)}")
    
    # Cleanup: Delete test saksi
    deleted_count = 0
    for saksi in test_saksi:
        resp = requests.delete(f"{API_URL}/saksi/{saksi['id']}", headers=headers_with_token(token))
        if resp.status_code == 200:
            deleted_count += 1
    test("5.4 Cleanup: Delete test saksi",
         deleted_count >= 2,
         f"Only deleted {deleted_count} saksi")

print("\n" + "=" * 80)
print("TEST 6: RESET DEMO DATA")
print("=" * 80)

if admininput_token:
    # Test 6.1: Try reset as admininput (should fail)
    resp = requests.post(f"{API_URL}/admin/reset-demo-data", headers=headers_with_token(admininput_token))
    test("6.1 POST /admin/reset-demo-data as admininput → 403",
         resp.status_code == 403,
         f"Expected 403, got {resp.status_code}")

if token:
    # Test 6.2: Reset as super_admin
    resp = requests.post(f"{API_URL}/admin/reset-demo-data", headers=headers_with_token(token))
    test("6.2 POST /admin/reset-demo-data as super_admin → 200 with deleted counts",
         resp.status_code == 200 and 'deleted' in resp.json(),
         f"Status: {resp.status_code}, Response: {resp.text}")
    
    if resp.status_code == 200:
        deleted = resp.json().get('deleted', {})
        print(f"   Deleted counts: {deleted}")
    
    # Test 6.3: Verify collections are empty
    resp = requests.get(f"{API_URL}/simpatisan", headers=headers_with_token(token))
    test("6.3 GET /simpatisan after reset → []",
         resp.status_code == 200 and len(resp.json()) == 0,
         f"Expected empty list, got {len(resp.json())} items")
    
    resp = requests.get(f"{API_URL}/kader", headers=headers_with_token(token))
    test("6.4 GET /kader after reset → []",
         resp.status_code == 200 and len(resp.json()) == 0,
         f"Expected empty list, got {len(resp.json())} items")
    
    resp = requests.get(f"{API_URL}/saksi", headers=headers_with_token(token))
    test("6.5 GET /saksi after reset → []",
         resp.status_code == 200 and len(resp.json()) == 0,
         f"Expected empty list, got {len(resp.json())} items")

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
else:
    print("\n🎉 ALL TESTS PASSED!")

print("\n" + "=" * 80)
print("⚠️  CRITICAL: Data has been reset. Run seed.py to restore demo data:")
print("   python /app/backend/seed.py")
print("=" * 80)
