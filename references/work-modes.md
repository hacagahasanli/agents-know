# Work modes

The same company handles a whole product, a feature or a bug. The PM picks the mode from the request, says which one in the first line, and scales the phases. The bar never drops: data safety, privacy by default, owner principles, evidence and "never down, never backwards" apply in every mode.

## Which command

| The user wants | Command |
| --- | --- |
| A new product or module | `/agents-know:forge <product>` |
| New behaviour inside something that exists | `/agents-know:feature "<what>"` |
| Something that is broken, a regression, a flaky test | `/agents-know:fix "<what is wrong>"` |
| A small change: copy, style, small tweak or refactor, config, docs | `/agents-know:task "<what>"` |
| Not sure | `/agents-know:task` - it sizes the request and switches to feature or fix when needed |

| | Product (`forge`) | Feature (`feature`) | Fix (`fix`) |
| --- | --- | --- | --- |
| Use for | A new product or module, with or without reference products | A capability inside something that already exists | A defect, a regression, an incident, a flaky test |
| Run id | `<product>-<yyyymmdd>` | `feat-<slug>-<yyyymmdd>` | `fix-<slug>-<yyyymmdd>` |
| Interview | Every lens | The lenses the feature touches; reuse the product's brief and owner principles | Only what is needed to reproduce: expected, actual, where, who, since when |
| Research | `researcher` per reference | Only when the user names a reference or the behaviour is unclear | None; `debugger` reads code, logs the user gives, history |
| Plan | Full: architect, designer, SRE, migration engineer, pre-mortem | Architect slice plan and ADRs for new decisions; designer for any UI; SRE when it adds load, jobs or new failure modes | `debugger` root cause report and fix plan; architect only when the fix changes a contract or the data model |
| Build | Slices | Slices | Failing test first, then the smallest fix that removes the root cause |
| Verify | All verifiers | QA always; security when it touches auth, data, files, input or new endpoints; performance when it touches hot paths; accessibility when it touches UI; IP guard when a reference is involved | QA regression; security when the defect is a security issue; others only when the fix touches their area |
| Gates | G0-G3 | G0-G3 | G0 for touched suites, G2, and G3 rows that apply |
| Ship | Full docs, commit plan, review guide | Commit plan, review guide, user doc when behaviour changes | Commit plan, short review guide with root cause and proof |

## Lean mode (backlog runs and tight token budgets)

Use it when the user works through a backlog or says tokens are tight. Quality checks stay the same; only the ceremony shrinks.

1. **Map first.** Every brief starts with "Read `REPO_MAP.md` first; grep `REPO_INDEX.md` to find symbols; open only the files the task needs." The setup skill creates both. A task that adds a module or pattern adds one line to the map.
2. **One agent per task.** One engineer builds backend, frontend and tests. No separate designer or architect unless the task is mostly a new screen or a new data model.
3. **Models by role.** Builders run on Sonnet (agent frontmatter). Opus stays on architect, debugger, security-engineer, staff-reviewer, bar-raiser and incident-commander.
4. **Review by risk.** One review round only for changes to authentication, authorization, money or balances, migrations or private data. Reviewers are read-only; the PM makes a trivial fix itself (pm-playbook section 7). Other tasks rely on their own tests and checks.
5. **Fixes go back to the same agent** (SendMessage), never to a new one, so nothing is re-read.
6. **Quiet output.** Agents run tests through summary-only wrappers (failures plus the summary line; full log in a file), run touched suites per task, and the full suites once at the end on the integration branch.
7. **Short hand-backs.** At most 10 lines to the PM; evidence lives in the run log file. The PM reads the file only to spot-check a claim.
8. **Parallel safely.** Independent tasks run in git worktrees, each with its own local test database.
9. **Small fixes by the PM.** A change of a few lines is made directly by the PM, not by a new agent.

## Task mode in detail

For small changes that would be wasteful with the whole company. The bar stays the same: data safety, privacy, owner principles, evidence and no regressions.

1. **Size first.** A task has no new table, migration, endpoint or permission, no change to authentication, authorization, encryption or private data, touches a few files in one area and adds no dependency. Anything else is escalated to feature or fix mode, and the PM says so.
2. **Minimal team.** The matching engineer; the designer when copy or visuals change; the debugger when behaviour is unexpected; the staff reviewer always.
3. **Proof.** Touched suites, type check and lint without new failures; screenshots at 320, 390 and 1280 px for UI.
4. **Output.** The change, a one-line commit message in the host format, a short report.

## Fix mode in detail

1. **Reproduce.** The `debugger` writes a failing automated test or an exact reproduction script before any change. No reproduction means no fix: the run reports what is missing to reproduce.
2. **Root cause, not symptom.** The report states the cause, why it happened, when it was introduced (git history), and every other place the same cause can occur.
3. **Blast radius.** Which users, data and modules are affected; whether stored data was damaged. Damaged data is repaired only by a reviewed, idempotent job the user runs, never by the agents.
4. **Smallest safe fix** by the matching engineer, plus fixes for the sibling occurrences found in step 2.
5. **Prove.** The failing test passes, the touched suites have no new failures against G0, and the reproduction no longer reproduces.
6. **Prevent.** One line on what would have caught it earlier (test, type, lint rule, alert) and a task for it.

## Product types

The PM records the type in the brief and adapts the gates. A row that does not apply is marked "not applicable" with a reason, never silently skipped.

| Type | What changes |
| --- | --- |
| Web app module inside a host | Default. Host shell, screenshots per width, smoke of existing modules |
| New standalone web app or site | No host to fit; designer creates the design system; SRE defines hosting, domains, TLS, backups |
| API or backend service | Contract tests, versioning, rate limits, SLOs; no screenshots |
| Mobile app or PWA | Device matrix, offline, push, app store or install constraints, battery and data use |
| CLI or developer tool | Help text, exit codes, idempotency, cross-platform paths, no secrets in shell history |
| Library or package | Public API stability, SemVer, docs with examples, supported runtimes, bundle size |
| Data pipeline or job | Idempotency, backfills, late and duplicate data, monitoring of freshness and volume |
| AI or LLM feature | Eval set with pass criteria before build, prompt-injection and data-leak tests, cost and latency budgets, fallback when the model fails, no private data sent to third parties without approval |
