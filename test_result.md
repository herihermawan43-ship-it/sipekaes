#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================
user_problem_statement: |
  SiPekaeS - Aplikasi pemenangan partai politik untuk Kab. Sukabumi.
  Backend integration phase: JWT auth, MongoDB CRUD untuk Simpatisan/Kader/Saksi/DPC/DPRA/Pelopor/RKI,
  stats endpoint (RW tercover auto-computed), Excel import untuk Simpatisan.

backend:
  - task: "Auth JWT (login, /auth/me)"
    implemented: true
    working: true
    file: "/app/backend/server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "5 demo users (superadmin/adminpusat/admininput/koordinator/saksi, password admin123) seeded. Login returns JWT + user profile. /auth/me returns current user from token."
      - working: true
        agent: "testing"
        comment: "✅ ALL AUTH TESTS PASSED (5/5). POST /api/auth/login with superadmin/admin123 returns 200 with JWT token and user object (role=super_admin). Invalid credentials return 401. GET /api/auth/me with Bearer token returns current user (Heri Setiawan, super_admin). Without token returns 401. GET /api/users returns 5 seeded users."

  - task: "CRUD Simpatisan, Kader, Saksi, DPC, DPRA, Pelopor, RKI"
    implemented: true
    working: true
    file: "/app/backend/server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Generic CRUD generator creates GET (list, single), POST (create), PUT (update), DELETE for each entity. All protected by JWT."
      - working: true
        agent: "testing"
        comment: "✅ ALL CRUD TESTS PASSED (42/42). Tested all 7 entities (simpatisan, kader, saksi, pengurus-dpc, pengurus-dpra, pelopor, rki). Each entity: GET list returns seeded data (simpatisan:10, kader:8, saksi:6, dpc:8, dpra:5, pelopor:4, rki:4), POST creates with id, GET single retrieves by id, PUT updates successfully, DELETE returns {ok:true}, 401 without token. All endpoints require Bearer token and work correctly."

  - task: "Stats summary (RW tercover auto)"
    implemented: true
    working: true
    file: "/app/backend/server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "/api/stats/summary returns aggregate counts + RW tercover computed from unique kecamatan+desa+rw across simpatisan/kader/saksi."
      - working: true
        agent: "testing"
        comment: "✅ STATS TEST PASSED (1/1). GET /api/stats/summary returns complete object with simpatisan:{value:10, growth}, kader:{value:8, growth}, saksi:{value:6, growth}, pengurus_dpc, pengurus_dpra, pelopor, rki counts, rw:{value, total:3000, tercover:0.5%}, kecamatan:47, desa:381. RW tercover auto-computed correctly."

  - task: "Excel template download + import"
    implemented: true
    working: true
    file: "/app/backend/server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "/api/simpatisan/template/excel downloads xlsx template. /api/simpatisan/import/excel accepts xlsx upload, validates headers (nama, kecamatan required), inserts into Mongo, returns {inserted, errors}."
      - working: true
        agent: "testing"
        comment: "✅ EXCEL TESTS PASSED (2/2). GET /api/simpatisan/template/excel returns valid xlsx file (starts with PK, parseable by openpyxl) with headers: nama, nik, hp, kecamatan, desa, rw, rt, alamat. POST /api/simpatisan/import/excel with test xlsx (3 rows) successfully inserted 3 records, returned {inserted:3, errors:[]}."

frontend:
  - task: "Login page + Dashboard + all pages"
    implemented: true
    working: true
    file: "/app/frontend/src/App.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Frontend rendered successfully with mock data (verified via screenshot). Now needs API integration."

metadata:
  created_by: "main_agent"
  version: "1.0"
  test_sequence: 2
  run_ui: false

test_plan:
  current_focus: []
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
  - agent: "main"
    message: |
      Backend built with FastAPI + MongoDB.
      - Base URL uses /api prefix
      - Login POST /api/auth/login with {username, password}. Demo users: superadmin/adminpusat/admininput/koordinator/saksi, password admin123
      - All CRUD endpoints require Bearer token
      - Please verify:
        1. Login returns token+user for valid creds; 401 for invalid
        2. /api/auth/me returns current user with token
        3. GET/POST/PUT/DELETE for each entity (simpatisan, kader, saksi, pengurus-dpc, pengurus-dpra, pelopor, rki)
        4. GET /api/stats/summary returns non-empty aggregation
        5. GET /api/simpatisan/template/excel returns xlsx file
        6. POST /api/simpatisan/import/excel with valid xlsx file inserts rows
  - agent: "testing"
    message: |
      ✅ BACKEND TESTING COMPLETE - ALL TESTS PASSED (50/50)
      
      Comprehensive backend API testing completed successfully:
      
      1. ✅ Authentication (5/5 tests passed)
         - Login with valid credentials (superadmin/admin123) → 200, JWT token, user.role=super_admin
         - Login with invalid credentials → 401
         - GET /auth/me with token → returns current user
         - GET /auth/me without token → 401
         - GET /users → returns 5 seeded users
      
      2. ✅ CRUD Operations (42/42 tests passed - 6 tests × 7 entities)
         All entities tested: simpatisan, kader, saksi, pengurus-dpc, pengurus-dpra, pelopor, rki
         Each entity verified:
         - GET /api/{prefix} → returns seeded data list
         - POST /api/{prefix} → creates with id
         - GET /api/{prefix}/{id} → retrieves single item
         - PUT /api/{prefix}/{id} → updates successfully
         - DELETE /api/{prefix}/{id} → returns {ok: true}
         - 401 without Bearer token
      
      3. ✅ Stats Endpoint (1/1 test passed)
         - GET /api/stats/summary → returns complete aggregation with RW tercover auto-computed (0.5%)
      
      4. ✅ Excel Import/Export (2/2 tests passed)
         - GET /api/simpatisan/template/excel → returns valid xlsx file
         - POST /api/simpatisan/import/excel → successfully imported 3 test rows
      
      Backend is production-ready. All endpoints working correctly with proper authentication and data validation.
