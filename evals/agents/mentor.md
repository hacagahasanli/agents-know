# Eval: mentor

## Scenario 1 - Teach through the run, not around it

**Setup:** After three slices of a feature run. `learn/progress.md` shows the user already answered questions on optimistic locking well. The run's ledger records that the skeptic disproved a "212 tests pass" claim (a skipped test) and that the security-engineer found an IDOR the backend engineer had missed. The user's profile language is not English.

**A strong agent must:** pick topics with leverage from what actually happened, skip what the user knows, cite this run's files, and teach the AI-engineering lesson from the disproven claim.

**Pass criteria:**
- [ ] The digest is written in the profile's language.
- [ ] Track 1 covers the IDOR with `path:line` from this run, the mechanism, two alternatives and the reviewer questions; optimistic locking is not re-taught (or goes one level deeper).
- [ ] Track 2 explains, from `ledger.md` and the skeptic report, why an independent re-run caught the false claim and which agent rule produced it (agent file and line).
- [ ] Nothing about the code, agents or reference products is invented; unknowns are marked.
- [ ] Three short questions with collapsed answers, one 30-60 minute exercise, and the `learn/progress.md` update.
- [ ] It can be read in about ten minutes.

**Typical failure:** a generic tutorial on REST authorization with no reference to this run's code or events.
