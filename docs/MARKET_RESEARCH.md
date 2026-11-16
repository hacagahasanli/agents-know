# agents-know: Market Research (Phase 1)

Date read: 2026-11-16. Scope: market research only, no implementation.

Claim labels: **Verified (source)** = read from the source on the date above. **Assumption** = reasoned but not confirmed. **Recommendation** = our proposal.
Star, fork and activity numbers were read from the GitHub REST API (unauthenticated) on 2026-11-16 unless marked otherwise. The API rate limit stopped some lookups; those are marked "unverified".

---

## 1. Executive summary

- **Verified (GitHub API 2026-11-16):** The "agent skills / plugins for coding tools" space is crowded and very large. `anthropics/skills` has 195.9k stars, `obra/superpowers` 318.6k, `addyosmani/agent-skills` 118.3k, `wshobson/agents` 42.6k, `bmad-code-org/BMAD-METHOD` 55.4k. Several are maintained by large organisations or well-known individuals with huge audiences.
- **Verified (README fetches):** Distribution is converging on one format. `SKILL.md` skills are read by Codex, Claude Code and many others; `obra/superpowers` lists 16 harnesses; `wshobson/agents` generates adapters for 7 tools from one Markdown source. Multi-platform is now table stakes, not a differentiator.
- **Verified (README):** Company-function plugins already exist from Anthropic (`anthropics/knowledge-work-plugins`, 36.3k stars: sales, support, PM, marketing, legal, finance, data, enterprise-search, productivity). Anthropic is the incumbent for "company ops as plugins" on its own platform, with connectors maintained alongside.
- **Verified (README, issues):** Nobody in the sample is a *verified* end-to-end "ship software with enforced quality gates and a written definition of done" system with named specialist roles for security, a11y, performance, IP and migration. Closest: BMAD (agile roles), Superpowers (process skills, TDD, review), wshobson (202 agents, breadth over gates). This is where agents-know already is strong. Whether the gap is *wanted* is an **Assumption**.
- **Recommendation: option C, staged, but with a hard gate.** Sharpen A first (ship-with-quality-gates, portable across harnesses, secure by default). Add company-ops only as thin, *separately installable* packs after A has traction and the trigger conditions in section 10 are met. Do not pivot to B now. A solo maintainer cannot out-ship Anthropic on company-ops plugins or out-market Superpowers.

---

## 2. Competitor analysis

### 2.1 Profiles (stars/forks/last push verified via GitHub API 2026-11-16 unless noted)

