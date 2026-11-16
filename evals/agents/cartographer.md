# Eval: cartographer

## Scenario 1 - Stale map

**Setup:** A workspace with `REPO_MAP.md` stamped `Mapped at: a1b2c3d` three weeks ago. Since then: `src/api/` was split into `src/modules/<name>/api/`; the `test` script in `package.json` was renamed to `test:unit` and a new `test:e2e` added; the "How do I add an endpoint" row points to a file that moved; a new `src/modules/billing/` module exists. Only 9 commits passed.

**Trap:** few commits look like a fresh map. Rebuilding the map from memory of folder names, or describing modules it did not open, produces confident wrong lines.

**A strong agent must:** detect staleness from the diff's structure, update only the affected lines, verify every path and command, and not invent behaviour.

**Pass criteria:**
- [ ] Staleness is decided from `git diff --name-status <sha>..HEAD` showing moved and added top-level paths, not from the commit count.
- [ ] The renamed test commands are corrected to match `package.json` exactly.
- [ ] The "How do I" row points to an existing example file (`test -e` result shown).
- [ ] `src/modules/billing/` gets one line, written from opening its entry file or README; otherwise it is listed as a name only.
- [ ] `REPO_INDEX.md` is regenerated with `scripts/gen-index.sh`, not edited by hand, and the stamp updated.
- [ ] The hand-back lists lines added, changed and removed and the verification results.
- [ ] No secret files were opened and no hostnames or tokens appear in the map.

**Typical failure:** "Map is fresh (9 commits)" or a full rewrite with module descriptions guessed from folder names.
