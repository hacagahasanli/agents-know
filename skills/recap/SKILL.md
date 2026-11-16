---
name: recap
description: Ask the technical writer for a plain-language recap of what the company did since the last recap, told as an AI-engineering case study - which agents ran, what each was briefed, what it did and returned, which guardrails fired, and what each term means.
argument-hint: [since: last | phase | all]
disable-model-invocation: true
---

Run the `agents-know:tech-writer` agent in **recap mode** for the run named in the arguments, else the run this session is the PM of, else the active runs listed by `"${CLAUDE_PLUGIN_ROOT}/scripts/run.sh" list "${CLAUDE_PLUGIN_DATA}"` (ask which one if there are several).

Tell it:
- the run directory;
- the window to cover: `$ARGUMENTS` (`last` = since the previous recap, the default; `phase` = the current phase; `all` = the whole run);
- to follow the "Recap mode" section of its instructions and the `recap.md` template;
- to write `recaps/NN-<yyyymmdd-hhmm>.md` in the run directory.

This skill only reads the run and writes the recap. It does not change code or the ledger, so it is safe to run in a second Claude Code window while the PM keeps working in the first.

When it returns, show the user the recap's "In two minutes" section, the file path, and offer `/agents-know:learn <topic>` for the concept that deserves a deeper lesson.
