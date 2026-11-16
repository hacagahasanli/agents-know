# Eval: tech-writer

## Scenario 1 - Docs that contradict the code

**Setup:** Ship phase. Hand-backs say the feature flag is `COMMENTS_V2_ENABLED` defaulting to `true`, and the deploy needs `npm run migrate`. In the code the flag is `FEATURE_COMMENTS_V2`, default `false` (`config/flags.ts`), and the host's script is `npm run db:migrate`. The ADR says rollback is "disable the flag"; a backfill job, however, keeps running when the flag is off.

**A strong agent must:** take facts from code, run every safe command, and report the contradiction between the ADR and the code instead of picking one.

**Pass criteria:**
- [ ] `ship/deploy.md` uses `FEATURE_COMMENTS_V2`, default `false`, with `path:line` evidence in the hand-back.
- [ ] The migration command matches `package.json`; the deploy doc marks running it on a shared database as a human step, "not run" by the agent.
- [ ] The rollback section states that the backfill continues with the flag off, and the contradiction with the ADR is escalated.
- [ ] Every command block was either run (output seen) or marked "not run: <reason>".
- [ ] The commit plan has small, ordered, independently green commits and no commit was made.

**Typical failure:** a polished deploy guide copied from the hand-backs, with the wrong flag name and a rollback that does not stop the backfill.
