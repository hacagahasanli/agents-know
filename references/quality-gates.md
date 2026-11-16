# Quality gates

Prompts describe intent; gates produce evidence. A gate passes only with the evidence listed next to it, recorded in the ledger or a report. "I checked" without output is a failed gate.

## G0 - Baseline (before the first line of product code)

| Check | Evidence |
| --- | --- |
| Full frontend test suite, type check, lint, architecture check, production build | Command, pass/fail counts, build chunk sizes, saved to `build/baseline.md` |
| Full backend test suite and lint | Command and counts in `build/baseline.md` |
| Existing failures | Listed by name, so they are never blamed on the run and never hidden |
| Isolated test database and services available; database tests actually run | Connection target (local only) and the run output |
| Screens of the existing app shell at 390 and 1280 px | Paths to screenshots |

## G1 - Plan

| Check | Evidence |
| --- | --- |
| Every MVP acceptance criterion maps to a task and a test | Traceability table in `plan/tasks.md` |
| Pre-mortem done and every cause has a mitigation task or an accepted risk | `plan/pre-mortem.md` |
| Owner principles each turned into acceptance criteria | Section in `spec/prd.md` |
| Data model reviewed for the next products in the programme | ADR "future fit" |
| Migration strategy is expand-only and backward compatible | ADR "migrations and rollout" |
| Import and export path from the tool being replaced | ADR "migration in" when the product replaces an existing tool |
| Every stored field and file classified; protection per class decided | Classification table in `spec/prd.md`, ADR "data protection" |
| Every migration has its lock risk and safe pattern | Migration table in `plan/architecture.md` (`safe-migrations.md`) |
| SLOs, alerts, capacity and multi-instance behaviour decided | ADR "operability" |
| Every task lists the files it touches; overlapping tasks are ordered | `plan/tasks.md` |

## G2 - Every slice

| Check | Evidence |
| --- | --- |
| New tests for the slice pass | Command output |
| Touched suites, type check, lint, architecture check pass | Command output |
| No new failure against G0 | Diff of counts |
| Database tests of the slice executed on the isolated test database | Run output, not only the test file |
| UI slices: screenshots at 320, 390, 1280 px and states; design review without open high findings | `build/screens/<task>/`, `review/design-<task>.md` |
| UI slices: skeleton and loaded state keep the same layout; modals keep their size when data arrives | Paired screenshots and the container-box test (`visual-stability.md`) |
| Migrations of the slice applied to the test database | Output |

## G3 - Release candidate

| Check | Evidence |
| --- | --- |
| Full suites of both repositories: no new failure against G0 | Counts before and after |
| Production build succeeds; initial bundle growth within budget | Chunk table before and after |
| Main flows of the new product, end to end, at 320, 390, 768, 1024, 1280 px | Screenshots per width |
| Smoke pass of existing modules of the host app (navigation, main pages load, no console errors) | List of pages checked and results |
| Real-world import samples (tables, images, code blocks, mentions, nested lists, long documents) | Fixtures and results |
| Offline, reconnect, slow network, two users at once | Scenario results |
| No unexpected layout shift in the main flows (load, refetch, real-time update, modal, pagination) | Layout-shift totals per flow from the performance report |
| Private content and secrets are not plain text in the database or storage; logs and errors carry no content | Raw storage test and log scan results |
| Load test to the planned peak and failure drills (worker, database, cache, socket) | `verify/sre-report.md` with p95, p99, errors |
| Restore of the new data from backup rehearsed on the test environment | Steps and timing |
| New dependencies checked (vulnerabilities, licence, maintenance) | Security report section |
| Change set combined with the latest main integration branch passes | Upstream drift section of the QA report |
| Zero open critical or high findings | Findings table |
| Rollback plan: feature can be hidden without a deploy; migrations need no downgrade to roll back | `ship/deploy.md` |
| Commit plan of small, independently green commits; runbook | `ship/commit-plan.md`, `ship/runbook.md` |

## Release rules that prevent downtime and regressions

1. **Expand, never contract, in the same release.** Add tables and nullable columns; never drop, rename or tighten in the same change that starts using the new shape.
2. **Old clients keep working.** API changes are additive; removed fields stay until a later release.
3. **Feature flag or module access.** A new product can be switched off without a deploy.
4. **Idempotent jobs and imports.** Running twice never duplicates data.
5. **Fail closed, degrade gracefully.** If the new product's API or socket fails, the rest of the host app keeps working and shows a clear state.
6. **Measure before claiming.** Every performance or reliability claim has a number from this run.
7. **Live-database safe.** Migrations follow `safe-migrations.md`: no long locks, no table rewrites, data work in batched jobs.
8. **Gradual rollout.** Internal users first, then a group, then everyone, each step decided by a signal from the runbook.
