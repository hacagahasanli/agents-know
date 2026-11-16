# Agent quality audit

Date: 2026-11-16. Reviewer: an independent staff-level review run as the `staff-reviewer` agent type. Scope: the 24 files in `agents/`, the shared contract `references/agent-standards.md`, the PM layer (`references/pm-playbook.md`, `company-modes.md`, `work-modes.md`, `quality-gates.md`, `templates/hand-back.md`, `skills/*/SKILL.md`) and the guard hook as it affects agents. `docs/local/` and `profiles/local/` were not read.

## How the changes were made

The guard hook (`hooks/guard.sh`) blocks the `staff-reviewer` agent type from writing anywhere outside a run directory or a test path, including `agents/`, `evals/` and `docs/`. The block was respected, not bypassed. All changes were made in a staged copy of the plugin at `~/.agents-know/runs/agent-quality-audit-20261116/preview/` (created with `rsync`, excluding `.git`, `docs/local` and `profiles/local`), validated there, and are waiting for the owner to apply. Unified diff of every changed file except the new `evals/` and this document: `~/.agents-know/runs/agent-quality-audit-20261116/changes.diff`. The edit scripts are in `~/.agents-know/runs/agent-quality-audit-20261116/scripts/edit1.py` to `edit6.py`; each replacement asserts its exact old text exists once.

To apply (owner, after reading the diff): `rsync -a --exclude .git ~/.agents-know/runs/agent-quality-audit-20261116/preview/ /path/to/agents-know/`, then re-run the two checks below in the repository.

## What was inspected

- `references/agent-standards.md`, `company-modes.md`, `pm-playbook.md`, `quality-gates.md`, `work-modes.md`, `templates/hand-back.md`: read in full.
- All 24 `agents/*.md`: read in full.
- `skills/forge`, `feature`, `fix`, `task`: read in full; `backlog`, `resume`, `status`, `recap`, `learn`, `setup`: searched for agent references only.
- `hooks/guard.sh` and `tests/guard.test.sh`: read in full.
- Frontmatter of every agent and skill: parsed with a strict YAML parser (Ruby `YAML.safe_load`).

## Findings and what changed

### Shared policy

| Finding | Severity | Change |
| --- | --- | --- |
| `frontend-engineer.md` and `skills/fix/SKILL.md` descriptions contain `: ` inside an unquoted YAML value; a strict parser rejects them ("mapping values are not allowed"). `claude plugin validate` did not flag it. | major | Replaced the colon with a dash in both. |
| Three verdict vocabularies (skeptic `PASS`, bar-raiser `ACCEPT/REWORK/REJECT`, staff review `approve/request changes`) had no mapping to the hand-back status words. | major | `agent-standards.md` §9 maps each verdict to `Complete` or `Rejected`. |
| Staff review severity (must-fix / should-fix / nit) was a third scale beside Critical-Low and blocker-minor. | major | §9 now maps all three names in one line. |
| Read-only agents were told to run experiments in disposable worktrees (QA mutation check, skeptic "tests bite", perf baseline build) while §4 says they never change code; the guard blocks `git apply` and `git checkout <ref>` for verifiers, so the skeptic's instruction "apply the new tests" could not run. | major | §4 allows a disposable worktree under the run directory, filled by copying files; `skeptic.md` step 5 copies test files with `cp`. |
| `dispatcher` has `disallowedTools: Edit` but was missing from the guard's read-only list. | minor | Added to `hooks/guard.sh`; two tests added to `tests/guard.test.sh`. |
| `work-modes.md` lean mode said "the reviewer fixes trivial issues itself"; reviewers are read-only. Its Opus list omitted bar-raiser and incident-commander. | major | PM makes trivial fixes (playbook §7); Opus list matches frontmatter. |
| `templates/hand-back.md` asked for "commit hashes"; agents never commit. | minor | "files changed". |
| Dispatcher was mandatory before every slice, including one-file tasks: a cost with no defect class caught. | minor | `company-modes.md` and `pm-playbook.md` §5: dispatcher for forge/feature phases and non-obvious slices; the PM staffs the work-mode minimum for a task or one-cause fix and records one ledger line. |

