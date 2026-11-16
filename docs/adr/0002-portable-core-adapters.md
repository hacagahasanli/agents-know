# ADR 0002: Portable core with generated platform adapters

- Status: proposed (for owner approval with the strategy documents)
- Date: 2026-11-16
- Deciders: repository owner

## Context

Users run different coding agents. Distribution has split into native marketplaces per harness and generators that compile one source to many formats (Verified: research section 3; one sampled project generates seven targets). The open Agent Skills format is read by several harnesses (Verified for Codex and Cursor in their docs; the "adopted by N tools" counts in blogs are unconfirmed). Harness formats differ in important ways (Verified 2026-11-16 through official docs, read via a summarising fetch tool):

- Claude Code: markdown agents with `disallowedTools`; for plugin agents, `hooks`, `mcpServers` and `permissionMode` are ignored; hooks and MCP come from plugin-level files.
- Codex: skills in `.agents/skills`; custom agents as TOML in `.codex/agents` (sandbox, approval and MCP are inherited, not overridable per agent); `AGENTS.md` with a 32 KiB default limit; hooks that can block with exit code 2.
- Cursor: markdown agents with a `readonly` flag; rules as `.mdc` (docs disagree on whether `.md` is accepted); plugin manifest; hooks with exit code 2 and fail-open on crash unless `failClosed`.
- OpenCode: markdown agents with `mode` and path-based permission rules; V1 frontmatter fields deprecated.
- Copilot: `.github/agents/*.agent.md` with a tools list and a 30,000 character body limit; repository instruction files; hooks exist, deny semantics unconfirmed.

The repository already is a valid Claude Code plugin and works. The maintainer is one person.

## Options

| Option | For | Against |
| --- | --- | --- |
| 1. Claude-only | No new work | Excludes most users; contradicts D3 |
| 2. Hand-maintained copies per harness | Simple to start | Drift guaranteed; each change multiplied by five; cannot be kept honest |
| 3. New neutral source format (own schema), compile to every harness including Claude | Cleanest model | Moves every file; breaks the working plugin; invents a format users must learn; larger migration |
| 4. **Claude plugin format as source, generator emits other harnesses, generated capability matrix** | No file moves; Claude Code tolerates extra metadata; validated by an existing tool; one place to fix; honest matrix | Source inherits Claude concepts (tool names, placeholders) that must be rewritten per target |
| 5. Rely on cross-harness readers (Cursor reads `.claude/agents`; many tools read `AGENTS.md` and SKILL.md) with no generator | Almost no code | Not complete (Codex needs TOML agents; hooks and permissions differ); cannot express downgrades; relies on behaviour we do not control |

What a top-tier team would pick: option 4, or 3 if it were starting from nothing (this is the approach the closest generator-based project in the sample took, writing in Claude plugin format and generating adapters). We match option 4 and keep option 5 as a documented fallback for users on Cursor.

## Decision

Option 4.

1. Source of truth stays at `agents/`, `skills/`, `references/`, `hooks/`, `scripts/`, `.mcp.json`. No file moves.
2. A zero-dependency Node generator (`tools/build.mjs`) parses the source into an intermediate model (Agent, Skill, Hook, McpServer), applies per-target config (`targets/<id>.json`), and emits native files. The `claude` target is a passthrough.
3. Placeholders (`${CLAUDE_PLUGIN_ROOT}`, `${CLAUDE_PLUGIN_DATA}`, `/agents-know:<skill>`) are rewritten by one function.
4. Model identifiers are never copied. Source models map to a tier (reasoning, standard); targets default to the user's own model; an optional file maps tiers to model ids.
5. Every feature that a target cannot express is recorded as a downgrade (E2 enforced, E1 coarse native, E0 instructed, none) in `MANIFEST.json` and in a generated `docs/CAPABILITIES.md`. CI fails when the committed matrix drifts. README claims must not contradict the matrix.
6. Targets carry a status: `supported` (Claude, Codex, Cursor), `beta` (OpenCode, Copilot), and a `verifiedOn` date; a target is promoted only when its open verification items are closed.
7. The guard hook ships to non-Claude harnesses only after real hook payloads are captured as fixtures (V1). Until then those targets are E0 for hard stops and say so.
8. Shared state in `~/.agents-know/` is harness-neutral.

Full interfaces, mappings and tests: `docs/ARCHITECTURE.md`.

## Consequences

- Positive: one fix reaches five harnesses; users get a truthful statement of what holds where; the matrix is a differentiator (D3) and a test target.
- Negative: we own the mapping and must track five moving formats. Mitigations: per-emitter isolation, golden and conformance tests, `verifiedOn` with a 60 day warning, `beta` labels, and a rule that a target we cannot verify is not marked supported.
- The source cannot use features that have no portable expression without a recorded downgrade; lint enforces it.
- The generator becomes security-relevant code (it writes into user projects); `install.mjs` is dry-run by default, marker-only, and confined to `--into`.

## Revisit when

A neutral standard for agents (not only skills) is adopted by two or more of the five harnesses; a harness removes a feature we map to; or the Claude plugin format adds a field we should use instead of a derived value (for example a first-class read-only flag).

## Evidence labels

Verified: harness facts above (official docs, 2026-11-16, via summarising fetch; re-read raw pages before coding each emitter). Assumption: OpenCode skills location and `AGENTS.md` support; Copilot skills location, tool aliases and hook deny semantics; Codex and Cursor hook payload shapes. Recommendation: tier defaults, the 24 KiB instruction budget, the 60 day re-verification window.