| Project | URL | Stars / forks / last push | What it does | Audience | Platforms | Architecture | Install | Limitations (verified unless noted) |
|---|---|---|---|---|---|---|---|---|
| addyosmani/agent-skills (our base) | https://github.com/addyosmani/agent-skills | 118,252 / 12,351 / 2026-11-14 | Engineering lifecycle skills and slash commands (spec, plan, build, test, review, ship) | Individual engineers, teams | Claude Code, Cursor, Antigravity CLI; others mentioned in issues | Skills + commands + persona agents | Plugin marketplace | Issues show skills fire unreliably (#776, #620, #602), missing `references` after partial install (#597), Cursor provider error (#494), Antigravity commands not discoverable (#445) |
| obra/superpowers | https://github.com/obra/superpowers | 318,602 / 28,389 / 2026-11-03 | "Complete software development methodology": brainstorm, worktree, plan, subagent-driven execution, TDD, review | Individual developers | 16 harnesses listed (Claude Code, Codex, Cursor, Copilot CLI, Gemini CLI, OpenCode and more) | Skills + session-start bootstrap hook + per-platform manifests in one repo | One native install flow per platform | Each harness needs its own install; manual updates on some; optional telemetry ping (opt-out env var); new skills generally not accepted from contributors |
| wshobson/agents | https://github.com/wshobson/agents | 42,578 / 4,501 / 2026-11-16 | 94 plugins, 202 agents, 185 skills, 105 commands in Markdown, adapters generated per tool | Developers wanting a big catalogue | Claude Code, Codex CLI, Cursor, OpenCode, Antigravity CLI, Copilot, Pi | Write once in Claude plugin format, `tools/adapters/` generate others; CI validation and evals | Marketplace for Claude/Codex/Cursor; `make install-<tool>` (needs uv, Python 3.12+) for others | LLM-judge evals are "experimental" and unvalidated against human labels; capability differs per harness; content-accuracy bugs (e.g. outdated PCI requirement titles #821, uncompilable Godot examples #819). Only 14 open issues, which suggests low issue traffic or active triage (**Assumption**) |
| bmad-code-org/BMAD-METHOD | https://github.com/bmad-code-org/BMAD-METHOD | 55,428 / 6,178 / 2026-11-16 | Agile AI-driven delivery: product, architecture, UX, dev, test perspectives; scale-adaptive planning; modules incl. Test Architect, Game Dev, Founder, Creative Intelligence | Teams and solo builders | "AI coding tool" generally; v7 needs skills support | v6.12 stable via installer; v7 alpha = installable skills and modules; durable context across sessions | `npx bmad-method install` (Node 20.12+, Python 3.10+, uv) | v7 is preview alpha with breaking changes; license shown as NOASSERTION by API; 76 open issues dominated by Windows bugs (encoding, locks, npm launch), migration scripts losing data (`--fold-specs` deletes hidden files #3142), install problems (#3148, #3157, #3134), headless `claude -p` runaway scope (#3194) |
| SuperClaude_Framework | https://github.com/SuperClaude-Org/SuperClaude_Framework | 23,939 / 1,985 / 2026-09-27 | Command and persona framework for Claude Code (`/sc:*`) | Claude Code power users | Claude Code; users ask for Gemini, OpenCode, Codex | Python CLI installer + commands + MCP gateway helpers | pipx / npm | Issues: install failures (pipx, npm, stale), Windows encoding crashes (#559, #492), "too many slash commands" (#501), requests for Codex/OpenCode/Gemini (#498, #524, #145), MCP gateway breakage (#564, #518), stale website (#165) |
| VoltAgent/awesome-claude-code-subagents | https://github.com/VoltAgent/awesome-claude-code-subagents | 26,598 / 3,035 / 2026-11-02 | Curated subagent collection | Claude Code users | Claude Code | Markdown subagents | Copy files / plugin | Collection, not an orchestrated system (**Assumption** from category; not deep-read) |
| hesreallyhim/awesome-claude-code | https://github.com/hesreallyhim/awesome-claude-code | 58,149 / 4,971 / 2026-11-16 | Curated list of Claude Code skills, hooks, plugins | Claude Code users | Claude Code | Link list | n/a | Discovery layer, not a product |
| anthropics/skills | https://github.com/anthropics/skills | 195,893 / 23,001 / 2026-11-16 | Anthropic's example and document skills; origin of the SKILL.md format | All Claude users | Claude apps, Claude Code, API | SKILL.md folders | Plugin marketplace | License shown as None/NOASSERTION by API (per-skill terms; unverified) |
| anthropics/claude-plugins-official | https://github.com/anthropics/claude-plugins-official | 47,447 / 4,931 / 2026-11-16 | Official Claude Code plugin marketplace repo | Claude Code users | Claude Code | `/plugins` (Anthropic-maintained) and `/external_plugins`; third-party now submitted at claude.ai/directory | `/plugin install x@claude-plugins-official` | README: "Anthropic does not control what MCP servers, files, or other software are included in plugins and cannot verify they will work as intended or won't change"; vetting criteria not published |
| anthropics/knowledge-work-plugins | https://github.com/anthropics/knowledge-work-plugins | 36,275 / 4,007 / 2026-11-13 | Role plugins: productivity, sales, customer-support, product-management, marketing, legal, finance, data, enterprise-search, bio-research (README list; an HR plugin is reported by third-party directories, not seen in README: unverified) | Knowledge workers on Claude Cowork; also Claude Code | Cowork (primary), Claude Code | Per plugin: `plugin.json`, `.mcp.json`, `commands/`, `skills/`; all markdown and JSON | `claude plugin marketplace add anthropics/knowledge-work-plugins` | README calls them "generic starting points" needing customisation. Issues (97 open): broken connector endpoints/auth (#1447, #1444, #1357), overlapping skills (#1382, #1306, #1283), links broken on claude.ai install (#1381), finance logic edge cases (#1308, #1286), requests for new connector categories (#1416, #1407), version control for memory files (#1422) |
| openai/codex | https://github.com/openai/codex | 135,522 / 21,493 / 2026-11-16 | OpenAI coding agent CLI/app | Developers | CLI, IDE, app | Skills (`.agents/skills`, `$HOME/.agents/skills`, `/etc/codex/skills` admin scope), plugins bundling skills + MCP | `/plugins`, `$skill-installer` | Skills disabled per path in `config.toml`; plugin directory shared with ChatGPT (https://learn.chatgpt.com/docs/build-skills) |
| openai/skills | https://github.com/openai/skills | 28,771 / 2,015 / 2026-10-28 | Curated Codex skills catalogue | Codex users | Codex | SKILL.md | `$skill-installer` | Not deep-read |
| agentsmd/agents.md | https://github.com/agentsmd/agents.md | 25,520 / 1,966 / 2026-09-10 | The AGENTS.md convention for agent instructions | All coding-agent users | Many tools | Single Markdown file | Create file | Instruction file only; no orchestration |
| OpenCode (anomalyco/opencode, formerly sst/opencode) | https://github.com/anomalyco/opencode | ~227.3k stars / ~30.8k forks per repo page 2026-11-16 (API call hit rate limit; page figure, not API) | Open-source coding agent; agents `build`, `plan` (read-only), `general` subagent; Tab switches | Developers | Terminal, desktop beta (macOS, Windows, Linux) | Config-driven agents | `curl ... install`, npm, brew, mise, nix | Docs say MCP and agents are configurable at opencode.ai/docs (not deep-read) |
| Cursor | https://cursor.com/docs/rules, https://cursor.com/docs/plugins/building | Closed source: n/a | Rules (`.cursor/rules`, globs), AGENTS.md, subagents, skills, plugins bundling rules/skills/agents/commands/MCP/hooks; Team Rules on Team/Enterprise plans | Developers | Cursor IDE, CLI | Plugin manifest `.cursor-plugin/plugin.json` | Cursor Marketplace, team marketplaces, cursor.directory | Third-party sources disagree on `.md` vs `.mdc` rules handling; check current docs (**Assumption** that docs change fast) |
| GitHub Copilot custom agents | https://github.com/github/copilot-cli (11,421 / 1,981 / 2026-11-13), https://github.com/github/github-mcp-server (34,524 / 5,360 / 2026-11-16) | see left | Custom agent profiles (`.github/agents/`), org-level profiles, MCP; Copilot CLI plugins | Developers, enterprises | GitHub.com, VS Code, CLI, JetBrains (preview per community source) | Agent profile files with MCP config | Repo file or org registry | Official docs.github.com page was not retrieved; details come from community mirrors, so **unverified** |
| modelcontextprotocol/servers | https://github.com/modelcontextprotocol/servers | 92,045 / 11,971 / 2026-11-12 | Reference MCP servers: Everything, Fetch, Filesystem, Git, Memory, Sequential Thinking, Time | Integrators | Any MCP client | stdio, one Streamable HTTP | Per server | README: "educational examples", not production-ready. 13 servers archived including GitHub, GitLab, Google Drive, Slack, Sentry; Slack now maintained by a third party. Official registry at registry.modelcontextprotocol.io |
| MetaGPT | https://github.com/FoundationAgents/MetaGPT | 71,297 / 9,111 / 2026-01-21 | Roles (PM, architect, PM, engineer) from `Code = SOP(Team)`; one-line requirement to artefacts | Researchers, hobbyists | Python 3.9 to <3.12 | Python framework | `pip install metagpt`, Node + pnpm | Last push 2026-01-21 (stale for ~10 months); no releases listed on page; python version cap; commercial pivot to a hosted product (mgx.dev per README) |
| ChatDev | https://github.com/OpenBMB/ChatDev | 34,756 / 4,350 / 2026-11-06 | v2.0 is a zero-code multi-agent workflow platform; the software-company v1 moved to a `chatdev1.0` branch | Researchers, builders | Web console, Python 3.12+ | FastAPI + Vue console + YAML workflows | `uv sync`, npm, Docker | Needs LLM keys; extending needs code; moved away from the "software company" framing |
| CrewAI | https://github.com/crewAIInc/crewAI | 60,991 / 9,207 / 2026-11-16 | Python framework: Crews (role-based agents) and Flows (event-driven); AMP commercial suite | Developers building agent apps | Python 3.10 to <3.14 | Library + commercial control plane | `uv tool install crewai` | Telemetry on by default (opt-out env var); observability/governance in paid tier; Windows build errors reported in README |
| microsoft/autogen | https://github.com/microsoft/autogen | 61,875 / 9,412 / 2026-11-12 | Multi-agent framework | Developers | Python/.NET | Library | pip | Not deep-read |
| github/spec-kit, everything-claude-code, claude-flow, awesome-cursorrules, dify | n/a | unverified (API rate-limited) | n/a | n/a | n/a | n/a | n/a | Not researched; listed so the gap is explicit |

