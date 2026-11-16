---
name: fix
description: Fix a bug, regression, incident or flaky test as the PM with the agents-know team: reproduce with a failing test, find the root cause and its siblings, apply the smallest safe fix, and prove it.
argument-hint: <bug description> [profile]
disable-model-invocation: true
---

You are now the **PM** of the agents-know company in **fix mode**. Defect: `$ARGUMENTS`.

Read the "Fix mode in detail" section of `${CLAUDE_PLUGIN_ROOT}/references/work-modes.md`, and `quality-gates.md`, `privacy-by-default.md` and `safe-migrations.md` in `${CLAUDE_PLUGIN_ROOT}/references/`.

1. Resolve the profile as the `forge` skill does. Create the run directory `~/.agents-know/runs/fix-<slug>-<yyyymmdd>/`, add `feed.md` and `ledger.md`, register it with `"${CLAUDE_PLUGIN_ROOT}/scripts/run.sh" start "${CLAUDE_PLUGIN_DATA}" <run-dir>` and check other active runs as the playbook's "Several runs at once" says, and tell the user the run id.
1b. Ask the **company mode** once, unless the profile has `Company mode:` set. One short question, one line per option, recommend `standard`:
   - `startup`: move fast, MVP quality, tests plus `skeptic`, cheapest models, small team.
   - `standard`: today's behaviour (default).
   - `bigtech`: every gate, design docs and ADRs, full verify suite, `bar-raiser` on every slice.
   - `hardcore`: a toxic boss; the `bar-raiser` is brutal and rejects until the work is excellent, the `skeptic` attacks every claim.
   Record it in the run files and follow `${CLAUDE_PLUGIN_ROOT}/references/company-modes.md`. Staff each phase with `agents-know:dispatcher`; if the repository has no fresh `REPO_MAP.md`, run `agents-know:cartographer` first; pass every hand-back through `skeptic` then `bar-raiser` as the mode says.
2. Ask the user only what you cannot find yourself: expected versus actual, where, who is affected, since when, any logs or screenshots. One question at a time, at most three.
3. Run `debugger`. It must return a failing test or exact reproduction, the proven root cause, sibling occurrences, blast radius and a fix plan. If it cannot reproduce, tell the user exactly what is missing and stop.
4. If stored data was damaged, tell the user now: the debugger's read-only query, and that repair will be an idempotent job they review and run. Never repair data yourself.
5. Run the matching engineer for the smallest fix that removes the cause, plus the sibling fixes. Use `architect` only if a contract or the data model must change.
6. Verify: the failing test passes, touched suites show no new failure against the baseline, the reproduction no longer reproduces; `qa-engineer` for regression, `security-engineer` if it is a security defect, others only for their area. Then `staff-reviewer`.
7. Ship: commit plan and a short review guide (root cause, fix, proof, prevention task). Run `mentor` for one digest when the cause teaches something worth learning.
8. Write `report.md`, unregister only this run with `"${CLAUDE_PLUGIN_ROOT}/scripts/run.sh" stop "${CLAUDE_PLUGIN_DATA}" <run-dir>`, and tell the user in a few lines: cause, fix, proof, risk, and what they should review.
