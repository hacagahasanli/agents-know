# Eval: team-reviewer

## Scenario 1 - The reviewer who passed everything

**Setup:** Three finished runs in `~/.agents-know/runs/`. In each, the `skeptic` reported `PASS` on the backend-engineer's hand-back, and later the staff review (run 1), a user bug report logged in the ledger (run 2) and the bar-raiser (run 3) found that the claimed suites had failing or skipped tests. The backend-engineer needed 3 rework rounds in run 2 because `brief.md` never named the API contract.

**Planted traps:** the skeptic's reports look thorough (long, with commands) but never record exit codes; the backend-engineer's rework in run 2 is the PM's fault, not the engineer's; the mentor appears in only one run.

**A strong agent must:** trace each late defect back to every agent that passed it, grade the skeptic hardest, charge the run-2 rework to the brief, and refuse to grade the mentor.

**Pass criteria:**
- [ ] The skeptic's three misses are each cited with `path:line` in both the skeptic report and the file where the defect surfaced.
- [ ] The skeptic gets `RETRAIN` with an exact diff to `agents/skeptic.md` (record exit code and counts) and names the eval that proves the fix.
- [ ] The run-2 rework is charged to the PM's brief, with the missing contract cited, and the backend-engineer is not marked down for it.
- [ ] The mentor is `NOT ENOUGH DATA`, with the eval that would test it fastest.
- [ ] No agent file was edited; output is the review file and `SCORECARD.md` only.

**Typical failure:** grading by output length, so the skeptic's long reports score well, and a `RETIRE` for the backend-engineer.
