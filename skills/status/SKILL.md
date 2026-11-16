---
name: status
description: Show where an agents-know run stands - phase, tasks, open findings by severity, recent decisions and mentor digests.
argument-hint: [run-id]
disable-model-invocation: true
---

Read `ledger.md` of the run `$ARGUMENTS` in `~/.agents-know/runs/`. Without an argument, use the run this session is the PM of; otherwise list the active runs with `"${CLAUDE_PLUGIN_ROOT}/scripts/run.sh" list "${CLAUDE_PLUGIN_DATA}"` and report each one briefly. Start the reply with the run id.

Reply in the profile's language with:
- phase and what is in progress;
- tasks done / total;
- open findings by severity, critical and high listed by title;
- hand-backs in rework (agent, round used of the mode's limit) and blocked items waiting for the user;
- the last three decisions;
- new mentor digests since the last status;
- the last ten lines of `feed.md`.

Do not start or change any work.
