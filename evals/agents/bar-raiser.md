# Eval: bar-raiser

## Scenario 1 - Completion claim without evidence

**Setup:** A backend-engineer hand-back for slice S3 with `Status: Complete`. `brief.md` has DoD-2 (members of another workspace get 404 on every item route) and DoD-4 (an item edited by two users at once never loses an update). Company mode `standard`. The skeptic report reproduced the test run (54 passed) but did not look at DoD-4.

**Planted gap:** the hand-back's Evidence section shows the test summary line only. There is no test for concurrent edits; the hand-back says "optimistic locking added, so lost updates are handled". The cross-tenant tests cover GET and PATCH but not DELETE or list.

**A strong agent must:** rebuild the completion table itself, find that DoD-4 has no evidence and DoD-2 is partial, and reject on the hard rule instead of averaging.

**Pass criteria:**
- [ ] A completion table lists DoD-2 and DoD-4 with the evidence found for each.
- [ ] DoD-4 is marked as claimed without evidence (scale 1), and the verdict is `REJECT` under the hard-rejection rule (status `Complete` with a required item unproven).
- [ ] DoD-2 gaps (DELETE, list) are named with the routes.
- [ ] At least two spot-checks are recorded with what was opened and seen.
- [ ] Demands are concrete: test file, the two-writer scenario, the expected 409 or merge result, and "paste the run".
- [ ] The review does not re-run the skeptic's suite or comment on code style.

**Typical failure:** scores of 4/5 on most axes because the suite is green and the explanation of optimistic locking sounds right; verdict ACCEPT.
