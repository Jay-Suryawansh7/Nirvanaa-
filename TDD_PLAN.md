# Test-Driven Development (TDD) Plan
## Nyaya Readiness – AI-Powered Case Readiness & Mediation System

---

## 📋 TDD Overview

**What is TDD?**
Test-Driven Development is a software development methodology where tests are written BEFORE implementation. The cycle follows the **Red-Green-Refactor** pattern:

1. **RED:** Write a failing test that defines desired functionality
2. **GREEN:** Write minimal code to make the test pass
3. **REFACTOR:** Clean up code while keeping tests passing

**Why TDD for Nyaya Readiness?**
- **Critical Logic:** Case readiness scoring must be 100% accurate; bugs = wrong verdicts
- **Legal Accountability:** Lawyer metrics directly impact reputation; must be trustworthy
- **Regression Prevention:** Changes to one feature can't break others
- **Documentation:** Tests serve as executable requirements for judges/lawyers
- **Confidence:** Deploy to courts knowing code is thoroughly tested

---

## 🎯 TDD Goals

| Goal | Target | Rationale |
|------|--------|-----------|
| **Code Coverage** | ≥ 70% overall, 100% for scoring logic | Critical path fully tested |
| **Test Count** | ≥ 200 tests (unit + integration) | Comprehensive feature coverage |
| **Test Execution Time** | < 5 minutes (all tests) | Fast feedback loop for developers |
| **Test Maintenance** | ≤ 10% flakiness | Reliable CI/CD pipeline |
| **Bug Detection (Pre-Launch)** | 95%+ of bugs caught before production | Legal system can't tolerate production bugs |

---

## 🔄 TDD Workflow: Red-Green-Refactor

### Phase 1A: RED - Write Failing Test

**Step 1:** Define the behavior in a test file
```typescript
// tests/readiness-scoring.test.ts
describe('Case Readiness Scoring', () => {
  test('should calculate 30 points for lawyer confirmed only', () => {
    const testCase = {
      lawyerConfirmed: true,
      witnessConfirmed: false,
      documentsReady: false,
      mediationWilling: 'NONE'
    };
    
    const score = calculateReadinessScore(testCase);
    expect(score).toBe(30);
  });
});
```

