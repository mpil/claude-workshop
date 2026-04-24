# Technical Approach

**RFP #MC-2026-0417 — Meridian Components Inventory Dashboard**

---

## Approach Overview

Our approach is sequenced around a simple principle: stabilize before extending. The existing codebase has known defects and no test coverage — building new capability on top of that increases risk for everyone. We will establish a reliable foundation (R1 remediation, R3 testing infrastructure) before delivering new features (R2, D1–D3), so that every change we make is verified and every handoff is clean.

Testing is not a final phase. Automated coverage is written alongside each fix and each feature, from day one. By the time we deliver R2, the test suite already covers R1. By final handoff, all major views are covered.

---

## R1 — Reports Module Remediation

We will begin with a structured audit of the Reports module before writing a single line of fix code. The RFP notes at least eight issues; our experience is that defect lists like this are minimums, not maximums, and that undocumented issues surface during audit. We will not assume the list is complete.

The audit will cover:

- **Filter wiring** — The previous vendor's handoff notes that "not all filters wired up" in Reports. We will verify which of the four filters (Time Period, Warehouse, Category, Order Status) are passing correctly via query params to the backend and fix any that are not.
- **i18n gaps** — We will identify all strings in the Reports view that are hardcoded in English and route them through the existing internationalization framework.
- **API pattern inconsistencies** — The codebase contains a mix of Vue 3 Composition API and older Options API patterns. We will identify Reports components still using Options API and migrate them to match the established pattern in the rest of the application.
- **Console noise and other defects** — Any additional issues surfaced during audit will be documented, triaged, and resolved within the R1 scope.

Each fix will be accompanied by an automated Playwright test that verifies the corrected behavior before we move on. The audit findings will be shared with Meridian at the end of Phase 1.

**Assumption:** R1 scope covers defects in the existing Reports view only. Requests for new Reports functionality are out of scope for this item.

---

## R2 — Restocking Recommendations View

The Restocking view is a new capability that gives operations staff a clear, actionable answer to the question: *given our current stock and budget, what should we order?*

The view will allow an operator to input a budget ceiling and will return a ranked list of recommended purchase orders based on:

1. **Stock deficit** — items where current stock is below reorder threshold
2. **Demand weighting** — items with higher forecast demand are prioritized
3. **Budget constraint** — recommendations are clipped to the operator-supplied ceiling, with the highest-priority items selected first

The feature will use the existing `/api/inventory` and `/api/demand` endpoints — no new backend data sources are required. The recommendation logic will live in the backend (FastAPI) so it is testable independently of the UI.

The frontend will be a new Vue view consistent with the existing application patterns, accessible from the main navigation.

**Assumption:** The existing `/api/demand` endpoint returns sufficient forecast data to support prioritization logic. If the audit reveals this endpoint is incomplete, we will document the gap in Phase 1 and agree on a data approach with Meridian before proceeding.

---

## R3 — Automated Browser Testing

We will use Playwright for end-to-end browser testing. Playwright is already configured in this repository and is well-suited to Vue applications with dynamic filter interactions.

Test coverage will span all major views:

| View | Coverage focus |
|---|---|
| Dashboard | Summary data loads, filter interactions |
| Inventory | Stock table, warehouse and category filters |
| Orders | Order list, status and date filters |
| Reports | All filters wired correctly, data displays accurately (ties directly to R1) |
| Restocking | Budget input, recommendation list, edge cases (zero budget, all in-stock) |

Tests are written alongside fixes and features, not after. This means the test suite grows incrementally and every merged change is covered.

We will also deliver a **CI pipeline configuration** (GitHub Actions) that runs the full test suite on a schedule and on pull requests. Meridian IT receives a working, automated pipeline — not a test suite that requires manual integration work.

---

## R4 — Architecture Documentation

Architecture documentation will be delivered at the end of Phase 1 (weeks 1–2), so Meridian IT has it before the main build work begins.

The deliverable will be an HTML document combining a system diagram with a written narrative, suitable for both technical and non-technical readers. It will cover:

- Frontend: Vue 3 / Composition API / Vite (port 3000)
- Backend: Python FastAPI (port 8001)
- Data layer: JSON files in `server/data/` (no database)
- API surface: all endpoints, filters, and data flow
- Filter system: how the four filters propagate from UI to backend
- Gaps and risks identified during onboarding audit (e.g., absence of a database, incomplete API migration)

We treat the previous vendor's handoff notes as a starting point, not a source of truth. The audit may surface discrepancies; those will be documented.

---

## D1 + D3 — UI Modernization and Dark Mode (Optional)

If elected, the UI modernization will align the application's visual design with Meridian's confirmed design system. We will confirm the target design system at project kickoff — this is the one open question we flag before contract execution (see Assumptions).

Dark mode will be implemented using CSS custom properties (design tokens) from the start of D1 work. This is the correct architectural approach and costs a fraction of what retrofitting dark mode would cost after the fact. Operators will be able to toggle between light and dark themes; the preference will persist across sessions.

Both items are bundled as a single optional line item because separating them would create unnecessary rework.

---

## D2 — Internationalization Extension

The existing application includes a partial i18n implementation. We will extend it to cover all remaining modules, with priority given to the views used most heavily by the Tokyo warehouse team (stock levels, orders).

We will not replace the existing i18n framework — we will extend it. Translation strings will be organized by view and delivered alongside the code changes.

**Assumption:** Vue i18n (or equivalent) is already partially configured in the codebase. If the audit reveals a different setup, we will document it and agree on the approach with Meridian in Phase 1.

---

## Assumptions

The following assumptions underpin this technical approach. We will validate each during the Phase 1 audit and flag any that do not hold.

- R1 scope covers defects in the existing Reports view only; new Reports features are out of scope.
- The `/api/demand` endpoint provides sufficient forecast data for the Restocking recommendation logic.
- Vue i18n (or equivalent) is already partially configured; D2 extends rather than replaces it.
- Meridian IT will confirm their CI/CD environment so the GitHub Actions pipeline can be targeted appropriately.
- **Open question before contract execution:** Meridian's preferred design system or component library for D1. Our approach accommodates any reasonable answer; we need this confirmed at kickoff to avoid design rework mid-engagement.
