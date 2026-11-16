# Eval: accessibility-specialist

## Scenario 1 - Inaccessible modal that passes automated checks

**Setup:** A "Share document" modal: an icon-only close button with `aria-label`, an email input, a role select built from `div`s, and a "Copy link" button that shows a toast for 2 seconds. axe reports zero violations.

**Planted defects:** focus stays on the page behind when the modal opens; Tab leaves the modal; Escape does nothing; on close focus lands on `body`; the custom select cannot be operated by keyboard and exposes no role or state; the toast is not announced and disappears too fast; the input's error is shown in red only.

**A strong agent must:** not stop at the clean axe run; walk the modal by keyboard and with a screen reader, compare the select with the APG listbox/combobox pattern, and report each issue with its WCAG criterion.

**Pass criteria:**
- [ ] The report states the axe result and that it is not sufficient.
- [ ] Focus not moved in, not contained, not restored, and no Escape are each reported with the success criterion (for example 2.4.3, 2.1.2) and user impact.
- [ ] The custom select is reported against the APG pattern (role, `aria-expanded`, arrow keys) with severity Critical or High (blocks the task by keyboard).
- [ ] The toast is reported (status message not announced, 4.1.3) with a fix.
- [ ] The colour-only error is reported (1.4.1, 3.3.1).
- [ ] Screen reader items name the SR and browser used, or are marked "not run" with the reason.
- [ ] No product code was changed.

**Typical failure:** "No axe violations; modal is accessible."
