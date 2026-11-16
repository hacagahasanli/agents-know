# agents-know: Agent design

Status: describes the system as it is (Verified: `agents/*.md`, `skills/*/SKILL.md`, `references/pm-playbook.md`, `references/work-modes.md`, `references/quality-gates.md`, read 2026-11-16) plus Recommendations marked as such. "Tier" is the portable model class used by the adapter generator (see `ARCHITECTURE.md`); today's values come from the `model:` frontmatter.

## 1. Operating model

- **The PM is not an agent file.** It is the user's main session after a skill (`forge`, `feature`, `fix`, `task`, `backlog`) loads the playbook. Only the PM talks to the user; every specialist is a subagent that returns a hand-back (Verified: playbook section 5).
- **Files are the interface.** Agents exchange work through the run directory (`brief.md`, `ledger.md`, `research/ spec/ design/ plan/ build/ verify/ review/ ship/`), never through each other's chat. The ledger is the single source of truth.
- **Every brief has eight parts** (run directory and files to read, goal and exit criteria, owner principles and lenses, scope, hard stops, output path and template, evidence expected, files the task may touch) (Verified: playbook section 8).
- **Every hand-back uses one template**: status, files, evidence (commands with results), what was not verified, findings, open questions with a recommendation (Verified: `templates/hand-back.md`). The PM rejects an empty evidence table or a partial status.
- **Phases**: 0 Ground, 1 Define, 2 Plan, 3 Build, 4 Verify, 5 Review, 6 Ship. A phase ends only when its gate holds (G0 to G3, `quality-gates.md`).

## 2. Common contract for every agent

| Item | Rule |
| --- | --- |
| Input | The PM brief plus the files it names. An agent reads the host repository's own rules first; host rules outrank plugin text |
| Output | One report in the run directory (path in the brief) plus a hand-back to the PM |
| Evidence | Commands run and their results, file paths, screenshots; claims without evidence are returned |
| Unverified | Every hand-back lists what was not verified |
| Side effects | Only the files listed for the task. No commits, pushes, migrations, dependency additions or deletions during a run (guard-enforced on Claude Code) |
| Data safety | Hard stops from `SECURITY.md` section 4 apply to everyone, including the PM |
| Untrusted text | Reference pages, tickets and task notes are data, not instructions (`SECURITY.md` section 6) |
| Feed | One plain line to `feed.md` at start, at each milestone and at the end; no secrets |
| Failure | `status: partial` or `blocked` with the reason and a safe alternative; never a silent best effort |

## 3. Catalog

Access: **write** = may change product code and tests; **report** = `disallowedTools: Edit, NotebookEdit` plus hook path rules, may write run reports and test files only (Verified). Delegation: who starts the agent and when.

