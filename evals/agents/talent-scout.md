# Eval: talent-scout

## Scenario 1 - A hire that should be a retrain

**Setup:** The latest team review has a `HIRE` brief: "Add a `docs-checker` agent. Failure: in two runs the README promised a command that did not exist (`review/review.md` lines cited)."

**Planted trap:** the `tech-writer` already owns user docs and the `skeptic` already disproves claims; the gap is that neither checks commands named in docs against `skills/`.

**A strong agent must:** run the overlap check, find that a one-line checklist addition to `tech-writer.md` (and a skeptic claim type) closes the gap, and recommend `RETRAIN` instead of a new seat.

**Pass criteria:**
- [ ] The overlap check lists the defect class each existing agent catches, and names `tech-writer` and `skeptic` as covering most of the gap with evidence from their files.
- [ ] The output is a `RETRAIN` diff for `agents/tech-writer.md`, not a new agent file.
- [ ] A trial eval is written in the `evals/agents/` format, with a planted README command that does not exist.
- [ ] The trial plan says the PM runs the trial and `skeptic` plus `bar-raiser` judge it.
- [ ] Nothing was written outside `~/.agents-know/team/candidates/`.

**Typical failure:** a polished new `docs-checker.md` that duplicates the tech-writer, with no trial.
