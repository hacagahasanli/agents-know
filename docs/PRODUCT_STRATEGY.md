# agents-know: Product strategy

Status: draft for owner approval. Date: 2026-11-16. Basis: `docs/MARKET_RESEARCH.md` (Phase 1).
Labels: **Verified** = read from a primary source or from this repo on the date above. **Assumption** = reasoned, not confirmed. **Recommendation** = our proposal.

## 1. Vision

Anyone running a coding agent should be able to hand it a product, a feature or a bug and get back work that is *proven* done: specialist agents did the work, mandatory quality gates passed with evidence, and nothing destructive happened on the way. The same company, the same gates and the same safety rules should run on whichever coding agent the user already has.

## 2. Positioning statement

> For developers and small teams who already use a coding agent (Claude Code, Codex, Cursor, OpenCode, Copilot) and want delivery they can trust, **agents-know** is an open-source, end-to-end software product company made of specialist agents. Unlike prompt collections and skill catalogues, it enforces written quality gates (G0 to G3) with evidence before anything is called done, ships safe-by-default hooks, and tells you honestly which of those guarantees hold on which agent.

One-liner (Recommendation): **"A product company in a plugin. It ships software, stops at quality gates, and shows evidence."**

Claims we avoid (Recommendation): "company operating system", "replaces your team", "enterprise knowledge", "secure" without a scope, "works everywhere" without the capability matrix. Each is either owned by an incumbent or not provable by one maintainer.

## 3. Target users

| Segment | Priority | Why | Status |
| --- | --- | --- | --- |
| Solo developers and small agencies using a coding agent daily, who ship client or product work | Primary | Feel the pain of unreviewed agent output; can adopt a heavy process on their own | Assumption (demand for a gated process is not measured) |
| Small product teams and tech leads who want one definition of done for agent work in a repo | Secondary | Gates and evidence are the reviewable artefact | Assumption |
| Security-minded users who run agents against real repos and databases | Secondary, wedge | Hard stops are the reason to install | Verified need class (research section 3.7: unvetted plugins, destructive scripts in the wild) |
| Learners who want to see how a staff team works | Tertiary | The mentor agent and recaps already exist | Verified feature, Assumption demand |
| HR, finance, sales, legal users; enterprises needing permission-aware search | Not now | Anthropic ships role plugins for them; Glean and Rovo own permission-aware search | Verified (research section 8) |

## 4. The three differentiators

Chosen from `MARKET_RESEARCH.md` sections 5 and 7. Everything else (small surface, Windows CI, token visibility) is a design principle that supports these, not a headline.

### D1. Done means proven: mandatory gates with evidence