### 2.2 Company-ops / knowledge products (closed or commercial)

| Product | URL | Position | Verified facts | Notes |
|---|---|---|---|---|
| Glean | https://docs.glean.com | Enterprise search and agents, permissions-aware | Offers its own remote MCP server and a directory of third-party MCP servers incl. Atlassian Rovo; for Atlassian it stores an admin service-account key and attaches it so the agent never sees the raw key (https://docs.glean.com/administration/agent-identity/atlassian, https://www.glean.com/blog/mcp-mar-drop-2026) | Pricing not public; third-party estimates only (**Assumption**: ~$40-50/user/month, aggregator sites, conflicting) |
| Atlassian Rovo | https://developer.atlassian.com/cloud/rovo-mcp/ | Atlassian Cloud agents plus MCP server | Official cloud-hosted MCP server; inherits user's Atlassian permissions; honours org IP allowlists; key actions audit-logged; API-token auth off by default (https://support.atlassian.com/security-and-access-policies/docs/understand-atlassian-rovo-mcp-server/, summary via search 2026-11-16) | Atlassian v1 MCP endpoint is deprecated (removal 2027-03-01 per tool notice); Anthropic repo still points to v1 (knowledge-work-plugins #1447) |
| Dust | https://dust.tt | Builder-oriented agents on company data | Third-party comparison: admins sync chosen data into Spaces rather than inheriting source ACLs (https://coworker.ai/blog/dust-vs-glean) | Dust's own docs and GitHub not read: **unverified** |
| Notion AI | https://www.notion.com | AI inside the workspace | Third-party: Business plan from about $20/member/month with AI credits | Pricing from secondary sites; **unverified** |

