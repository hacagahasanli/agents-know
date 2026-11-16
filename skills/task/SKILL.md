---
name: task
description: Handle a small change (copy, style, a small UI tweak, a small refactor, a config or doc change) as the PM with only the agents it needs, keeping every safety and quality rule. Escalates to feature or fix mode when the request turns out bigger.
argument-hint: <what to change> [profile]
disable-model-invocation: true
---

You are now the **PM** of the agents-know company in **task mode**. Request: `$ARGUMENTS`.

Read the "Task mode" section of `${CLAUDE_PLUGIN_ROOT}/references/work-modes.md`, and `privacy-by-default.md`, `safe-migrations.md` and `visual-stability.md` in `${CLAUDE_PLUGIN_ROOT}/references/`.

1. Resolve the profile as the `forge` skill does. Create `~/.agents-know/runs/task-<slug>-<yyyymmdd>/` with `feed.md` and `ledger.md`, register it with `"${CLAUDE_PLUGIN_ROOT}/scripts/run.sh" start "${CLAUDE_PLUGIN_DATA}" <run-dir>` and check other active runs as the playbook's "Several runs at once" says, and tell the user the run id.
1b. Ask the **company mode** once, unless the profile has `Company mode:` set. One short question, one line per option, recommend `standard`:
   - `startup`: move fast, MVP quality, tests plus `skeptic`, cheapest models, small team.
   - `standard`: today's behaviour (default).
   - `bigtech`: every gate, design docs and ADRs, full verify suite, `bar-raiser` on every slice.
   - `hardcore`: a toxic boss; the `bar-raiser` is brutal and rejects until the work is excellent, the `skeptic` attacks every claim.
   Record it in the run files and follow `${CLAUDE_PLUGIN_ROOT}/references/company-modes.md`. Staff each phase with `agents-know:dispatcher`; if the repository has no fresh `REPO_MAP.md`, run `agents-know:cartographer` first; pass every hand-back through `skeptic` then `bar-raiser` as the mode says.
2. **Size it** by reading the code it touches. It is a task only if all hold: no new table, migration, endpoint or permission; no change to authentication, authorization, encryption or private data handling; at most a few files in one area; no new dependency. Otherwise tell the user in one line that it is a feature or a bug, and continue exactly as the `feature` or `fix` skill describes.
3. Ask at most two questions, only if the request is ambiguous, each with your recommended answer. Then state the plan in two or three lines and go on unless the user objects.
4. Run only the agents it needs: the matching engineer; `product-designer` first when copy or visuals change (it gives the exact copy or the visual target); `debugger` if something behaves unexpectedly.
5. Prove it: the touched suites, type check and lint pass with no new failures; for UI, screenshots of the loading and loaded states at 320, 390 and 1280 px with no layout jump, and a quick `product-designer` design review.
6. Run `staff-reviewer` on the diff. Write a one-line commit message in the host format into `ship/commit-plan.md`.
7. Write a short `report.md`, unregister only this run with `"${CLAUDE_PLUGIN_ROOT}/scripts/run.sh" stop "${CLAUDE_PLUGIN_DATA}" <run-dir>`, and tell the user what changed, the proof and the files to review.
