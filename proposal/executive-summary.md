# Executive Summary

**RFP #MC-2026-0417 — Meridian Components Inventory Dashboard**
**Submitted by:** Accenture
**Date:** April 28, 2026

---

Meridian Components operates a business-critical inventory dashboard across three warehouses. The system works — but it's carrying unresolved defects, no test coverage, and capability gaps that are slowing down your operations team and blocking your IT team from approving changes. This isn't a technology problem. It's a reliability problem, and it has a direct cost: your Tokyo staff working around an English-only interface, your operations team without the restocking visibility they've asked for, and your IT team unable to say yes to any of it until the foundation is solid.

We propose to fix that foundation first, then build on it.

Our approach prioritizes in Meridian's stated order: remediate the Reports module defects (R1), deliver the Restocking recommendations view (R2), establish automated browser test coverage across all major views (R3), and document the current architecture for your IT team (R4). We will address these as a sequenced engagement — testing infrastructure goes in early so that every subsequent change is covered from day one, not retrofitted at the end.

We are proposing a fixed fee of **$85,000** with a not-to-exceed cap, broken down as follows:

| Item | Scope | Fee |
|---|---|---|
| R1 — Reports remediation | Audit and resolve all defects; full filter wiring, i18n gaps, API consistency | $18,000 |
| R2 — Restocking view | New recommendations view with stock, demand, and budget-ceiling logic | $28,000 |
| R3 — Automated testing | Playwright end-to-end coverage across dashboard, inventory, orders, reports, restocking | $16,000 |
| R4 — Architecture docs | Current-state review and handoff documentation for Meridian IT | $8,000 |
| D2 — i18n extension | Extend internationalization to remaining modules for Tokyo warehouse staff | $15,000 |
| **Total (R1–R4 + D2)** | | **$85,000** |

Optional additions, available at Meridian's discretion:

| Item | Scope | Fee |
|---|---|---|
| D1 + D3 — UI modernization + dark mode | Visual refresh aligned to Meridian's design system; operator-selectable dark theme | $22,000 |

D1 and D3 are bundled because implementing dark mode as part of the initial UI work (using CSS custom properties) costs a fraction of what it would cost to retrofit later. If Meridian elects this option, the total engagement is **$107,000**.

All fees are fixed. We absorb overruns; Meridian does not pay for scope creep on our side.

## Estimated Timeline

We estimate an 8–11 week engagement from contract execution to final delivery, depending on Meridian's feedback cadence and whether the optional D1/D3 scope is included.

| Phase | Work | Weeks |
|---|---|---|
| 1 — Onboarding & architecture | Codebase audit, architecture documentation (R4), test harness setup (R3 foundation) | 1–2 |
| 2 — Reports remediation | Resolve all R1 defects; tests added as each fix is verified | 2–3 |
| 3 — Restocking view | Build and test R2; expand automated coverage to new view | 2–3 |
| 4 — i18n extension | D2 rollout to remaining modules | 1–2 |
| 5 — Hardening & handoff | Final test pass, documentation review, IT handoff | 1 |
| *(Optional) D1 + D3* | UI modernization and dark mode, run in parallel with Phase 3–4 | +2 |

Testing (R3) runs throughout — not as a final phase. Architecture documentation (R4) is delivered at the end of Phase 1 so Meridian IT has it early.

---

We have one open question to resolve before contract execution: Meridian's preferred design system or component library (referenced in §3.2, D1). Our technical approach accommodates any reasonable answer; we flag it here so it doesn't delay kickoff.

We are confident in this scope, this timeline, and this price. We will not be the vendor that hands you thin documentation and an incomplete Reports module.
