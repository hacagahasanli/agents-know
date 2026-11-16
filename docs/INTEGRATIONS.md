# agents-know: Integrations

Status: describes what exists today and how future integrations plug in. Date: 2026-11-16.
Rule for this whole document: **we never claim an integration we have not tested.** Every integration carries one status from section 2, and only `Tested` and `Used` rows may appear in the README.

## 1. Integration model

- **Consume, do not rebuild.** Vendor-hosted MCP servers are consumed as they are. We do not maintain connectors (reason: connector upkeep is the largest bug cluster even for the vendor-backed role plugins in the research sample; Verified, research section 3 and 5; and vendor endpoints move, for example Atlassian's v1 MCP endpoint is deprecated with removal on 2027-03-01, per the tool notice seen on 2026-11-16).
- **Capability names, not vendor tool names.** Agents and skills refer to capabilities (`issue-tracker.read`, `issue-tracker.write`, `docs.read`, `vcs.pr.read`). The user's profile maps a capability to a server (Recommendation). Agent text never hardcodes a vendor tool name, so a vendor change touches one profile line, not eighteen agents.
- **Read first, write by approval.** Every capability is classed read or write. Write-class tools need an approval point (below) and are denied by the guard unless the profile allow-lists them (Recommendation; the guard today does not cover MCP tools, see `SECURITY.md` F4).
- **Data class travels with the capability.** The profile records what data class the server returns (public, internal, personal). Personal data never enters run files unless the user opted in (`privacy-by-default.md`).
- **Failure is local.** If a server is absent or fails, the mode that needs it reports it and stops; all other modes work (Verified for backlog: the other skills do not call it).

## 2. Status labels

| Status | Meaning | May be claimed in README |
| --- | --- | --- |
| Used | Runs in the maintainer's daily work; no automated test | Yes, labelled "used, untested in CI" |
| Tested | Automated test in CI against the server or a recorded fixture | Yes |
| Documented | Config snippet written from vendor docs, never run | No; listed only here as "not tested" |
| Idea | Not started | No |

## 3. MCP usage today

### 3.1 The `backlog` server (Verified: `.mcp.json`, `scripts/backlog-mcp.mjs`, `skills/backlog/SKILL.md`)

| Property | Value |
| --- | --- |
| Transport | stdio, started by the harness: `node ${CLAUDE_PLUGIN_ROOT}/scripts/backlog-mcp.mjs` |
| Store | one JSON file per profile at `~/.agents-know/backlog/<profile>.json` (directory overridable with `AGENTS_KNOW_BACKLOG_DIR`); lock file with a 3 second wait and 15 second stale limit |
| Tools | `backlog_list`, `backlog_add`, `backlog_update`, `backlog_delete` |
| Task fields | `title` (200), `note` (4000), `type` (bug, feature, improve), `area` (fe, be, design, full), `status` (backlog, doing, decision, done), `rank`, `pm`, `answer`, `branch`, `run` |
| Input validation | JSON schema with enums, patterns and length limits at the boundary |
| Network | none |
| Consumers | the `backlog` skill (PM ranks tasks, works each in task, feature or fix mode, asks decisions through `status: decision`); any MCP client that runs the same server, for example a board UI |
| Status | **Used**; no automated test exists (Verified: `tests/` contains only the guard test). MVP adds a protocol smoke test (initialize, list tools, add, list, update, delete on a temp directory) |

Security notes: the store is a plain file, so any process of the user can edit it; `note` and `answer` are user input and untrusted text for prompt-injection purposes (`SECURITY.md` section 6, point 5). Deletion of a task is a hard delete of a backlog record; it is the user's own planning data, not product data, and the tool is annotated accordingly (Recommendation: confirm that `backlog_delete` carries a destructive hint and that the skill never calls it without the human).

### 3.2 Per-harness availability of the backlog server

| Harness | Mechanism | Status |
| --- | --- | --- |
| Claude Code | plugin `.mcp.json` (Verified) | Used |
| Cursor | `mcp.json` at plugin root (Verified location) | Documented |
| Codex | `[mcp_servers.backlog]` in `config.toml`; subagents inherit the parent's MCP servers (Verified inheritance; the table syntax is an Assumption) | Documented |
| OpenCode | `mcp` entry in `opencode.jsonc` (Assumption) | Documented |
| Copilot | repository MCP settings; agent-level `mcp-servers` is not used in IDEs (Verified) | Documented |

The generator emits the snippet for each target and marks it `Documented` until someone runs it. Promotion to `Tested` requires the smoke test running against that harness's launch command.

## 4. How vendor MCP servers plug in later (Stage 3, gated)

### 4.1 Integration descriptor

Each integration is one file `integrations/<vendor>.md` with a fixed front section, so reviewers and the generator see the same facts:

```yaml
id: <vendor-or-product>
status: documented            # idea | documented | tested | used
server: { type: remote-http | stdio, url-or-command: "<from vendor docs>", auth: "<method per vendor docs>", docs: "<url>", verifiedOn: "<date>" }
capabilities:
  - name: issue-tracker.read
    tools: ["<vendor tool names>"]
    class: read
    data: internal
  - name: issue-tracker.write
    tools: ["<vendor tool names>"]
    class: write
    data: internal
approval: per-action          # none | per-session | per-action
permissions: "inherits the signed-in user's permissions"   # only if the vendor documents it
audit: "<what the vendor logs>"                            # only if documented
known-issues: ["<link>"]
```

The generator reads these descriptors to (a) emit the per-harness MCP snippet, (b) add the capability's write tools to the guard's deny-by-default list, and (c) generate the section of the capability matrix that shows integration support per harness.

### 4.2 Candidate integrations (all `Idea` today; nothing below is tested)

| Capability | Candidate | Why it fits | What we must verify first |
| --- | --- | --- | --- |
| Source host and pull requests | GitHub's official MCP server (reference repo present in the research sample) | Commit plan and PR text are already outputs; read-only first | Auth scopes needed for read-only; write tools list for the deny list |
| Issue tracking | Atlassian's hosted MCP server (inherits user permissions and logs key actions per the vendor docs read through a search summary) | Backlog mode could read or mirror tickets | Use the v2 endpoint; confirm the permission model in the raw vendor page, not a summary |
| Docs and wiki | A vendor-hosted docs server (Notion, Confluence, or similar) | `tech-writer` and `researcher` could read internal docs | Data-class policy first (Stage 3 entry condition) |
| Chat | A vendor-hosted chat server | Notifying the owner; low value for MVP | Whether it adds anything over the feed file |

Not planned: HR, recruiting, CRM and finance systems (Stage 4 gate, `PRODUCT_STRATEGY.md` section 7).

### 4.3 Approval points for integrations

| Action class | Default | Where the human sees it |
| --- | --- | --- |
| Read, internal data | allowed after the profile lists the server | feed line per call batch (Recommendation) |
| Read, personal data | denied unless the profile says so and the data class is recorded | ledger decision |
| Write (create, update, transition, comment, merge) | one approval per action, in the conversation or in the backlog `decision` status | ledger decision with the exact payload summary |
| Destructive (delete, close, merge to main) | never by an agent | the human does it |

### 4.4 Promotion criteria (Documented to Tested)

1. Descriptor complete with `verifiedOn` within 60 days.
2. A recorded-fixture test (request and response samples with secrets removed) runs in CI, or a live test that the maintainer runs and attaches the log of.
3. The write-class tools of the server are on the guard deny list and a guard test proves the block.
4. README row added only now.

## 5. Other integration points (not MCP)

| Point | State |
| --- | --- |
| Host repository checks (type check, lint, tests) | Run by agents through the shell from the profile's `Checks to run`; no plugin code involved |
| Browser testing | The `agent-skills:browser-testing-with-devtools` skill expects a Chrome DevTools MCP server, which the user configures (Verified: the skill text; not bundled by us) |
| Upstream skills | `addyosmani/agent-skills` is a soft dependency: agents cite `agent-skills:*` skills when available (Verified); without it they skip them. The adapter documents this as a degraded mode per target |
| Run feed | Plain file; any tool can `tail -f` it |

## 6. Open questions

1. Should the capability-name layer (section 1) exist before the first vendor integration, or only when the second arrives? Recommendation: write the descriptor format now (this document), build the code at Stage 3.
2. Is the backlog server worth publishing to an MCP registry? Recommendation: not until it has tests and a second consumer.
