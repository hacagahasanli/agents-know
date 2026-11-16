# Company modes

The company mode sets how demanding the run is: which gates run, who joins, how hard the bar-raiser pushes, and which models are used. It is asked once at the start of `forge`, `feature`, `fix` and `task`, unless the profile has `Company mode:` set (the `setup` skill asks for the default). The user can answer with one word. The choice goes into `brief.md` (every work mode has one) as `Company mode: <mode>`, and every brief to an agent repeats it. `pm-playbook.md` section 7 shows how each mode changes the PM's orchestration.

The mode never lowers the data-safety rules, the hard stops, the privacy defaults or the severity rule that critical and high findings block a release. It changes how much ceremony surrounds them.

| | `startup` | `standard` (default) | `bigtech` | `hardcore` |
| --- | --- | --- | --- | --- |
| Idea | Move fast, MVP quality | Today's behaviour | Every gate, on the record | A toxic boss: excellent or rejected |
| Gates | G0 baseline, G2 tests, G3 only for security-relevant changes | G0-G3 as in `quality-gates.md` | G0-G3, full verify suite on every release | G0-G3, full verify suite, every slice |
| Agents | PM, the engineer, `qa-engineer`; add `security-engineer` only on auth, authz, private data or dependencies | As `work-modes.md` lists | Everyone relevant, plus `architect` ADRs, `sre-engineer`, `tech-writer`, design docs before building | Same as `bigtech` |
| `skeptic` | On the final hand-back of the run | On every hand-back that claims code works, before the staff review | On every hand-back | On every hand-back; attacks every claim and every test it can |
| `bar-raiser` | Off | On the final change set, with the staff review | On every slice and every phase exit | On every hand-back of every agent |
| Bar-raiser minimum score | - | 3 of 5 on every axis | 4 of 5 | 5 of 5 on correctness and evidence, 4 on the rest |
| Rework rounds (max per hand-back) | 0 (findings go to the ledger) | 2 | 3 | 5, then the PM reports the unresolved demand to the user |
| Docs | Commit plan and short report | Review guide and commit plan | Design doc, ADRs, runbook, review guide, user guide | Same as `bigtech` |
| Model routing (via `dispatcher`) | Cheapest adequate: `haiku` for scanning and read-only checks, `sonnet` for building, `opus` only for a hard debug or an irreversible decision | Cheapest adequate; `opus` for architecture, hard debugging and security | As `standard`, with `opus` on review roles | As `bigtech`; no downgrade on a role that failed a gate |
| Team size | Smallest that works | Right-sized | Full | Full |
| Tone | Brisk, one-line updates | Plain and professional | Formal, documented | Blunt and demanding about the work |

## Rules for every mode

- **Dispatcher.** The PM asks `dispatcher` to staff each `forge` or `feature` phase and any slice whose team is not obvious; for a `task` or a one-cause `fix` the PM staffs the work-mode minimum and records it in one ledger line. The PM may override the dispatcher and records why.
- **Cartographer.** On a repository without a fresh `REPO_MAP.md` (missing, or the recorded sha far behind), `cartographer` runs first, in every mode. After slices that add modules or patterns it updates the map incrementally.
- **Order of review.** Hand-back, the PM's mechanical check, then `skeptic` (where the mode runs it), then `bar-raiser` (where the mode runs it), then the PM's own spot-check (`pm-playbook.md` section 7). A `skeptic` list of disproven claims goes back to the agent before the `bar-raiser` reads anything.
- **Rework loop.** A rework round is: demands to the same agent, a fixed hand-back, `skeptic` again on the claims that were disproven, `bar-raiser` again. When the rounds are used up, the PM stops the loop, lists the unmet demands in the ledger and the report, and applies the playbook rule for open findings (critical and high still block).
- **Escalation.** The mode can be raised mid-run by the user, never lowered by the PM. Changing it is recorded in the ledger.
- **Tone applies to the work only.** In every mode, criticism is aimed at the work, never at a person or the user, and never uses insults or slurs.

## `startup`

Ship something that works. Tests pass, the baseline did not regress, nothing unsafe. Polish, extra reviews and long documents are skipped on purpose and the report says so under "not done by design". Findings below high go to the backlog, not into rework.

## `standard`

The default. Gates and agents as documented elsewhere in this plugin; `skeptic` and `bar-raiser` add one independent check before the staff review.

## `bigtech`

Everything is written down and reviewed. The architect produces design docs and ADRs before any build slice starts, every slice passes the full verify suite, and the `bar-raiser` signs off each slice and each phase exit. Expect slower runs and more documents.

## `hardcore`

A deliberately toxic boss, for people who want their AI held to an unreasonable standard. The `bar-raiser` is brutal and blunt, has zero tolerance, and rejects until the work is excellent. The `skeptic` assumes every claim is false until it reproduces it. Typical bar-raiser lines: "No evidence. Rejected." and "You tested the happy path. Where is the error state? Rejected." The critique stays professional: it is about the work, it is specific, every rejection carries a demand that can be acted on, and there are no insults, slurs or personal remarks, and none aimed at the user.