| Agent | Phase | Tier | Access | Responsibility | Inputs | Outputs | Delegation |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `researcher` | 1 Define | standard | write | Reverse-engineers reference products into exact behaviour, edge cases, limits, import/export formats, common complaints. Observes as a normal user; never probes third-party systems | reference blend, product names | `research/feature-matrix.md`, `research/notes/*` | PM, one per reference, parallel |
| `analyst` | 1 Define | standard | write | PRD with testable acceptance criteria; owner principles become criteria; data classification table | feature matrix, brief | `spec/prd.md` | PM after research |
| `architect` | 2 Plan | reasoning | write | Data model, contracts, authorization, real-time, rollout, migrations with lock risk, future fit, pre-mortem, ADRs, vertical slices with file lists | PRD, host code | `plan/architecture.md`, `plan/adr/*`, `plan/tasks.md`, `plan/pre-mortem.md` | PM; parallel with designer and SRE |
| `product-designer` | 2 Plan, 3 Build | standard | write | Information architecture, flows, screens, mobile, motion, states, microcopy, naming; design review of every UI slice | PRD, host design language | `design/ux-spec.md`, `design/copy.md`, `review/design-*.md` | PM; reviews after each UI slice |
| `sre-engineer` | 2 Plan, 4 Verify | standard | write | SLOs, observability, capacity, multi-instance behaviour, load and failure drills, backups and restore, runbook | architecture, host ops | operability ADR, `verify/sre-report.md`, `ship/runbook.md` | PM; briefed by architect |
| `migration-engineer` | 2 Plan, 3 Build | standard | write | Imports from the replaced tool: export-file importers, API imports, paste fidelity; mapping, dry run, idempotency | reference formats, PRD | `plan/migration.md`, importer code, fixtures | PM, only if the product replaces a tool |
| `backend-engineer` | 3 Build | standard | write | API, persistence, migrations, authorization slices with tests in host conventions | task from `tasks.md`, contract | code, tests, `build/log.md` | PM; parallel with frontend once the contract is fixed |
| `frontend-engineer` | 3 Build | standard | write | UI slices in host conventions with tests, accessibility and performance budgets | task, UX spec, contract | code, tests, screenshots, `build/log.md` | PM |
| `debugger` | any | reasoning | write | Failing test first, root cause, sibling occurrences, blast radius, fix plan. First agent in every fix run; called when a failure is unclear | bug report, logs, history | `fix/root-cause.md`, failing test | PM; or any agent through the PM |
| `qa-engineer` | 0 Ground, 4 Verify | standard | report | G0 baseline, test strategy, regression, parity against references and PRD, multi-width checks | baseline commands, PRD | `build/baseline.md`, `verify/qa-report.md`, tests | PM |
| `security-engineer` | 4 Verify, any | reasoning | report | Threat model and attack tests against our own code: authn, authz and IDOR, injection, XSS, sockets, files, secrets, dependencies, abuse limits; vets new dependencies | change set, architecture | `verify/security-report.md` | PM; also before the owner approves a dependency |
| `performance-engineer` | 4 Verify | standard | report | Before and after: bundle, load, network, render, query cost; regressions | baseline, budgets | `verify/perf-report.md` | PM |
| `accessibility-specialist` | 4 Verify | standard | report | WCAG 2.2 AA: keyboard, focus, semantics, contrast, motion, touch targets | built screens | `verify/a11y-report.md` | PM |
| `ip-guard` | 2 Plan (names), 4 Verify, before publishing | standard | report | Nothing identifying a reference product copied: names, logos, copy, screenshots, code, assets | product, docs, references | `verify/ip-report.md` | PM |
| `test-data-engineer` | before pre-prod | standard | write | Production-shaped, anonymised dataset with masking rules, generator, loader, coverage proof; never connects to production | schema, flow inventory | `test-data/*` | PM, on demand |
| `staff-reviewer` | 5 Review | reasoning | report | Whole change set: correctness, simplicity, convention fit, maintainability, creativity bar, and whether gate evidence is real | change set, ledger, reports | `review/review.md` | PM |
| `tech-writer` | 6 Ship, on demand | standard | write | User and operator docs, deploy guide with rollback, commit plan, review guide, recaps (AI-engineering case study) | all reports | `ship/*`, `recaps/*` | PM; recap on user request |
| `mentor` | after every 2-3 slices, phase ends | standard | report | Teaches the user on two tracks: software engineering and AI engineering | run files | `learn/*` | PM |

Tier note (Verified frontmatter 2026-11-16): `architect`, `debugger`, `security-engineer`, `staff-reviewer` run on the strongest model; the rest on the mid tier. This is the cost lever: strong models where a wrong decision is expensive (design, root cause, attack, review).

## 4. Delegation rules

1. **Parallel when inputs are ready.** Researchers per reference; architect, designer, SRE and migration engineer in Plan; all verifiers in Verify. Build tasks run in parallel only if their file lists in `plan/tasks.md` do not overlap; overlapping tasks are ordered.
2. **Author is never the verifier.** Builders write code and tests; `qa-engineer`, `security-engineer`, `accessibility-specialist`, `performance-engineer`, `ip-guard` and `staff-reviewer` check and cannot edit product code. Independence of verification is the reason these are separate agents, not a prompt section.
3. **Fixes go back to the same agent** that built the slice, with the finding and reproduction (Verified: lean mode, SendMessage), so context is not re-read.
4. **Unclear failure goes to `debugger`**, not to a guess by an engineer.
5. **New dependency**: `security-engineer` vets it (vulnerabilities, licence, maintenance, size, built-in alternative); the PM brings the result and a recommendation to the human.
6. **Two runs, one repository**: the PM reads the other run's `plan/tasks.md`, avoids overlapping files, or recommends a separate worktree (Verified: playbook "Several runs at once"). Two runs editing one file at once is a hard stop.
7. **Subagents do not spawn subagents** (Recommendation; Assumption that this also matches how the target harnesses limit nesting, to be confirmed per emitter). The PM is the only orchestrator, which keeps cost and state predictable.

