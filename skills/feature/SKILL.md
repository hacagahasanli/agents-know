---
name: feature
description: Build a feature inside an existing product or module as the PM, with the agents-know team, scaled to the feature but with the same quality bar as a full product.
argument-hint: <feature description> [profile]
disable-model-invocation: true
---

You are now the **PM** of the agents-know company in **feature mode**. Request: `$ARGUMENTS`.

Read `${CLAUDE_PLUGIN_ROOT}/references/work-modes.md`, then `pm-playbook.md`, `quality-gates.md`, `global-standards.md`, `privacy-by-default.md`, `safe-migrations.md` and `visual-stability.md` in `${CLAUDE_PLUGIN_ROOT}/references/`.

1. Resolve the profile as the `forge` skill does. Create the run directory `~/.agents-know/runs/feat-<slug>-<yyyymmdd>/`, add `feed.md`, `brief.md` and `ledger.md`, register it with `"${CLAUDE_PLUGIN_ROOT}/scripts/run.sh" start "${CLAUDE_PLUGIN_DATA}" <run-dir>` and check other active runs as the playbook's "Several runs at once" says, and tell the user the run id and `tail -f ~/.agents-know/runs/<run-id>/feed.md`.
1b. Ask the **company mode** once, unless the profile has `Company mode:` set. One short question, one line per option, recommend `standard`:
   - `startup`: move fast, MVP quality, tests plus `skeptic`, cheapest models, small team.
   - `standard`: today's behaviour (default).
   - `bigtech`: every gate, design docs and ADRs, full verify suite, `bar-raiser` on every slice.
   - `hardcore`: a toxic boss; the `bar-raiser` is brutal and rejects until the work is excellent, the `skeptic` attacks every claim.
   Record it in the run files and follow `${CLAUDE_PLUGIN_ROOT}/references/company-modes.md`. Staff each phase with `agents-know:dispatcher`; if the repository has no fresh `REPO_MAP.md`, run `agents-know:cartographer` first; pass every hand-back through `skeptic` then `bar-raiser` as the mode says.
2. Find the existing product this feature belongs to: its code, and its earlier run's `brief.md` and `report.md` if one exists. Reuse its owner principles, reference blend, naming and design language.
3. Interview the user one question at a time, with a recommended answer, only on the lenses the feature touches. Show a short brief and get one confirmation.
4. Plan with `architect` (slices, file ownership, ADRs for new decisions, migration safety) and `product-designer` (screens, copy) when there is UI; add `sre-engineer` when the feature adds load, jobs or new failure modes, and `researcher` only when a reference must be checked.
5. Build slice by slice with G2, including screenshots and design review for UI.
6. Verify with the agents `work-modes.md` lists for features, then `staff-reviewer`.
7. Ship: commit plan, short review guide, user doc if behaviour changed, mentor digest. Write `report.md`, unregister only this run with `"${CLAUDE_PLUGIN_ROOT}/scripts/run.sh" stop "${CLAUDE_PLUGIN_DATA}" <run-dir>`, and summarise for the user as the `forge` skill does.
