# Delivery Timeline

**RFP #MC-2026-0417 — Meridian Components Inventory Dashboard**

---

## Summary

We estimate an **8–11 week engagement** from contract execution to final delivery. The range accounts for Meridian's feedback cadence and whether the optional D1/D3 scope is included. The required scope (R1–R4 + D2) fits comfortably within 9 weeks under normal review cycles.

---

## Phased Plan

### Phase 1 — Onboarding & Architecture (Weeks 1–2)

- Stand up development environment; verify all services run correctly
- Conduct full codebase audit: identify all Reports defects, validate API endpoints, map existing i18n coverage
- Deliver architecture documentation (R4) — HTML diagram + written narrative for Meridian IT
- Establish Playwright test harness and CI pipeline skeleton (GitHub Actions)
- Share audit findings with Meridian; confirm any assumption gaps before Phase 2 begins

**Milestone:** Architecture doc delivered; defect list confirmed; test infrastructure live.

---

### Phase 2 — Reports Remediation (Weeks 2–4)

- Resolve all R1 defects identified in Phase 1 audit (filter wiring, i18n gaps, API pattern inconsistencies, console noise)
- Each fix covered by an automated Playwright test before marking complete
- Interim review with Meridian at end of phase

**Milestone:** Reports module defect-free; R1 test coverage complete.

---

### Phase 3 — Restocking View (Weeks 4–7)

- Build Restocking recommendations view (R2): backend logic + Vue frontend
- Extend Playwright coverage to Restocking view
- Expand test suite to cover dashboard, inventory, and orders views (completing R3)
- *(If D1+D3 elected: UI modernization and dark mode work begins in parallel, weeks 5–7)*

**Milestone:** Restocking view live; full test suite covering all major views complete.

---

### Phase 4 — i18n Extension (Weeks 7–8)

- Extend i18n to remaining modules (D2), priority on Tokyo-facing views
- Validate with Meridian's Tokyo team if possible

**Milestone:** All views internationalized; Tokyo staff can operate in preferred language.

---

### Phase 5 — Hardening & Handoff (Week 8–9)

- Final end-to-end test pass across all views
- CI pipeline validated (scheduled runs + pull request triggers)
- Documentation review; architecture doc updated with any changes from delivery
- Formal handoff to Meridian IT

**Milestone:** Signed off and handed over.

---

## Schedule Overview

| Week | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10–11 |
|---|---|---|---|---|---|---|---|---|---|---|
| R4 Architecture | ██ | ██ | | | | | | | | |
| R3 Test harness | ██ | ██ | | | | | | | | |
| R1 Reports | | ██ | ██ | ██ | | | | | | |
| R2 Restocking | | | | ██ | ██ | ██ | ██ | | | |
| R3 Full coverage | | | | | ██ | ██ | ██ | | | |
| D2 i18n | | | | | | | ██ | ██ | | |
| D1+D3 *(optional)* | | | | | ██ | ██ | ██ | | | |
| Hardening & handoff | | | | | | | | ██ | ██ | |

---

## Notes

- **Feedback windows:** We build in a review checkpoint at the end of each phase. We assume Meridian can provide feedback within 3 business days; delays beyond that may shift subsequent phases.
- **Assumption validation:** If Phase 1 audit surfaces significant unknowns (e.g., demand data unavailable for R2), we will reforecast before Phase 2 begins. We will not absorb undisclosed scope silently.
- **Optional scope:** D1+D3 runs in parallel with Phase 3 and adds approximately 2 weeks if elected. D2 is included in the core timeline.
