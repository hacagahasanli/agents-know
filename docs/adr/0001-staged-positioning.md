# ADR 0001: Staged positioning (end-to-end delivery first, company operations later and gated)

- Status: accepted by the owner (path C of `docs/MARKET_RESEARCH.md`)
- Date: 2026-11-16
- Deciders: repository owner

## Context

The research (Verified, GitHub API and READMEs read 2026-11-16) shows a crowded "skills and agents for coding tools" space with very large incumbents, and an Anthropic-maintained set of role plugins for company functions with connectors. It also shows no sampled project documenting mandatory multi-specialist gates and a written definition of done (Verified for the sample; Assumption that the sample is complete), and a live safety problem in the plugin ecosystem. agents-know today is a PM-led company of 18 specialist agents and 10 skills with gates G0 to G3, a guard hook and a mentor (Verified: this repository). The maintainer is one person.

## Options

| Option | For | Against |
| --- | --- | --- |
| A. Sharpen "ships software with quality gates", add portability | Matches existing strength; bounded cost; clear, demoable claim | Crowded category; demand for a heavy process is an Assumption |
| B. Pivot to a company operating system (HR, recruiting, knowledge, RAG) | Larger imagined market | Incumbents own it (role plugins with connectors, enterprise search); personal-data exposure; unbounded content upkeep; vague claim |
| C. Staged: A now; ops packs and integrations later behind explicit gates | A's focus with B's option value | Needs discipline to keep the gates |

What a top-tier team would pick: C, because it spends effort where there is a verified gap and defers the contested market until there is evidence and capacity. We match that.

## Decision

Adopt C. Stage 1 delivers three differentiators: D1 done means proven (gates with evidence), D2 safe by default, D3 honest portability with a capability matrix. Stages 2 to 4 (ops packs, vendor MCP integrations, HR and company intelligence) are roadmap only, each behind entry conditions written in `docs/PRODUCT_STRATEGY.md` section 7 and `docs/ROADMAP.md`.

## Consequences

- Public claims are limited to what Stage 1 can prove. We do not use the phrases "company operating system", "replaces your team" or "enterprise knowledge".
- New scope is judged against the stage gates, not against enthusiasm. Requests for HR, recruiting or retrieval are answered with the entry conditions.
- The repository stays small: 24 agents and 10 skills are the surface; additions must be justified in `docs/AGENT_DESIGN.md` section 8.
- Success is measured by planted-defect recall, guard corpus pass and adoption signals, not by feature count.

## Revisit when

Stage 2 entry conditions are met, or when two or more users ask for the same non-software function with data they can share safely, or when an incumbent ships mandatory-gate delivery (then re-test D1's uniqueness).

## Evidence labels

Verified: research tables and this repository. Assumption: demand for gated process; completeness of the sample. Recommendation: the entry conditions' thresholds (owner's call).
