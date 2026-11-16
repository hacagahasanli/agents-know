---
name: setup
description: Create or update an agents-know profile (stack, repositories, language, hard stops, programme of products) by interviewing the user. Run once per workspace before the first forge run.
argument-hint: [profile-name]
disable-model-invocation: true
---

Create or update `~/.agents-know/profiles/<name>.md`, where `<name>` is `$ARGUMENTS` or `default`, from `${CLAUDE_PLUGIN_ROOT}/profiles/example.md`.

1. Inspect the current directory first: find the host repositories, their `CLAUDE.md` and `.claude/rules`, stack, test and lint commands. Pre-fill everything you can.
2. Interview the user one question at a time, each with your recommended answer, only for what you could not infer:
   - preferred language for reports and mentor digests;
   - hard stops (dependencies, migrations, protected modules, commits and pushes, anything else);
   - the programme: which products in which order, and which are already done;
   - the owner principles: standing rules for every product (mobile, platform fit, naming, migration, reliability, anything else);
   - the design charter to follow (a file path or a description);
   - the default company mode (`startup`, `standard`, `bigtech` or `hardcore`, see `${CLAUDE_PLUGIN_ROOT}/references/company-modes.md`; one line each; recommend `standard`). Save it as `Company mode: <mode>` in the profile so `forge`, `feature`, `fix` and `task` skip the question.
3. Write the profile and show it to the user in full.
4. Create the agent map in the workspace root, so agents stop exploring the repositories on every task:
   - `REPO_MAP.md` (about 100-150 lines): layout, where each module and shared helper lives, patterns to copy with a "How do I..." recipe table naming real example files, exact test and lint commands, local test databases, git and migration rules, protected files. Verify every path it names exists.
   - `REPO_INDEX.md`: run `${CLAUDE_PLUGIN_ROOT}/scripts/gen-index.sh <workspace-root>` (one line per file with its classes, functions and exports).
   - `cartographer` keeps the map fresh later (it runs first on a repo without a fresh map, and updates it after slices).
   - Record both paths in the profile under "Agent map", and tell the user to rerun the script after big changes.

Never store secrets, tokens or passwords in a profile.
