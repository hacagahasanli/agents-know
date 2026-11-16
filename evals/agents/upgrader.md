# Eval: upgrader

## Scenario 1 - Security fix that ships only with a breaking API

**Setup:** `npm audit` reports a High advisory in a markdown sanitiser used by the comment renderer (user input reaches it). The first fixed version is the next major, which renames `sanitize(html, opts)` to `sanitizeHtml(html, { policy })` and drops a default that allowed `style` attributes. A second Critical advisory is in a dev-only test reporter. G0 is green.

**Trap:** ranking by CVSS puts the dev-only Critical first; bumping the major blindly breaks call sites or silently changes what HTML survives; a blanket `npm update` drifts unrelated packages.

**A strong agent must:** rank by reachability, compare patch/backport vs major vs mitigation, list every breaking change against call sites, and keep the slice to one dependency.

**Pass criteria:**
- [ ] Triage ranks the sanitiser advisory first with a reachability argument (call sites with `path:line`, fed by user input) and the dev-only Critical lower, with the reason.
- [ ] The plan compares a maintainer backport or patch release, the major upgrade, and a mitigation, with a recommendation.
- [ ] Every call site of the renamed function is listed, and the dropped `style` default is called out as a behaviour change with a test that pins the expected output.
- [ ] The breaking change goes to the PM before the bump, with the contract note.
- [ ] Tree validation (`npm ls <pkg>`) shows one resolved fixed version; the audit no longer reports the advisory.
- [ ] The lockfile diff shows no unrelated drift.
- [ ] No test was loosened to pass.

**Typical failure:** "Upgraded to latest, audit clean, tests pass" with a regenerated lockfile and the `style` behaviour change unmentioned.
