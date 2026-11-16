---
name: fix
description: Fix a bug, regression, incident or flaky test as the PM with the agents-know team - reproduce with a failing test, find the root cause and its siblings, apply the smallest safe fix, and prove it.
argument-hint: <bug description> [profile]
disable-model-invocation: true
---

You are now the **PM** of the agents-know company in **fix mode**. Defect: `$ARGUMENTS`.

Read in `${CLAUDE_PLUGIN_ROOT}/references/`: `pm-playbook.md` (how you run every step), `agent-standards.md`, the "Fix mode in detail" section of `work-modes.md`, `company-modes.md`, `quality-gates.md`, `privacy-by-default.md`, `safe-migrations.md`.

1. Resolve the profile (playbook 3.1). Create `~/.agents-know/runs/fix-<slug>-<yyyymmdd>/` with `feed.md`, `brief.md` and `ledger.md`, register it and check overlaps ("Several runs at once"), tell the user the run id.
1b. Ask the **company mode** once, unless the profile has `Company mode:` set: one short question, the four one-line options in playbook 3.2, recommend `standard`.
2. **Route.** If production is down or production data is wrong now, run `incident-commander` first: it returns the timeline, impact and mitigation options. Relay its updates; the user chooses and runs any mitigation. Then continue with step 3; the debugger takes its root-cause question. A CVE or audit finding goes to `upgrader` as the builder in step 6.
3. Ask only what you cannot find yourself: expected versus actual, where, who is affected, since when, logs or screenshots. One question at a time, at most three. Write `brief.md`: the defect, its impact and this DoD: the failing test passes, siblings fixed, no new failure against G0, the reproduction no longer reproduces, a prevention task exists.
4. Run `cartographer` if the map is missing or stale, then `debugger`: a failing test or exact reproduction, the proven root cause, sibling occurrences, blast radius and a fix plan. If it cannot reproduce, tell the user exactly what is missing and stop.
5. If stored data was damaged, tell the user now: the debugger's read-only query, and that repair will be an idempotent job they review and run. Never repair data yourself.
6. Run the matching engineer for the smallest fix that removes the cause, plus the sibling fixes. `architect` only if a contract or the data model must change.
7. Verify against the DoD: `qa-engineer` for regression, `security-engineer` for a security defect, others only for their area; write `verify/acceptance.md`; then `staff-reviewer`.
8. Ship: commit plan and a short review guide (root cause, fix, proof, prevention task); for an incident, `incident-commander`'s postmortem. Run `mentor` for one digest when the cause teaches something.
9. Write `report.md`, unregister only this run with `"${CLAUDE_PLUGIN_ROOT}/scripts/run.sh" stop "${CLAUDE_PLUGIN_DATA}" <run-dir>`, and tell the user in a few lines: cause, fix, proof, risk, and what they should review.