### Agents (beyond the three rewrites)

| Agent | Change |
| --- | --- |
| all 21 others | Working-rules pointer shortened to one sentence (it repeated the section list of agent-standards). |
| 16 agents | Descriptions shortened (total description words 1,052 → 875). Descriptions are loaded into the PM's context in every session, so this saves tokens at runtime, not only on disk. |
| incident-commander | Severity scale referenced as `pm-playbook.md` §7; it is §11. Fixed in both places. Removed a line duplicated by the expert standard. |
| cartographer | Was allowed to write only the two map files but also told to edit the profile; now asks the PM. Modes split into four lines. |
| accessibility, ip-guard, mentor, performance, qa, tech-writer, skeptic | Removed restatements of the read-only rule in §4; kept the role-specific part. |
| researcher, debugger, security, sre, migration, test-data, ip-guard, cartographer, skeptic, backend | Removed escalation lines that only restated agent-standards §5 (production access, secrets, legal). Backend's line now says what it does on a data repair. |
| security-engineer | Added an explicit check: every control the UI hides is called directly as that role. |
| upgrader | Added the case where a security fix exists only in a breaking major: compare backport, major and mitigation; breaking API goes to the PM with a contract note. |
| qa-engineer | Added its boundary with the skeptic. |
| product-designer | The template test is now operational (what a generic dashboard looks like and the question that replaces it). |
| test-data-engineer | Removed locale-specific identifiers and alphabet hard-coded for one country; they now follow the profile's locale. |
| analyst, architect | Removed inputs that agent-standards §1 already loads. |
| perf, sre, security, qa | Output sections no longer restate the findings template's severity field. |

### The three weakest files before the second pass

1. **`agents/bar-raiser.md`.** Scored nine axes 0-5 with no anchors, so a "3" meant whatever the model felt; four of the axes (security, architecture, docs, regressions) duplicated the staff review and the specialists; it had no step that rebuilt the DoD completion table, so a confident "Complete" with a green suite could score well. Rewritten: an anchored 0-5 scale shared by every mode; six axes; hard rejection when a hand-back says `Complete` with any required item unproven; the producing agent's own Expert standard is the discipline bar; explicit boundaries with skeptic and staff review; no moving goalposts across rounds.
2. **`agents/staff-reviewer.md`.** A generic review checklist that overlapped the bar-raiser and the specialists and did not target what green tests miss. Rewritten: risk-ordered reading (every line of authz, migrations, money and concurrency), a data-integrity section aimed at bugs that empty single-user test databases hide (existing rows, two writers, partial failure, dependents on delete), test quality by reading, a list of flows traced, severity mapped to blocker/major/minor, and explicit boundaries.
3. **`agents/dispatcher.md`.** Listed triggers and models but had no starting point, so staffing drifted toward the full roster; no rule removed overlapping reviewers; no cost check. Rewritten: a minimum team per work mode, roles added only on a cited trigger, an overlap rule naming the defect class only each reviewer catches, a cost count (more than four invocations on a task needs a reason), and the failure patterns in both directions.

Overlap between skeptic, bar-raiser, staff-reviewer and qa-engineer is now stated in each file: QA builds the evidence; the skeptic proves or disproves claims; the bar-raiser judges whether the evidence closes the DoD at the discipline's bar; the staff reviewer judges the code.

## Key decisions

- **The shared contract stays in `references/`, not `agents/`.** Claude Code loads every `.md` in `agents/` as an agent definition, so a shared file there would appear as a 25th agent.
- **The rest of each agent file was kept.** Most of the 24 files were already specific and operational (concrete checks, traps, evidence); rewriting them again would trade known content for unknown.
- **Word target not met.** Agent words went from 22,117 to 21,722 (`cat agents/*.md | wc -w`, before in the repository, after in the staged copy). The three rewrites added substance; most remaining words are Method and Expert-standard checks (about 13,000 of them). Cutting another 1,700 words would remove checks, which the brief ruled out. Candidates if the owner wants more: the `standard` line in Modes where it says "Method in full", and the "Use `agent-skills:...` when available" lines.