| | |
| --- | --- |
| Problem | Agents declare success without proof. Skills fire unreliably and "done" is unverified (agent-skills issues #776, #620, #602; proof-of-done proposal #528; BMAD headless runs overshoot scope #3194; all Verified in research). |
| Why competitors fall short | Superpowers provides process skills; BMAD an agile loop; wshobson a 202-agent catalogue whose own LLM evals are "experimental and unvalidated against human labels". None of the sampled projects documents mandatory security, accessibility, performance, IP, migration and SRE gates with exit criteria (Verified for the sample, Assumption that the sample is complete). |
| Who benefits | Primary and secondary users above. |
| How it works | The PM main session runs Define, Plan, Build, Verify, Review, Ship. Gates G0 baseline, G1 plan, G2 every slice, G3 release candidate live in `references/quality-gates.md`. A gate passes only with the evidence listed beside it. Every hand-back uses `references/templates/hand-back.md` (status, evidence, not-verified list); the PM rejects an empty evidence table. A severity scale blocks release on critical or high findings. |
| What is new in Stage 1 | (a) Gates become machine-readable (`gates.yaml`) so a validator can reject a ledger or hand-back with missing evidence. (b) Planted-defect evals prove the verifiers catch known bugs, scored by exact finding IDs, not by an LLM judge. (c) Published as a portable spec independent of any harness. |
| Complexity | Medium. Content exists; the validator and evals are new code, about 3 to 4 days. |
| Scope | **MVP**: gates.yaml, evidence validator, three planted-defect fixtures with a manual run recipe. **Later (V1)**: automated nightly eval run, more fixtures, score badge. |

### D2. Safe by default

| | |
| --- | --- |
| Problem | Agent plugins run with the user's permissions and no central vetting (Red Hat 2026-08-18, Snyk skill audit, Anthropic's own README disclaimer; secondary sources, Verified as statements, counts disagree). Real incidents of destructive scripts exist in the sampled projects (BMAD #3142). |
| Why competitors fall short | Most frameworks are instruction-only; some ship default-on telemetry (CrewAI; optional ping in Superpowers; Verified). Safety is a prompt, not a mechanism. |
| Who benefits | Anyone pointing an agent at a repo with a real database, secret files or a force-push habit. |
| How it works | (1) `hooks/guard.sh` blocks destructive SQL, non-local database clients, infrastructure deletion, force push, recursive deletes outside build artefacts, secret-file reads and drop or rename migrations (Verified: the file and `tests/guard.test.sh`). (2) While a run is active it also blocks commit, push, migrations and new dependencies; the PM must ask the human. (3) Verifier agents are read-only (`disallowedTools: Edit, NotebookEdit` plus the hook). (4) `references/privacy-by-default.md` classifies every field and requires encryption at rest and log hygiene. (5) The plugin itself: no telemetry, no install-time network, no bundled third-party code. |
| Honest limit | The guard is a regex guardrail over tool payloads, not a sandbox. It can be bypassed by indirection (a script that runs SQL, encoded commands) and it has false positives. Codex docs say the same about hooks in general (Verified). `docs/SECURITY.md` states this and lists compensating controls. |
| Complexity | Low to medium. Mechanism exists. New: extend the test corpus, Windows behaviour, cross-harness payload adapters (V1). |
| Scope | **MVP**: expand guard tests, document the threat model, CI on three operating systems, root `SECURITY.md`. **Later**: Node port of the guard with the same corpus, per-harness hook adapters. |

### D3. Honest portability with a capability matrix

| | |
| --- | --- |
| Problem | Multi-platform support is now table stakes (Superpowers lists 16 harnesses; wshobson generates 7 targets), but nobody states which guarantees survive on which harness. Users of one harness silently lose hooks or read-only agents. SuperClaude users ask for Codex, OpenCode and Gemini support (#498, #524, #145; Verified). |
| Why competitors fall short | "Supported" means "files were copied". Capability differs per harness and docs say so only in passing. |
| Who benefits | Users of non-Claude harnesses; teams standardising on more than one. |
| How it works | One source (the Claude plugin format already in this repo) compiled by a deterministic generator to each harness's native files, plus a generated, versioned capability matrix that marks each guarantee as *enforced* (hook or native permission), *instructed* (prompt only) or *absent*. Detail in `docs/ARCHITECTURE.md`. |
| Complexity | Medium. Generator core plus four emitters, about 4 to 5 days including tests. Maintenance risk: harness formats change quickly (Cursor docs disagree on `.md` vs `.mdc`; OpenCode docs flag V1 fields as deprecated; Verified 2026-11-16). |
| Scope | **MVP**: Claude (passthrough), Codex and Cursor as supported targets; OpenCode and Copilot as beta. **Later**: hook enforcement on non-Claude harnesses, Gemini CLI and others via community adapters. |

## 5. What we deliberately do NOT do

| Not doing | Reason |
| --- | --- |
| A "company OS" (HR, recruiting, people onboarding, RAG over company data) in Stage 1 | Anthropic and enterprise vendors own it; personal-data exposure; unbounded content upkeep for one maintainer (research section 10). Gated in the roadmap. |
| Our own agent runtime, framework or hosted service | Competes with the harnesses we depend on; creates a service that can close (an optional hosted memory service in a sampled project shut down on 2026-10-01; Verified). |
| Telemetry, analytics pings, install-time network calls | The safe-by-default claim must hold for the plugin itself. |
| A large catalogue of agents or commands | Surface stays small; progressive disclosure; complaints about too many commands (SuperClaude #501). |
| Claiming a security boundary we do not have | The guard is a guardrail; the plugin is not a sandbox. |
| Claiming an integration we have not tested | See `docs/INTEGRATIONS.md` status labels. |
| Rebuilding vendor MCP servers | Consume vendor-hosted servers later; do not maintain connectors. |
| Auto-commit, auto-push, auto-deploy, running migrations on shared databases | Hard stops; the human decides. |
| Copying reference products' identity or code | `ip-guard` gate. Rebuilding behaviour is not copying expression; this is not legal advice. |

## 6. Name and positioning

**Current name: `agents-know`.** The owner already created the repository under this name, and it is the plugin namespace in every command (`/agents-know:forge`), in `plugin.json` and in the runtime directory `~/.agents-know`. A rename touches all of them.

Search done on 2026-11-16 with the GitHub repository search API (`q=<name> in:name`, sorted by stars; counts are fuzzy token matches, so read them as a rough conflict signal). Not checked: npm, PyPI, trademark registers, domains. Rate limits stopped the last two candidates.

| Candidate | GitHub name matches | Top hit (stars) | Short | Searchable | Fits the claim (gates, proof, company) | Verdict |
| --- | --- | --- | --- | --- | --- | --- |
| **agents-know** (current) | 189 | unrelated knowledge-agent repos (43) | yes | yes, unique token pair | weak: "know" reads as knowledge base or RAG, the roadmap we are *not* doing now | Keep (see below) |
| shipgate | 65 | an agent-gating repo (87) | yes | contested in the same domain | strong | Avoid: same niche |
| doneproof | 11 | two 1-star repos | yes | good | strongest: states D1 | Best alternative; npm and PyPI unchecked |
| shipwright | 338 | a game port (6,075) and a Kubernetes build tool (830) | yes | poor | medium | Avoid |
| gatehouse | 226 | an authorization library (354) | yes | poor | medium | Avoid |
| proofloop | 99 | two repos (about 38 each) | yes | medium | strong | Possible; same-domain neighbours |
| agentsmith | 234 | a security product (601) | yes | poor | weak | Avoid |
| shipcrew | 29 | 4 stars | yes | good | medium (crew, ship) | Possible; generic |
| gatewright | 13 | 3 stars | yes | good | medium | Possible; unclear meaning |
| verdict-agents | 3 | 0 stars | no | good | medium | Weak |
| proofship, crewgate | not checked (rate limit) | n/a | yes | unknown | strong | Unverified |

**Recommendation: keep `agents-know`.** No exact-name collision was found; the token pair is unique and searchable; the rename cost (namespace in every command, existing users, directory names) exceeds the gain; and the weak meaning is fixable with the tagline and GitHub topics rather than the name. Make the repository description carry the keywords: *"Product company of specialist coding agents with mandatory quality gates, safe-by-default hooks and portable adapters for Claude Code, Codex, Cursor, OpenCode and Copilot."* Topics: `ai-agents`, `claude-code`, `codex`, `cursor`, `agent-skills`, `subagents`, `quality-gates`, `ai-safety`. If the owner ever rebrands, **doneproof** is the strongest fit for the differentiator, but only after checking npm, PyPI and the domain. Naming constraint from the Claude plugin validator (Verified, plugin reference): names starting with `claude-` or `anthropic-` are reserved; `agents-know` passes.

## 7. Staged plan (decision already made: path C)

| Stage | Scope | Gate to enter |
| --- | --- | --- |
| 1 (now) | Sharpen D1, D2, D3. Detail in `docs/ROADMAP.md` MVP and V1 | n/a |
| 2 | Thin, separately installable ops packs on the same PM loop: technical writing, repo-centric onboarding, engineering knowledge (docs, ADRs, runbooks). Repo data only, no personal data | Stage 1 has external users, triaged issues, one merged outside contribution (Recommendation; numbers are the owner's call) |
| 3 | Vendor-hosted MCP servers consumed, never rebuilt, with permission inheritance documented per server | Stage 2 packs in use; written data-classification policy |
| 4 | HR, recruiting, company intelligence | Privacy design, legal review, more than one maintainer. Otherwise never. |

## 8. Success measures (Recommendation)

Adoption: installs per target (release downloads), stars, issues that ask for a gate or a target. Quality: planted-defect recall by agent (target 100 percent on the fixture set, measured, not claimed) and guard corpus pass on three operating systems. Honesty: the capability matrix is regenerated on every release, with zero README claims that the matrix contradicts. Review these numbers after the first public release; thresholds are the owner's call.

## 9. Risks

| Risk | Type | Mitigation |
| --- | --- | --- |
| A heavy gated process is not wanted | Assumption | Light mode (`task`) already exists; track which skills users run; measure before expanding |
| Harness formats move | Verified (conflicting docs found) | Generator pins to a dated format snapshot per target; the matrix says "verified on <date>"; adapters isolated |
| Anthropic or Superpowers add gates | Assumption | Differentiate on evidence, safety and the portable spec |
| Maintainer capacity | Assumption | Small surface; automation; decline scope that needs domain upkeep |
| Soft dependency on addyosmani/agent-skills | Verified (agents cite `agent-skills:*` skills) | Document degraded behaviour without it; vendor the few needed skills with licence compliance if upstream breaks |
| The plugin is a supply-chain target | Verified class | Pinned release artefacts, minimal hook code, reviewed diffs, no network at install |
