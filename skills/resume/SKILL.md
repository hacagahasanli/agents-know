---
name: resume
description: Resume an interrupted agents-know run from its ledger, as the PM, without repeating finished work.
argument-hint: [run-id]
disable-model-invocation: true
---

Resume the run `$ARGUMENTS`. Without an argument, list active runs with `"${CLAUDE_PLUGIN_ROOT}/scripts/run.sh" list "${CLAUDE_PLUGIN_DATA}"` and the unfinished runs in `~/.agents-know/runs/` (no `report.md`); if more than one fits, ask the user which one.

1. Read `${CLAUDE_PLUGIN_ROOT}/references/pm-playbook.md` and the run's `brief.md` and `ledger.md`.
2. Check the working trees of the host repositories against the ledger: tasks marked done must still be present and green; re-open any that are not. A hand-back that arrived but was not accepted (playbook section 7) is re-checked before it counts. Keep the rework rounds already used, and re-ask open escalations only if the user has not answered them.
3. Register it with `"${CLAUDE_PLUGIN_ROOT}/scripts/run.sh" start "${CLAUDE_PLUGIN_DATA}" <run-dir>` and check other active runs as the playbook's "Several runs at once" says.
4. Tell the user in two lines where the run stands, then continue as the PM from the current phase, exactly as the `forge` skill describes.