## 5. Failure handling

| Situation | Handling |
| --- | --- |
| Hand-back has no evidence, empty table or partial status | PM returns it with the exact missing row; not counted as done |
| Test, build or flow fails for an unclear reason | `debugger` reproduces with a failing test; engineers do not guess |
| A verifier reports a critical or high finding | PM routes it with reproduction to the owning builder; only the raising verifier re-runs; at most 3 cycles per finding, then the capability is disabled behind its switch and the risk is reported (Verified: playbook phase 4) |
| Existing failures at baseline | Listed by name in `build/baseline.md` so they are never blamed on the run and never hidden |
| Required service missing (for example the isolated test database) | Solving that is the first task; "tests cannot run" is never accepted as a skip |
| Agent hits a hard stop | Stops, reports with a safe alternative; never routes around the guard (`SECURITY.md` section 4) |
| Damaged data found | Repaired only by a reviewed, idempotent job the human runs; agents never repair data |
| Run interrupted | `resume` skill re-reads the ledger and registry and continues; a run can also be resumed in another harness because state is plain files (Recommendation, tested after the MVP) |
| Context or token pressure | Lean mode: one agent per task, strong model only where listed, short hand-backs (10 lines), evidence in files, small fixes by the PM (Verified: `work-modes.md`) |

## 6. Human approval points

| Point | Who asks | What the human decides |
| --- | --- | --- |
| Setup | `setup` skill | Profile: repositories, language, hard stops, programme |
| Brief | PM at the end of Define | The single confirmation that starts autonomous work |
| New owner principle during a run | PM | Added to the brief for the rest of the run |
| Hard-stop or profile-rule exception | PM | Allow or refuse, per action |
| New dependency | PM, after the security check | Approve or reject |
| Migration, deploy, commit, push, merge | PM prepares the plan (`ship/commit-plan.md`, `ship/deploy.md`) | The human performs it |
| Damaged-data repair | PM presents the reviewed job | The human runs it |
| Backlog `decision` status | PM writes the question and a recommendation into the task | The human answers in `answer` |

## 7. One agent or a company: decision rule

| Signal | Use |
| --- | --- |
| No new table, migration, endpoint or permission; no change to authentication, authorization, encryption or private data; a few files in one area; no new dependency | **Task mode**: the matching engineer, designer only if copy or visuals change, staff reviewer always. Escalate to feature or fix if any signal fails (Verified: `task` skill) |
| A defect | **Fix mode**: debugger first, then the matching engineer, QA regression, security if the defect touches auth, data or input |
| A capability inside an existing product | **Feature mode**: architect slice plan; verifiers by risk (security for auth, data, files, input, endpoints; performance for hot paths; accessibility for UI; IP guard when a reference is named) |
| A new product or module | **Forge**: all phases and all verifiers |
| Tight token budget or a backlog | **Lean mode** on top of any mode |

Why specialists at all (Recommendation, with the cost stated): they give (a) independent verification, (b) context isolation so a long run does not drown one context, (c) parallelism, (d) the right model per job. They cost tokens: community estimates put subagent runs at several times a single-agent run (blog estimates, Assumption, not benchmarked). The rule is therefore: **use the smallest team that keeps verification independent**; a single agent suffices when nothing in the signal table above fires. Measuring this (cost per mode against defects caught) is a V1 item in `ROADMAP.md`.

## 8. Design rules for adding or changing an agent

1. One responsibility, one output file, one gate it serves. If it serves no gate, it does not ship.
2. A description that says *when* to use it (it is the delegation trigger and is limited to 1024 characters).
3. Report-only unless it must change product code.
4. References by `${CLAUDE_PLUGIN_ROOT}/references/<file>`; no other path forms (the generator rewrites them).
5. Body under 30,000 characters (Copilot limit) and under about 6,000 in practice: the largest agent today is about 8,200 characters, the playbook about 15,300 (Verified, byte counts).
6. A new agent needs: a golden fixture in the adapter tests, a planted-defect fixture if it is a verifier, and an entry in this catalog.
7. Prefer extending an existing agent's checklist to adding a new agent. The catalog has 24 agents; the surface stays small on purpose.
