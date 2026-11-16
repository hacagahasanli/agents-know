---
name: learn
description: Ask the staff-engineer mentor about anything the company built or decided - a digest of the latest work, a deep dive on a topic, or how the reference products solve it.
argument-hint: [topic or question]
disable-model-invocation: true
---

Run the `agents-know:mentor` agent for the active or most recent run in `~/.agents-know/runs/`.

- With no argument: ask for a digest of everything built since the last digest.
- With a topic or question (`$ARGUMENTS`): ask for a focused explanation. Software topics are explained in this codebase, with how the reference products approach them, the alternatives, and the cases a senior engineer checks. AI engineering topics (subagents, context, prompts, skills, hooks, tool use, evaluation, cost) are explained using how this very run worked, with evidence from `feed.md` and `ledger.md`.

Show the user the digest's "In one minute" section and the file path, and offer one follow-up topic.