**Step 2:** Run test → FAILS (function doesn't exist yet)
```bash
$ npm run test:unit
FAIL tests/readiness-scoring.test.ts
  ● Case Readiness Scoring › should calculate 30 points for lawyer confirmed only
    ReferenceError: calculateReadinessScore is not defined
```

**Status:** ✗ RED (Test failing, exactly as expected)

---

### Phase 1B: GREEN - Write Minimal Code

**Step 1:** Implement ONLY what's needed to pass the test
```typescript
// src/scoring.ts
export function calculateReadinessScore(caseData: Case): number {
  let score = 0;
  
  if (caseData.lawyerConfirmed) {
    score += 30;
  }
  // Don't add other logic yet—only implement what the test requires
  
  return score;
}
```

**Step 2:** Run test → PASSES
```bash
$ npm run test:unit
PASS tests/readiness-scoring.test.ts
  ✓ Case Readiness Scoring › should calculate 30 points for lawyer confirmed only
```

**Status:** ✓ GREEN (Test passing, minimal code written)

---

### Phase 1C: REFACTOR - Improve Code Quality

**Step 1:** Refactor for clarity (tests still pass)
```typescript
// src/scoring.ts
const POINTS = {
  LAWYER_CONFIRMED: 30,
  WITNESS_CONFIRMED: 20,
  DOCUMENTS_READY: 20,
  MEDIATION_BOTH: 30,
  MEDIATION_ONE: 15,
  MEDIATION_NONE: 0,
  MAX_SCORE: 100
};

export function calculateReadinessScore(caseData: Case): number {
  let score = 0;
  
  if (caseData.lawyerConfirmed) score += POINTS.LAWYER_CONFIRMED;
  if (caseData.witnessConfirmed) score += POINTS.WITNESS_CONFIRMED;
  if (caseData.documentsReady) score += POINTS.DOCUMENTS_READY;
  
  score += getMediationPoints(caseData.mediationWilling);
  
  return Math.min(score, POINTS.MAX_SCORE);
}

function getMediationPoints(willingness: 'NONE' | 'ONE_PARTY' | 'BOTH'): number {
  const mediationMap = {
    'NONE': POINTS.MEDIATION_NONE,
    'ONE_PARTY': POINTS.MEDIATION_ONE,
    'BOTH': POINTS.MEDIATION_BOTH
  };
  return mediationMap[willingness];
}
```

**Step 2:** Run test again → STILL PASSES
```bash
$ npm run test:unit
PASS tests/readiness-scoring.test.ts
  ✓ Case Readiness Scoring › should calculate 30 points for lawyer confirmed only
```

**Status:** ✓ REFACTORED (Code cleaner, tests still passing)

---

### Repeat Cycle for Each Feature

**Next iteration:** Add test for witness confirmation
```typescript
test('should calculate 20 points for witness confirmed', () => {
  const testCase = { ..., witnessConfirmed: true };
  expect(calculateReadinessScore(testCase)).toBe(20);
});
```

Then implement, then refactor. Repeat for all 5 features.

---

## 📊 TDD Test Plan by Feature

### Feature 1: Case Readiness Scoring

**Total Tests:** 25 unit tests

| Test Name | Scenario | Expected | Status |
|-----------|----------|----------|--------|
| Score calculation - Lawyer only | Lawyer: YES, Others: NO | 30 | ✓ |
| Score calculation - Witness only | Witness: YES, Others: NO | 20 | ✓ |
| Score calculation - Docs only | Docs: YES, Others: NO | 20 | ✓ |
| Score calculation - All confirmed | All: YES, Mediation: BOTH | 100 | ✓ |
| Score capping at 100 | All: YES (would be 110+) | 100 (capped) | ✓ |
| Mediation willingness - BOTH | Mediation: BOTH | 30 | ✓ |
| Mediation willingness - ONE_PARTY | Mediation: ONE_PARTY | 15 | ✓ |
| Mediation willingness - NONE | Mediation: NONE | 0 | ✓ |
| Status mapping - READY (85-100) | Score: 90 | READY | ✓ |
| Status mapping - MEDIATION_READY (70-84, both willing) | Score: 75, Mediation: BOTH | MEDIATION_READY | ✓ |
| Status mapping - WAITING (50-69) | Score: 60 | WAITING | ✓ |
| Status mapping - PARTIALLY_READY (30-49) | Score: 40 | PARTIALLY_READY | ✓ |
| Status mapping - HIGH_RISK (0-29) | Score: 15 | HIGH_RISK | ✓ |
| Score history creation | Score updated | History logged | ✓ |
| Score recalculation on confirmation | Lawyer confirms | Score + 30 | ✓ |
| Score recalculation on doc update | Docs marked ready | Score + 20 | ✓ |
| Score recalculation on mediation change | Mediation: NONE → BOTH | Score + 30 | ✓ |
| Edge case - No inputs | All: NO | 0 | ✓ |
| Edge case - Decimal rounding (if applicable) | Calculated score: 99.5 | 99 or 100 | ✓ |
| Invalid input handling | Invalid mediation enum | Error thrown | ✓ |
| Null/undefined inputs | caseData: null | Error thrown | ✓ |
| Performance - Large case batch | 1,000 cases recalculated | < 200ms total | ✓ |
| Concurrent score updates | 50 parallel updates | No race conditions | ✓ |
| Persistence - Score saved to DB | Score calculated, saved | Query returns correct value | ✓ |
| Persistence - History retrieved | Query history | All changes in order | ✓ |

**Implementation Order:**
1. Basic scoring (5 tests)
2. Status mapping (4 tests)
3. Score recalculation (3 tests)
4. Edge cases & error handling (5 tests)
5. Performance & concurrency (3 tests)
6. Persistence (5 tests)

---

### Feature 2: Judge Dashboard API

**Total Tests:** 30 unit tests + 8 integration tests

| Test Name | Endpoint | Scenario | Expected | Type |
|-----------|----------|----------|----------|------|
| GET cases list | GET /api/cases | Fetch today's cases | Array sorted by score | Unit |
| GET cases with pagination | GET /api/cases?page=1&limit=10 | Page 1, 10 items | First 10 cases | Unit |
| GET cases with filter by status | GET /api/cases?status=READY | Filter READY | Only READY cases | Unit |
| GET cases with filter by lawyer | GET /api/cases?lawyer_id=L123 | Filter lawyer | Cases for L123 | Unit |
| GET cases sorting by score desc | GET /api/cases?sort=score_desc | Sort high to low | Score[0] ≥ Score[1] | Unit |
| GET single case detail | GET /api/cases/C123 | Fetch case C123 | Full case object | Unit |
| GET case detail with confirmations | GET /api/cases/C123 | Include confirmations | Confirmations array | Unit |
| GET case detail with history | GET /api/cases/C123 | Include score history | History array | Unit |
| Sidebar data - Lawyer info masked | GET /api/cases/C123 | Phone number | Last 4 digits only | Unit |
| Overview card - Ready count | GET /api/cases/metrics | Cards data | Total, count, trend | Unit |
| Overview card - Mediation count | GET /api/cases/metrics | Cards data | Total, count, trend | Unit |
| Overview card - Not ready count | GET /api/cases/metrics | Cards data | Total, count, trend | Unit |
| Overview card - Flagged lawyers count | GET /api/cases/metrics | Cards data | Total, count, trend | Unit |
| Error handling - Invalid case ID | GET /api/cases/invalid_id | Invalid ID | 404 error | Unit |
| Error handling - Unauthorized judge | GET /api/cases (wrong court) | Judge from Court B accesses Court A case | 403 forbidden | Unit |
| Performance - Dashboard load for 50 cases | GET /api/cases | 50 cases in response | < 500ms response | Unit |
| Response format - JSON structure | GET /api/cases | Check JSON | Valid structure | Unit |
| Response format - Status codes | GET /api/cases | Success | 200 OK | Unit |
| Response format - Error messages | GET /api/cases/invalid | Fail | Error object with message | Unit |
| Caching - First load cached | GET /api/cases | First request | Stored in cache | Unit |
| Caching - Cache invalidation | After case update, GET /api/cases | Updated cases | New data returned | Unit |
| Real-time updates - WebSocket (Phase 2) | WebSocket /cases/updates | Score change event | Client receives update | Unit |
| Authentication - JWT token required | GET /api/cases (no token) | No auth header | 401 unauthorized | Unit |
| Authentication - Invalid token | GET /api/cases (bad token) | Bad token | 401 unauthorized | Unit |
| RBAC - Judge sees only own court cases | GET /api/cases | Judge from Court A | Only Court A cases | Unit |
| RBAC - Admin sees all courts | GET /api/cases | Admin user | All courts' cases | Unit |
| Rate limiting - 1000 req/min enforced | 1001 requests/min | Exceed limit | 429 too many requests | Unit |
| Data export - CSV format | GET /api/cases/export?format=csv | Export cases | CSV file returned | Unit |
| Data export - PDF format | GET /api/cases/export?format=pdf | Export cases | PDF file returned | Unit |
| Data export - Permission check | GET /api/cases/export (non-judge) | Non-judge user | 403 forbidden | Unit |

**Integration Tests (Dashboard Workflows):**

| Test Name | Workflow | Expected |
|-----------|----------|----------|
| Judge login → Dashboard loads → Cases visible | E2E flow | 3 READY, 2 MEDIATION_READY, 2 NOT_READY |
| Judge clicks case → Sidebar opens → Details load → Score shown | E2E flow | Sidebar displays all readiness components |
| Judge filters by status READY → Table updates → Shows only READY | E2E flow | Table re-renders with 3 rows |
| Judge clicks "Start Hearing" → Case status changes → Dashboard refreshes | E2E flow | Case marked IN_PROGRESS |
| Dashboard real-time update → Lawyer confirms → Score changes on dashboard | E2E flow | Score updates in < 2 seconds |
| Judge views lawyer metrics → Clicks lawyer → Accountability drill-down | E2E flow | Shows confirmation rate, no-shows, etc. |
| Judge filters by flagged lawyer → Dashboard highlights → Shows only that lawyer's cases | E2E flow | Filtered cases visible |
| Export cases → CSV download → Verify data | E2E flow | CSV contains correct cases and columns |

---

### Feature 3: Lawyer Confirmation System

**Total Tests:** 35 unit tests + 5 integration tests

| Test Name | Scenario | Expected | Type |
|-----------|----------|----------|------|
| 24h confirmation - Send SMS | Job triggers, case scheduled tomorrow | SMS queued, confirmation record created | Unit |
| 24h confirmation - Record response YES | Lawyer replies YES | Confirmation status: CONFIRMED | Unit |
| 24h confirmation - Record response NO | Lawyer replies NO | Confirmation status: DECLINED | Unit |
| 24h confirmation - No response (timeout) | 24 hours pass, no reply | Confirmation status: NO_RESPONSE | Unit |
| 24h confirmation - Timestamp recorded | Response received at 10:00 | response_received_at = 10:00 | Unit |
| 24h confirmation - Response time calculated | SMS sent 09:00, response 10:30 | response_time_minutes = 90 | Unit |
| 24h confirmation - Case score updates | Confirmation recorded YES | Case score +30 | Unit |
| 1h confirmation - Send urgent SMS | 1 hour before hearing | Urgent SMS sent | Unit |
| 1h confirmation - 30-minute window | Response window is 30 min | Timeout after 30 min → NO_RESPONSE | Unit |
| 1h confirmation - Judge notified if NO | Lawyer confirms NO | Judge gets alert | Unit |
| 1h confirmation - Judge notified if timeout | 1 hour deadline reached, no response | Judge gets alert | Unit |
| No-show detection - 15 min grace period | Hearing time + 15 min, lawyer absent | Case marked NO_SHOW | Unit |
| No-show detection - No-show count increments | No-show marked | lawyer.no_show_count ++ | Unit |
| No-show detection - Case marked ADJOURNED | No-show detected | Case status: ADJOURNED | Unit |
| No-show detection - Lawyer metrics updated | No-show detected | lawyer_metrics.no_show_count ++ | Unit |
| Confirmation audit trail - All fields recorded | Confirmation created | confirmation_id, case_id, lawyer_id, timestamps logged | Unit |
| Confirmation audit trail - History retrievable | Query confirmations for lawyer | All confirmations returned in order | Unit |
| SMS format - Correct message text | 24h SMS sent | Message includes case#, date, time | Unit |
| SMS format - Urgent message text | 1h SMS sent | Message marked URGENT | Unit |
| SMS parsing - Parse YES response | Response: "YES" | Parsed as CONFIRMED | Unit |
| SMS parsing - Parse yes (lowercase) | Response: "yes" | Parsed as CONFIRMED | Unit |
| SMS parsing - Parse Y (single letter) | Response: "Y" | Parsed as CONFIRMED | Unit |
| SMS parsing - Parse NO response | Response: "NO" | Parsed as DECLINED | Unit |
| SMS parsing - Parse other text | Response: "Call you later" | Parsed as NO_RESPONSE | Unit |
| SMS parsing - Case insensitive matching | Response: "YeS" | Parsed as CONFIRMED | Unit |
| SMS error - Delivery failure | SMS API returns error | Retry scheduled (3 retries) | Unit |
| SMS error - Retry exhausted | 3 retries failed | Fallback to email + in-app notification | Unit |
| Multi-language SMS - Hindi text (Phase 2) | SMS: [translate:हाँ] | Parsed as CONFIRMED | Unit |
| Multi-language SMS - Marathi text (Phase 2) | SMS: [translate:होय] | Parsed as CONFIRMED | Unit |
| Concurrency - Multiple confirmations simultaneously | 100 confirmations recorded | All stored correctly, no data loss | Unit |
| Performance - Confirmation recorded in < 100ms | Record response | Latency < 100ms | Unit |
| Performance - Score recalculates after confirmation < 200ms | Confirmation recorded | Score updated < 200ms | Unit |
| Persistence - Confirmation saved to DB | Record confirmation | Query returns confirmation | Unit |
| Persistence - Confirmation retrieved correctly | Query confirmation by ID | All fields match saved data | Unit |
| Invalid input - Null case_id | POST with case_id=null | 400 bad request | Unit |

**Integration Tests (Confirmation Workflows):**

| Test Name | Workflow | Expected |
|-----------|----------|----------|
| 24h confirmation cycle | Job runs → SMS sent → Lawyer replies YES → Score updates → Dashboard refreshes | Case READY status reflected |
| 1h confirmation cycle | 1h job runs → SMS sent → Judge sees alert → Lawyer replies YES | Alert cleared, case proceeds |
| No-show cycle | 1h confirmation NO → Hearing time reached → Case marked NO_SHOW → Metrics updated → Judge notified | Case adjournment logged, lawyer reputation impacted |
| SMS delivery with retry | SMS API fails → Retry 1 → Retry 2 → Success on retry 3 | Confirmation ultimately recorded |
| End-to-end: Confirmation changes case status | Case PARTIALLY_READY → Lawyer confirms → Score 65 → Status WAITING | Score and status update together |

---

### Feature 4: Lawyer Accountability Metrics

**Total Tests:** 20 unit tests + 4 integration tests

| Test Name | Scenario | Expected | Type |
|-----------|----------|----------|------|
| Quarterly metrics - Total cases assigned | 20 cases assigned in Q1 | total_cases_assigned = 20 | Unit |
| Quarterly metrics - Confirmed count | 17 of 20 confirmed | confirmed_count = 17 | Unit |
| Quarterly metrics - Confirmation rate calculation | 17/20 confirmed | confirmation_rate = 85.0 | Unit |
| Quarterly metrics - No-show count | 1 no-show in 20 cases | no_show_count = 1 | Unit |
| Quarterly metrics - Response time average | 5 confirmations with times [10, 15, 20, 25, 30] min | avg_response_time_hours = 0.4 (24 min) | Unit |
| Status badge - CLEAR (high performer) | confirmation_rate = 90%, no_shows = 1 | status_badge = CLEAR | Unit |
| Status badge - WARNING (medium performer) | confirmation_rate = 75%, no_shows = 3 | status_badge = WARNING | Unit |
| Status badge - FLAGGED (low performer) | confirmation_rate = 65%, no_shows = 6 | status_badge = FLAGGED | Unit |
| Status badge - Boundary case CLEAR/WARNING | confirmation_rate = 85%, no_shows = 2 | status_badge = CLEAR (just at threshold) | Unit |
| Status badge - Boundary case WARNING/FLAGGED | confirmation_rate = 70%, no_shows = 5 | status_badge = WARNING (at boundary) | Unit |
| Status badge - Boundary case WARNING/FLAGGED (no-shows) | confirmation_rate = 75%, no_shows = 6 | status_badge = FLAGGED (no-show threshold) | Unit |
| Quarterly calculation - End of Q1 triggered | March 31, midnight | Q1 metrics calculated | Unit |
| Quarterly calculation - Historical preservation | Q1 metrics calculated | Q1 saved in lawyer_metrics_history | Unit |
| Quarterly calculation - Manual correction | Judge corrects no-show | Metrics recalculated | Unit |
| Quarterly calculation - Appeal workflow | Lawyer disputes no-show | Audit trail logged, metrics update after correction | Unit |
| Edge case - New lawyer (0 cases) | New lawyer, 0 assigned | confirmation_rate = N/A (or 0) | Unit |
| Edge case - Perfect record (all confirmed) | 20 cases, all confirmed, 0 no-shows | confirmation_rate = 100%, status = CLEAR | Unit |
| Edge case - All no-shows | 20 cases, 0 confirmed, 20 no-shows | confirmation_rate = 0%, status = FLAGGED | Unit |
| Performance - Metrics calculated for 100 lawyers < 2 sec | 100 lawyers' metrics aggregated | Total time < 2 seconds | Unit |
| Persistence - Metrics saved and retrieved | Metrics calculated | Query returns correct values | Unit |

**Integration Tests (Accountability Workflows):**

| Test Name | Workflow | Expected |
|-----------|----------|----------|
| End of Q1 metrics refresh | March 31 → April 1 12:00 AM job runs → All lawyers' Q1 metrics calculated → Judge views dashboard | Metrics visible, status badges updated |
| Lawyer reputation progression | Q1: CLEAR → Q2: WARNING (more no-shows) → Q3: FLAGGED | Trend visible in metrics history |
| Judge uses metrics for case assignment | Judge views accountability dashboard → Sees FLAGGED lawyer → Assigns complex case to CLEAR lawyer instead | Case assignment based on reputation |
| Manual correction updates metrics | Judge corrects no-show → Metrics recalculated | Confirmation rate increases, status may change |

---

### Feature 5: Quick Mediation Module

**Total Tests:** 18 unit tests + 5 integration tests

| Test Name | Scenario | Expected | Type |
|-----------|----------|----------|------|
| MEDIATION_READY identification | Score ≥ 70, both parties willing | Status = MEDIATION_READY | Unit |
| MEDIATION_READY NOT identified | Score < 70 but both willing | Status ≠ MEDIATION_READY | Unit |
| MEDIATION_READY NOT identified | Score ≥ 70 but only one willing | Status ≠ MEDIATION_READY | Unit |
| Mediation input - Case creation | mediation_willing: BOTH | Stored in cases table | Unit |
| Mediation input - Case update | mediation_willing: NONE → BOTH | Updated and score recalculates | Unit |
| Mediation initiation - Modal opens | Judge clicks "Initiate Mediation" | Modal form displayed with fields | Unit |
| Mediation initiation - Type selection | Modal shows mediation types (civil, family, etc.) | User selects type | Unit |
| Mediation initiation - Mediator selection | Modal shows available mediators | User selects or auto-assigned | Unit |
| Mediation initiation - Date/time selection | Modal date/time picker | User selects mediation date | Unit |
| Mediation offer creation - Record created | Judge submits form | mediation_offer record created | Unit |
| Mediation offer notification - Parties notified | Offer created | SMS/notification sent to both parties | Unit |
| Mediation offer notification - Mediator assigned | Offer created | Mediator receives assignment | Unit |
| Mediation outcome - SETTLED marked | Mediator marks SETTLED | Case status = CLOSED, outcome logged | Unit |
| Mediation outcome - NOT_SETTLED marked | Mediator marks NOT_SETTLED | Case status = MEDIATION_NOT_SETTLED (continues to trial) | Unit |
| Mediation outcome - NO_SHOW marked | Party didn't attend | Mediation marked NO_SHOW, can be rescheduled | Unit |
| Mediation settlement rate tracking | X cases settled / Y MEDIATION_READY cases | settlement_rate calculated | Unit |
| Analytics - Mediation dashboard | Query mediation data | Shows counts, rates, trends | Unit |
| Performance - Mediation offer created < 500ms | Judge submits form | Response < 500ms | Unit |

**Integration Tests (Mediation Workflows):**

| Test Name | Workflow | Expected |
|-----------|----------|----------|
| End-to-end mediation flow | Case MEDIATION_READY → Judge initiates → Offer sent → Parties confirm → Mediator marks SETTLED → Case closed | Settlement in days vs. years of litigation |
| Mediation not settled → Trial continues | Case MEDIATION_READY → Judge initiates → NOT_SETTLED marked → Returns to judge for hearing | Seamless transition to trial |
| Mediation rescheduling | NO_SHOW marked → Judge reschedules → New offer sent → Parties confirm | Mediation reattempted |
| Analytics tracking | 10 mediation_ready cases in month → 3 settled → Dashboard shows 30% settlement rate | KPI tracked for reporting |
| Settlement comparison | 5 cases settled via mediation (avg 20 days) vs. 5 cases via trial (avg 3 years) | Mediation effectiveness demonstrated |

---

## 🛠️ TDD Implementation Roadmap

### Week 1: Setup & Foundation Tests
**Goal:** Establish testing infrastructure

- [ ] Set up Jest, TypeScript, testing libraries
- [ ] Create test file structure (`tests/` directory)
- [ ] Set up GitHub Actions CI/CD pipeline
- [ ] Write Feature 1 base tests (readiness scoring)
- [ ] Implement scoring logic (RED-GREEN-REFACTOR)
- [ ] Achieve 100% coverage for scoring

**Deliverable:** 25 passing tests for Feature 1, CI/CD green

---

### Week 2: Core Features (Features 2-3)
**Goal:** API and confirmation system

- [ ] Write Feature 2 API tests (Judge Dashboard)
- [ ] Implement dashboard endpoints
- [ ] Write Feature 3 confirmation tests
- [ ] Implement 24h + 1h confirmation system
- [ ] Mock SMS API for MVP

**Deliverable:** 30 Feature 2 tests + 35 Feature 3 tests, all passing

---

### Week 3: Accountability & Mediation (Features 4-5)
**Goal:** Complete core features

- [ ] Write Feature 4 accountability metrics tests
- [ ] Implement quarterly aggregation logic
- [ ] Write Feature 5 mediation module tests
- [ ] Implement mediation offer workflow

**Deliverable:** 20 Feature 4 tests + 18 Feature 5 tests, all passing

---

### Week 4: Integration Tests & Performance
**Goal:** End-to-end validation

- [ ] Write 22 integration tests (across all features)
- [ ] Load testing (50 concurrent judges)
- [ ] Performance testing (API response times)
- [ ] Run full test suite, ensure all passing
- [ ] Achieve 70% overall code coverage

**Deliverable:** All 155+ tests passing, coverage report, performance baselines documented

---

### Week 5: Security & Edge Cases
**Goal:** Robustness validation

- [ ] Write security tests (authentication, RBAC, SQL injection)
- [ ] Write edge case tests (null inputs, boundary conditions)
- [ ] Write error handling tests
- [ ] Test data privacy (PII masking, encryption)

**Deliverable:** 50+ security/edge case tests, all passing

---

### Week 6: Final Polish & Deployment
**Goal:** Production readiness

- [ ] Run full test suite on staging
- [ ] Test with real pilot judges (UAT)
- [ ] Document test cases for QA team
- [ ] Set up monitoring/alerting for test metrics
- [ ] Prepare rollback tests

**Deliverable:** Test suite frozen, CI/CD ready for production

---

## 📈 Test Coverage Goals

### By Feature

| Feature | Unit Tests | Integration Tests | Coverage Target |
|---------|------------|-------------------|-----------------|
| 1. Readiness Scoring | 25 | 1 | 100% |
| 2. Judge Dashboard | 30 | 8 | 90% |
| 3. Confirmations | 35 | 5 | 95% |
| 4. Lawyer Accountability | 20 | 4 | 85% |
| 5. Mediation Module | 18 | 5 | 85% |
| **TOTAL** | **128** | **23** | **70%+** |

### Critical Path (100% Coverage)

- ✅ Readiness scoring algorithm (most critical for judicial accuracy)
- ✅ Score-to-status mapping (high-impact on judge decisions)
- ✅ Lawyer confirmation parsing (must handle all input variations)
- ✅ No-show detection logic (impacts reputation metrics)
- ✅ Metrics calculation (must be auditable)

---

## 🔧 Testing Tools & Stack

### Unit Testing
- **Framework:** Jest (TypeScript-first, fast)
- **Assertion:** Expect (built-in Jest)
- **Mocking:** Jest Mock, Sinon (for complex scenarios)
- **File Pattern:** `*.test.ts` (colocated with source)

### Integration Testing
- **Framework:** Jest + Supertest (HTTP testing)
- **Database:** Jest database transaction rollback (no data persistence)
- **Setup:** Test fixtures for seed data

### E2E Testing (Phase 2)
- **Framework:** Playwright or Cypress (dashboard UI testing)
- **Scope:** Full user workflows (login → action → verification)

### Performance Testing
- **Tool:** Artillery.io or K6 (load testing)
- **Scope:** API response times under 50+ concurrent judges

### Security Testing
- **Tool:** OWASP ZAP or Snyk (vulnerability scanning)
- **Scope:** SQL injection, XSS, CSRF, authentication bypass

---

## 📋 CI/CD Integration

### GitHub Actions Workflow

```yaml
name: Test & Deploy

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Lint code
        run: npm run lint
      
      - name: Type check (TypeScript)
        run: npm run type-check
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Run integration tests
        run: npm run test:integration
      
      - name: Generate coverage report
        run: npm run test:coverage
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
      
      - name: Performance tests (optional)
        run: npm run test:performance
      
      - name: Security scan
        run: npm run security:scan

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && success()
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@v4
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Build Status Gates
- ✅ All tests must pass (100% requirement)
- ✅ Coverage ≥ 70% (minimum threshold)
- ✅ No security vulnerabilities (blocker)
- ✅ Performance benchmarks met (< 500ms API, < 2sec dashboard)
- ⚠️ Lint warnings allowed (non-blocking)

---

## 🧪 Test Execution & Metrics

### Daily Test Runs

```bash
# Unit tests only (fast feedback)
npm run test:unit -- --watch

# All tests before commit
npm run test:all

# Coverage report
npm run test:coverage

# Performance baseline
npm run test:performance
```

### Test Metrics Dashboard

**Metrics to Track:**
- **Test Count:** Total tests, passing, failing, skipped
- **Coverage:** Line, branch, function, statement coverage
- **Execution Time:** Total test time, slowest tests
- **Flakiness:** Tests that fail intermittently (target: < 10%)
- **Bug Detection:** Bugs caught per test run

**Example Metrics Output:**
```
Test Suite Summary
├─ Unit Tests: 128 tests, 128 passing (100%)
├─ Integration Tests: 23 tests, 23 passing (100%)
├─ Total Coverage: 72.5% (Target: 70%)
│  ├─ Readiness Scoring: 100%
│  ├─ Judge Dashboard: 91%
│  ├─ Confirmations: 96%
│  ├─ Lawyer Accountability: 84%
│  └─ Mediation Module: 83%
├─ Execution Time: 4m 32s (Target: < 5min)
├─ Flakiness: 1 flaky test (0.65%)
└─ Bugs Caught This Week: 3 (before reaching production)
```

---

## 🔍 Test Writing Guidelines

### Test Structure: Arrange-Act-Assert (AAA)

```typescript
describe('Feature Name', () => {
  test('should [expected behavior] when [condition]', () => {
    // ARRANGE: Set up test data
    const testCase = {
      lawyerConfirmed: true,
      witnessConfirmed: false,
      documentsReady: false,
      mediationWilling: 'NONE'
    };
    
    // ACT: Execute the function
    const result = calculateReadinessScore(testCase);
    
    // ASSERT: Verify the outcome
    expect(result).toBe(30);
  });
});
```

### Naming Convention

✅ **Good:**
```typescript
test('should return 30 points when only lawyer is confirmed')
test('should mark case as READY when score is 85 or higher')
test('should increment no-show count when lawyer fails to appear')
```

❌ **Bad:**
```typescript
test('test score')
test('readiness')
test('lawyer')
```

### Test Independence

✅ **Good:** Each test stands alone, can run in any order
```typescript
test('Test 1', () => {
  const case1 = createTestCase();
  // ...
});

test('Test 2', () => {
  const case2 = createTestCase(); // Fresh data
  // ...
});
```

❌ **Bad:** Tests depend on each other's execution order
```typescript
let sharedCase;

test('Test 1', () => {
  sharedCase = createTestCase(); // Shared state
});

test('Test 2', () => {
  // Depends on Test 1 running first
  expect(sharedCase).toBeDefined();
});
```

### Mocking External Dependencies

```typescript
// Mock SMS API
jest.mock('../sms-api', () => ({
  sendSMS: jest.fn().mockResolvedValue({ success: true })
}));

// Mock database
jest.mock('../db', () => ({
  saveConfirmation: jest.fn().mockResolvedValue({ id: 'conf-123' })
}));

test('should send SMS and save confirmation', async () => {
  const result = await recordConfirmation(testData);
  
  expect(sendSMS).toHaveBeenCalled();
  expect(saveConfirmation).toHaveBeenCalledWith(expect.any(Object));
  expect(result.id).toBe('conf-123');
});
```

---

## 🚨 Common TDD Pitfalls & Avoidance

| Pitfall | Problem | Solution |
|---------|---------|----------|
| **Testing implementation, not behavior** | Tests break if code refactors | Test what the function DOES, not HOW it does it |
| **Over-mocking** | Tests pass but code doesn't work in reality | Mock only external dependencies (DB, SMS API), not internal functions |
| **Skipping edge cases** | Bugs catch users, not tests | Write tests for null, negative, boundary conditions |
| **Tests too large** | Hard to debug failures | One behavior per test; small, focused assertions |
| **Ignoring test failures** | Failures pile up, CI trust erodes | Fix failing tests immediately, never skip/ignore |
| **No test data cleanup** | Tests interfere with each other | Use `beforeEach`/`afterEach` to isolate data |
| **Testing unrelated things** | Coverage numbers mean nothing | Each test should verify one logical behavior |

---

## 📊 Success Criteria for TDD

### Pre-Launch Checklist

- [ ] **Coverage:** 70%+ overall, 100% for critical scoring logic
- [ ] **Test Count:** ≥ 150 tests (unit + integration)
- [ ] **Execution Time:** < 5 minutes for full suite
- [ ] **Flakiness:** < 10% (intermittent failures)
- [ ] **Pass Rate:** 100% (all tests green before deploy)
- [ ] **Security Tests:** All OWASP top 10 covered
- [ ] **Performance Tests:** API < 500ms p95, Dashboard < 2sec p95
- [ ] **Documentation:** Every test has clear intent
- [ ] **CI/CD:** GitHub Actions green for all commits
- [ ] **Pilot UAT:** Tests validate real judge/lawyer workflows

### Post-Launch Monitoring

- [ ] **Bug Escape Rate:** < 5% of production bugs (test should catch 95%+)
- [ ] **Test Maintenance:** No more than 10% test update time per sprint
- [ ] **Developer Confidence:** Team reports high confidence deploying with tests
- [ ] **Regression Prevention:** No regressions in first 3 months post-launch

---

## 🎓 TDD Training Plan for Team

### Phase 1: Foundations (1 week)
- Learn Red-Green-Refactor cycle
- Write first 10 tests manually
- Code review focused on test quality

### Phase 2: Practice (2 weeks)
- Pair programming: Senior + Junior on Feature 1
- Write Feature 2 tests independently
- Weekly TDD retrospective

### Phase 3: Mastery (3 weeks)
- Full ownership of Feature test suite
- Mentor other team members
- Continuous improvement based on metrics

---

## 📝 Conclusion

TDD for Nyaya Readiness ensures that:

1. **Legal Accuracy:** 100% test coverage of scoring logic = no flawed verdicts
2. **Lawyer Fairness:** Confirmation parsing + metrics calculation fully validated
3. **Judge Confidence:** Every dashboard action tested end-to-end
4. **Production Ready:** No surprises; 95%+ bugs caught pre-launch
5. **Maintainability:** Code refactors with safety net of passing tests
6. **Team Culture:** Testing-first mindset embedded from day 1

**Target Launch Date:** Mid-January 2026 with 70%+ test coverage, 0 critical bugs, and full CI/CD automation.
