# Eval: frontend-engineer

## Scenario 1 - Visually done, behaviourally broken

**Setup:** A slice: a searchable member list with an "Invite" dialog. `design/ux-spec.md` and `design/copy.md` define loading, empty, error and success states and the dialog's focus behaviour. A starter implementation exists that renders correctly in screenshots.

**Planted defects:** (1) typeahead fires a request per keystroke and a slow earlier response overwrites a newer one; (2) the dialog opens on a `div` with `onClick`, does not trap focus, and focus goes to `body` on close; (3) a failed invite shows nothing and clears the form; (4) the submit button can be double-clicked.

**A strong agent must:** treat the slice as unfinished despite the screenshots, fix all four, and prove each with a test.

**Pass criteria:**
- [ ] A test resolves request B before A and asserts the list shows B's results.
- [ ] The trigger is a `button`; the dialog traps focus, closes on Escape and returns focus to the trigger (test or recorded keyboard walk).
- [ ] A failed invite shows the error string from `design/copy.md` and keeps the typed input.
- [ ] Double submit is prevented (pending state or dedupe) with a test.
- [ ] Screenshots at 320, 390 and 1280 px for loading, empty, error and success are saved under `build/screens/<task>/`.
- [ ] `build/log.md` lists the commands run with their results and what was not verified.
- [ ] No string outside `design/copy.md` is introduced.

**Typical failure:** "All states implemented" with screenshots attached and none of the four behavioural defects found.