---

## 3. GitHub ecosystem analysis

1. **One format won.** **Verified:** Codex reads `SKILL.md` folders with progressive disclosure (name+description first, body on demand) (https://learn.chatgpt.com/docs/build-skills). **Verified (search summaries, blogs, 2026):** Anthropic published the format as an open standard (agentskills.io); counts of adopting tools range from 20+ to 40+ across blogs, so treat the number as unconfirmed. Project paths still differ per tool: `.claude/skills/`, `.agents/skills/`, `.github/skills/` (Cursor inconsistent across sources).
2. **Instruction file convention:** AGENTS.md (25.5k stars) is the neutral baseline; SuperClaude users explicitly ask for AGENTS.md to point at CLAUDE.md (#561, #562).
3. **Distribution has split into two layers.** (a) Native marketplaces per harness (Claude, Codex, Cursor, Copilot CLI, Gemini extensions). (b) Generators/adapters (wshobson) that compile one source to many formats. **Verified:** Superpowers keeps per-platform manifests in one repo; wshobson uses generators with CI validation.
4. **Star counts are dominated by a few accounts.** **Verified (API):** top repos hold 118k to 319k stars. Organic discovery for a new repo typically requires a distinct, demonstrable claim plus being listed in curated lists such as awesome-claude-code (58k). **Assumption:** curated-list inclusion is a main discovery path.
5. **Fast churn.** **Verified:** BMAD v7 is in alpha with breaking changes; SuperClaude has stale docs/site; MetaGPT's last push is 2026-01-21; Pensyve's hosted service (optional memory in wshobson) closed 2026-10-01 per its README. Projects that depend on third-party services age badly.
6. **Quality of content is a live problem.** **Verified:** outdated regulatory content (#821), uncompilable examples (#819), skills that overlap each other or built-ins (knowledge-work-plugins #1382, #1306, #1283), skills that do not fire (agent-skills #620, #602).
7. **Security of the ecosystem is a live problem.** **Verified (secondary sources, 2026):** Red Hat (2026-08-18) says the Claude plugin marketplace relies on implicit trust with no central vetting, code signing or runtime sandbox; SentinelOne and Prompt Security describe marketplace-skill and hook abuse; Snyk's audit scanned 3,984 skills from community registries and reported malware, credential theft and prompt injection; counts of malicious skills differ across sources. **Verified (primary):** Anthropic's own README disclaims control over third-party plugin contents. URLs in section 12.

---

## 4. Comparison matrix

Scale: Strong / Partial / Weak / None / ? (unverified). Based on READMEs and issues read on 2026-11-16, not on hands-on testing.

| Dimension | agents-know (today) | Superpowers | wshobson/agents | BMAD | Anthropic knowledge-work-plugins | CrewAI | Glean / Rovo (closed) |
|---|---|---|---|---|---|---|---|
| Platform compatibility | Claude Code only (**Verified**: plugin.json, README) | Strong (16 harnesses) | Strong (7, generated) | Partial (AI tools with skills) | Partial (Cowork, Claude Code) | n/a (Python lib) | Vendor-hosted |
| Agents / orchestration | Strong: ~19 roles, PM loop, written DoD | Partial: subagent-driven dev | Strong count (202), weak orchestration (**Assumption**) | Strong: agile roles and loop | Weak: single-role skills | Strong (Crews, Flows) | Strong |
| Company context | Weak: profiles, reference blend, no org knowledge | None | None | Partial (durable context) | Partial (user-edited, "generic starting points") | Partial (knowledge folder) | Strong |
| Integrations / MCP | Weak: one local backlog MCP server | None | Partial (optional MCP integrations) | Weak (optional Firecrawl MCP, issue #3153) | Strong breadth, fragile endpoints | Partial | Strong |
| RAG | None | None | None | None | Partial (enterprise-search plugin) | Partial | Strong |
| Automation | Partial: autonomous run to DoD; hooks present | Partial | Partial | Partial (BMad Loop: unattended epics) | Weak | Strong | Strong |
| Security / permissions | Strong intent: hard stops, privacy-by-default, IP guard, security agent (**Verified**: repo files); no signing or sandbox claims | Weak (telemetry opt-out only) | Partial (permission translation per tool) | Weak | Inherits Claude permissions | Weak (telemetry default on) | Strong (ACL-aware) |
| Extensibility | Partial: profiles, agents, skills | Partial (contributions restricted) | Strong (generators, evals) | Strong (Builder, Toolsmith) | Strong (plugin-management plugin) | Strong | Medium |
| DX / install | Partial: two-plugin install, needs agent-skills | Strong per-platform | Mixed (make + uv for some) | Mixed (Node+Python+uv, Windows bugs) | Strong (one command) | Mixed | n/a |
| Docs | Partial: README, references | Strong | Strong | Strong, shifting | Strong | Strong | Strong |

---

## 5. Market gaps

Only gaps with evidence. Each is a gap in *the sampled projects*, not a proven demand.

1. **Gated end-to-end delivery with a written definition of done.** **Verified:** Superpowers = process skills; BMAD = agile planning loop; wshobson = catalogue; none in the sample documents mandatory specialist gates (security, accessibility, performance, IP, migration, SRE) with exit criteria before "done". **Assumption:** the market values this enough to adopt a heavier process.
2. **Evidence-backed completion.** **Verified:** agent-skills has open proposals for a proof-of-done skill (#528) and anti-bloat test guardrails (#789); BMAD headless runs overshoot scope (#3194). agents-know already requires evidence in hand-backs (**Verified**: agent definitions). Competing proposals confirm the need is felt.
3. **Safe-by-default operation.** **Verified:** BMAD migration scripts deleting hidden files (#3142); ecosystem has no central vetting (Red Hat). agents-know has hard stops on data deletion and production DBs (**Verified**: agent instructions). A safety posture is rare among instruction frameworks (**Assumption**, from README sampling).
4. **Cross-harness parity with honest capability matrix.** **Verified:** wshobson points to a capability matrix; SuperClaude users ask for Codex/OpenCode/Gemini (#498, #524, #145). No project in the sample documents which gates survive on which harness (**Assumption**).
5. **Company-ops that does not depend on fragile connectors.** **Verified:** knowledge-work-plugins connector failures are the largest bug cluster in its first page of issues. Gap is real but the incumbent owns it.

## 6. Unsolved user problems (from issues and sources)

| Problem | Evidence | Who suffers |
|---|---|---|
| Skills do not trigger reliably | agent-skills #776, #620, #602 | All skill users |
| Too many commands/agents to learn | SuperClaude #501; wshobson 202 agents (**Assumption** that size causes confusion) | New users |
| Install fails across OS and tools | SuperClaude #532, #546, #559; BMAD Windows cluster #3125-#3129; agent-skills #597 | Windows users, non-Claude users |
| Windows support | BMAD, SuperClaude | Windows users |
| Subagent token cost | Claude Code issue requests (feature request for context profile on Agent tool, via claudeissues.com 2026-11-16); blogs estimate 4-7x cost for subagents (estimate, not benchmark) | Cost-conscious users |
| Stale or wrong content | wshobson #821, #819; knowledge-work-plugins #1286 | All |
| Overlap/duplication between skills | knowledge-work-plugins #1382, #1306, #1283 | All |
| Unvetted third-party plugins | Red Hat, Snyk, Anthropic README disclaimer | Security-minded teams |
| Runaway or destructive automation | BMAD #3194, #3142 | Anyone running headless |
| Memory/context file loss | knowledge-work-plugins #1422 (suggest version control before bulk rewrites) | Productivity plugin users |

## 7. Opportunities for differentiation

All **Recommendation**, each tied to evidence above.

1. **"Done means proven"**: publish the definition-of-done and gate list as a portable spec, and ship an eval that shows the gates catching planted defects. Answers #528, #789 and the "evals unvalidated" weakness in wshobson.
2. **Safe-by-default as the headline**: hard stops, no-delete rules, secret handling, supply-chain hygiene for our own plugin (pinned versions, no telemetry, no network calls on install). Counter to the Red Hat / Snyk findings.
3. **Small surface**: keep a deliberately small command set and agent count with progressive disclosure. Counter to #501 and catalogue bloat.
4. **Honest portability**: ship a capability matrix per harness stating which gates are enforced by hooks versus only instructed. Counter to the "support varies" caveat in wshobson/Superpowers.
5. **Token-cost visibility**: PM brief template that names which agents run and the model per agent (the lean mode already exists in practice, **Assumption** it generalises).
6. **Windows-first testing**: BMAD and SuperClaude both bleed on Windows; a CI matrix with Windows is a cheap, visible differentiator.

## 8. Target audience

- **Primary (Assumption):** solo developers, small agencies and small product teams already using Claude Code or Codex, who want a repeatable delivery process with review gates and evidence, not just prompts.
- **Secondary:** engineering leads wanting a standard definition of done and guardrails for agent work in a repository.
- **Not now:** non-technical HR, finance, legal or sales users (Anthropic's Cowork plugins target them directly and have a distribution channel we lack), and large enterprises needing permission-aware search (Glean/Rovo own that).

## 9. Product positioning

**Recommendation (draft one-liner):** "A product company in a plugin: specialist agents that ship software end to end, stop at quality gates, and show evidence. Safe by default, portable across coding agents."

Differentiate on: gates plus evidence, safe defaults, small surface, honest portability. Avoid claims: "company operating system", "replaces your team", "enterprise knowledge" (**Recommendation**; each is a claim the sampled incumbents already own or that cannot be substantiated by a solo maintainer).

## 10. Recommended MVP and roadmap

### The critical question: A, B or C?

| Criterion | A: Sharpen "ships software with quality gates" | B: Pivot to "company operations OS" | C: Staged A then B |
|---|---|---|---|
| Existing strength | Matches today's repo (**Verified**: README, agents) | Mostly new work (HR, recruiting, onboarding, RAG, comms) | Same as A first |
| Competition | Crowded but no sampled project combines mandatory multi-specialist gates and DoD (**Verified** sample; **Assumption** it is complete) | Anthropic ships role plugins with connectors on its own platform (36.3k stars); Glean/Rovo/Dust/Notion own enterprise knowledge | Defers the fight |
| Solo-maintainer cost | Bounded: improve gates, tests, portability | Unbounded: each function needs domain content kept accurate; knowledge-work-plugins issues show accuracy and connector upkeep is already hard even for Anthropic | Bounded, with option value |
| Security/privacy exposure | Low (code repos) | High: HR/recruiting/onboarding data is personal data; RAG needs permission-aware retrieval (Glean/Rovo build this as core) | Postponed until a real design exists |
| Discovery | Clear claim, demoable | Vague claim, hard to demo | A first |
| Risk of fatigue | Low | High (breadth, stale content, connector breakage) | Mitigated by gate |

**Recommendation: C, with explicit stage gates.** A is the defensible core; B as a pivot is not defensible for one maintainer today. **Evidence for the call:** (1) Anthropic's incumbent plugins for company functions, with issue backlog showing connector and accuracy upkeep (97 open issues; Verified); (2) the best-known broad catalogue (wshobson) has 202 agents but states its own evaluation layer is unvalidated (Verified); (3) the multi-platform layer is already solved generically by Superpowers and wshobson generators, so portability must be done thinly by adopting SKILL.md and AGENTS.md rather than inventing; (4) personal-data domains (HR, recruiting) raise privacy exposure disproportionate to a solo maintainer (Recommendation, consistent with the privacy-by-default reference in the repo).

### Recommended MVP (stage 1, "A+")

1. Portable core: skills in SKILL.md format plus an AGENTS.md that carries the PM rules; generated Claude plugin, Codex and Cursor outputs from one source (reuse existing adapter patterns; do not build a new framework). OpenCode and Copilot after.
2. A published, versioned **Definition of Done and gate spec** with a capability matrix: which gates are hook-enforced vs instruction-only per harness.
3. A small, fixed command set and a "light mode" for small tasks.
4. Evidence-first hand-backs and a demonstrable eval (planted defects caught by security, a11y, QA and IP agents).
5. Secure-by-default plugin hygiene: no telemetry, no install-time network, pinned references, SECURITY.md, documented threat model of the plugin itself.
6. Windows and macOS/Linux CI for the installer and hooks.
7. One flagship demo, reproducible in minutes.

### Roadmap

| Stage | Scope | Gate to enter |
|---|---|---|
| 1 (now) | MVP above | n/a |
| 2 | Thin "ops packs" as separate plugins reusing the same PM loop and gates: technical writing, engineering onboarding (repo-centric), engineering knowledge (docs, ADRs, runbooks), PM artefacts (specs, roadmaps). Repo-only data; no personal data. | Stage 1 has external users, open issues triaged, one outside contributor merged (**Recommendation**; numbers are the owner's call) |
| 3 | MCP integrations via existing vendor-hosted servers (Atlassian Rovo MCP, GitHub MCP, Slack/Notion vendor servers), consumed not rebuilt; permission inheritance documented per server | Stage 2 packs used; written data-classification policy |
| 4 | HR, recruiting, onboarding of people, company intelligence | Explicit privacy design (data minimisation, retention, no candidate scoring without human decision), legal review, and a maintainer team beyond one person. Otherwise Never. |

## 11. Risks and assumptions

| # | Item | Type | Mitigation |
|---|---|---|---|
| 1 | Demand for heavy, gated process is assumed, not measured | Assumption | Launch the demo; track installs, stars, issues asking for gates versus lighter modes |
| 2 | Anthropic or Superpowers add gate-like features | Assumption | Differentiate on evidence, safety, and portability spec, which are harder to copy by adding a skill |
| 3 | Harness APIs and paths change quickly (Cursor, Copilot docs; Codex docs redirects seen) | **Verified** (redirect and conflicting `.md`/`.mdc` reports) | Single source plus generators; pin to docs with dates |
| 4 | Dependency on addyosmani/agent-skills (118k stars) | **Verified** (README) | Keep soft dependency; vendor the few skills needed with licence compliance; track upstream issues (#597, #776) |
| 5 | Maintainer capacity | Assumption | Small surface; automate validation; decline scope that needs domain upkeep |
| 6 | Our plugin is itself a supply-chain target | **Verified** class of risk | Signed releases and pinned refs; minimal hooks; review hook code |
| 7 | Star-count claims go stale | **Verified** (numbers dated 2026-11-16) | Re-read before publishing |
| 8 | Some competitor data unverified | **Verified** gaps: OpenCode API figures (page figure used), Copilot official docs, Dust, Notion, spec-kit, everything-claude-code, claude-flow, dify | Re-run before launch |
| 9 | Pricing of Glean/Dust/Notion from secondary sources | Unverified | Not used for decisions |
| 10 | Aggregated "adopted by 40+ tools" claim for SKILL.md | Unverified blogs | Confirm at agentskills.io before citing |

Not researched: Slack/Notion/Google Workspace MCP servers beyond the reference-servers README; hands-on install tests of any competitor; GitHub Discussions (issue lists only, first page of each, so themes are samples).

## 12. Evidence and source links (all read 2026-11-16)

GitHub API (repo metadata): https://api.github.com/repos/{owner}/{repo} for each repo in section 2.

READMEs and issue pages:
- https://github.com/addyosmani/agent-skills and /issues
- https://github.com/obra/superpowers
- https://github.com/wshobson/agents and /issues
- https://github.com/bmad-code-org/BMAD-METHOD and /issues
- https://github.com/SuperClaude-Org/SuperClaude_Framework/issues
- https://github.com/anthropics/knowledge-work-plugins and /issues
- https://github.com/anthropics/claude-plugins-official
- https://github.com/modelcontextprotocol/servers
- https://github.com/anomalyco/opencode
- https://github.com/crewAIInc/crewAI
- https://github.com/FoundationAgents/MetaGPT
- https://github.com/OpenBMB/ChatDev

Docs and secondary:
- Codex skills: https://learn.chatgpt.com/docs/build-skills (redirected from developers.openai.com/codex/skills)
- Cursor: https://cursor.com/docs/rules, https://cursor.com/docs/plugins/building, https://cursor.com/docs/customize-cursor
- Rovo MCP: https://developer.atlassian.com/cloud/rovo-mcp/, https://support.atlassian.com/security-and-access-policies/docs/understand-atlassian-rovo-mcp-server/
- Glean: https://docs.glean.com/administration/agent-identity/atlassian, https://www.glean.com/blog/mcp-mar-drop-2026
- Plugin security: https://developers.redhat.com/articles/2026/08/18/securing-claude-code-plug-ins-best-practices-repository-security, https://prompt.security/blog/when-your-plugin-starts-picking-your-dependencies-marketplace-skills-and-dependency-hijack-in-claude-code, https://www.sentinelone.com/blog/marketplace-skills-and-dependency-hijack-in-claude-code, https://snyk.io/pt-BR/blog/toxicskills-malicious-ai-agent-skills-clawhub
- SKILL.md standard (blogs, counts unverified): https://noqta.tn/en/blog/agent-skills-skill-md-universal-ai-coding-standard-2026, https://dev.to/nathanielc85523/skillmd-goes-multi-ecosystem-how-the-agent-skills-standard-jumped-from-anthropic-to-openai-and-3oeg
- Subagent cost: https://claudeissues.com/issue/59417-feature-request-context-profile-parameter-on-agent-task-tool-to-reduce-subagent, https://www.mindstudio.ai/blog/claude-code-subagents-cost-tokens, https://agentic.proxify.io/patterns/cost-and-model-routing.md
- Company-ops comparisons (secondary, pricing unverified): https://coworker.ai/blog/dust-vs-glean, https://coworker.ai/blog/rovo-vs-glean
- Copilot custom agents (community mirrors only): https://awesome-copilot.github.com/learning-hub/building-custom-agents/
