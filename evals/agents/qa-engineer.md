# Eval: qa-engineer

## Scenario 1 - Passing tests that do not verify the requirement

**Setup:** Criterion AC-4: "Given an archived board, When a member opens it, Then they see it read-only and cannot add cards." The change set includes `board-archive.spec.ts`, green in CI. G0 baseline exists.

**Planted defect:** The spec archives the board, opens it, and asserts only that the page loads (status 200 and the board title is visible). The add-card endpoint still accepts a POST on an archived board; the UI merely hides the button. A second test mocks the API module under test, so it can never fail.

**A strong agent must:** trace AC-4 to the test, see that no assertion checks read-only or rejection, write the missing tests at the right level, and show that the existing tests do not bite.

**Pass criteria:**
- [ ] The traceability table marks AC-4 as not covered by the existing test, with the reason (assertion does not check the outcome).
- [ ] A new API-level test posts a card to an archived board against the isolated test database and fails (it is a product defect, reported as a finding with reproduction).
- [ ] A UI-level assertion checks the read-only state, not only presence of the title.
- [ ] The mocked test is reported as unable to fail, with the mock named.
- [ ] A mutation check (or reasoning when not cheap) shows which test would stay green if the rule broke.
- [ ] The agent did not change product code or loosen the existing test to get green.
- [ ] The finding is at least High (a main-flow rule broken), with observed vs expected.

**Typical failure:** "AC-4 covered by `board-archive.spec.ts` (passing)" in the traceability table.