## `${CLAUDE_PLUGIN_ROOT}` in agent bodies

Evidence that Claude Code substitutes it in agent bodies, observed in this session: the installed copy at `~/.claude/plugins/cache/agents-know/agents-know/0.4.4/agents/staff-reviewer.md` line 15 contains the literal `${CLAUDE_PLUGIN_ROOT}/references/creativity-charter.md`, and the system prompt this reviewer was launched with contained the same sentence with an absolute path in its place. The hook error messages in this session also showed the variable resolved for hooks. Not verified: behaviour on other Claude Code versions, and whether substitution also happens inside fenced code blocks (the feed command in agent-standards §8 sits in inline code; the observed substitution was also inline code).

## Evaluation scenarios

`evals/README.md` explains how to run them by hand. `evals/agents/<agent>.md` exists for all 24 agents, each with a setup, planted defect or trap, what a strong agent must produce, checkable pass criteria and the typical failure. The scenarios requested in the brief are all present (researcher hidden permission and empty states; analyst contradictory rules; architect concurrency and tenant isolation; designer generic dashboard; frontend visually done but broken; backend cross-tenant IDOR; migration losing relations and history; QA tests that do not verify the requirement; security UI-only authorization; performance felt versus largest cost; accessibility modal; IP guard trade dress with different names; staff reviewer data integrity behind green tests; bar-raiser completion claim without evidence; skeptic weakened tests; cartographer stale map; dispatcher six-agent overkill, plus an under-staffing case; incident competing hypotheses; upgrader security fix with breaking API), plus scenarios for debugger, SRE, test-data, tech-writer and mentor.

**No scenario has been executed.** There are no results.

## Tests executed

| Check | Where | Result |
| --- | --- | --- |
| `claude plugin validate .` | repository, before changes | "Validation passed" |
| `bash tests/guard.test.sh` | repository, before changes | `guard: 46 passed, 0 failed` |
| `claude plugin validate .` | staged copy | "Validation passed" |
| `bash tests/guard.test.sh` | staged copy | `guard: 48 passed, 0 failed` |
| New dispatcher guard test against the original hook | `~/.agents-know/runs/agent-quality-audit-20261116/bite/` | `FAIL (block, got 0): dispatcher edits product code` (the test bites) |
| Strict YAML parse of all 34 frontmatters | repository, before | 2 failures (frontend-engineer, skills/fix) |
| Same | staged copy | 0 failures |
| Required sections (Inputs, Method, Expert standard, Modes with 4 lines, Output, Escalate when, Working rules) | staged copy, scripted | all 24 pass |
| Cross-references to `references/` files and section numbers | staged copy, scripted | no missing file; only §11 used for severity |

## Tests not executed

- **No live agent runs.** No agent was invoked on any scenario; behavioural claims about the agents are design review, not measurement.
- `claude plugin validate` and the guard tests were not re-run inside the repository after applying, because the changes have not been applied.
- No check of how Claude Code tolerates the two invalid YAML descriptions at load time; it may parse them leniently, but a strict parser does not.

## Remaining weaknesses and open concerns

1. **Unproven behaviour.** Every agent file is a prompt; none has been measured on a scenario. The eval files are the first step; an automated harness does not exist.
2. **Length.** 21,722 words across 24 agents, each loaded in full when its agent runs, plus `agent-standards.md` (about 1,400 words) read at the start of every task. Cost per run is not measured.
3. **Guard and instructions can still disagree.** The guard decides read-only by a hard-coded name list and by regex on the raw payload; it blocked this reviewer's own Bash call because a code comment in a heredoc contained the words of a blocked command. False positives like this will push verifiers toward workarounds. A rule keyed on `disallowedTools` in frontmatter, and matching on the command rather than the whole payload, would be sturdier.
4. **Mode lines are uneven.** Some agents state concrete deltas per mode; others say "Method in full". The four-line Modes format is followed, but the `standard` line often adds nothing over agent-standards §6.
5. **Two vocabularies remain by design** (Critical-Low for findings reports, blocker-minor for reviews); they are now mapped in one place, but agents must still translate.
