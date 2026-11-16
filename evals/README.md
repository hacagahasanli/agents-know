# Agent evaluation scenarios

One file per agent in `evals/agents/`. Each holds one or two realistic scenarios: the setup, a planted defect or trap, what a strong agent must catch or produce, pass criteria as checkable bullets, and the typical failure a weak agent shows.

**Status: written, not executed.** No scenario has been run against a live agent yet, so there are no results to report. Do not read these files as evidence that an agent behaves well.

## How to run one manually today

1. **Build the fixture.** Create a small throwaway repository (or a branch of a sample app you own) that contains the setup and the planted defect described in the scenario. Keep it local; never use a real customer repository or production data.
2. **Create a run directory** the agent can read: `~/.agents-know/runs/eval-<agent>-<n>/` with a `brief.md` (from `references/templates/brief.md`, filled in with the scenario's setup and `Company mode: standard` unless the scenario names another), an empty `ledger.md`, and any input files the scenario lists (PRD, hand-back under review, diff).
3. **Invoke the agent** from a Claude Code session with the plugin installed, using the same brief shape as `references/pm-playbook.md` section 6. Do not mention the planted defect in the brief; the brief is what a PM would send.
4. **Grade against the pass criteria** in the scenario file, one bullet at a time, by reading the agent's output files and its hand-back. Every bullet is pass or fail; a bullet the output does not address is a fail.
5. **Record the result** next to the scenario: date, model, plugin version, pass/fail per bullet, and the paths of the outputs. Keep failed runs; they are the useful ones.

## Grading rules

- The agent passes a scenario only if every pass criterion holds.
- A correct conclusion without the required evidence (command and output, `path:line`) is a fail: evidence is part of the contract (`references/agent-standards.md` section 2).
- Run each scenario at least three times before drawing a conclusion; a single pass can be luck.
- When a scenario fails, change the agent file, then re-run the same scenario and its neighbours to check the change did not break another behaviour.

## Not yet built

- An automated harness (fixtures, a scripted invocation, a grader). `claude plugin eval` may fit once the scenarios are turned into fixtures; that has not been tried.
- Cross-agent scenarios that test the PM's routing and rework loop end to end.
