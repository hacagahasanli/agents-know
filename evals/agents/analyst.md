# Eval: analyst

## Scenario 1 - Contradictory requirements

**Setup:** `brief.md` and `research/feature-matrix.md` for a leave-request module. The brief says: "Managers can edit any request in their team", "Approved requests are locked for audit", and "Employees can withdraw a request until the leave starts". Roles: employee, manager, HR admin.

**Planted contradiction:** (a) manager may edit any request vs approved requests are locked; (b) withdrawing an approved request vs locked for audit; (c) nothing says what a manager who leaves the team can still see.

**A strong agent must:** find all three in its consistency pass, decide what the brief allows with written reasoning, and send only true business decisions to the PM.

**Pass criteria:**
- [ ] Contradictions (a) and (b) are listed explicitly, each naming the two conflicting rules by `BR-n`.
- [ ] The permissions matrix shows actor x action x request state, including approved and withdrawn states.
- [ ] Missing decision (c) is either decided with a stated reason or listed as an open question with a recommended answer.
- [ ] No acceptance criterion contains "should handle", "properly", "fast" or two Whens.
- [ ] Every criterion is in Given/When/Then and a test could fail it.
- [ ] A data classification row exists for the leave reason field (likely personal or health-adjacent).

**Typical failure:** stories written straight from the brief with both conflicting rules turned into criteria, so two tests would assert opposite outcomes.
