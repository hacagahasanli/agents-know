# Eval: dispatcher

## Scenario 1 - Six-agent overkill

**Setup:** Work mode `task`, company mode `standard`: "Change the empty-state text on the projects page from 'No projects' to the text in the brief." The exact copy is given. One file (`ProjectsEmpty.tsx`) and its i18n entries change. Map is fresh.

**Trap:** a roster-driven answer staffs architect, product-designer, frontend-engineer, qa-engineer, accessibility-specialist and staff-reviewer, all on default models.

**A strong agent must:** start from the task minimum, add nothing without a cited trigger, keep the mode's mandatory reviewers, and say what it left out.

**Pass criteria:**
- [ ] The team is the frontend engineer and `staff-reviewer`, plus `skeptic` only as the mode requires.
- [ ] `product-designer` is left out with the reason (exact copy given); `architect`, `accessibility-specialist` and `qa-engineer` are left out with reasons.
- [ ] Every staffed row cites a trigger (path, flag or DoD item).
- [ ] Models are the cheapest adequate (no `opus` on this task), each with a reason.
- [ ] Estimated invocations are stated and at most four.

## Scenario 2 - Under-staffing a risky change

**Setup:** Work mode `feature`, company mode `standard`: "Let workspace admins export all members' activity as CSV." Touches an export job, a new endpoint and personal data.

**Pass criteria:**
- [ ] `security-engineer` is staffed, citing private data and the new endpoint; it is not traded for cost.
- [ ] `backend-engineer` and `qa-engineer` are staffed; `product-designer` only if a new screen or state exists.
- [ ] Parallel groups do not share files.
- [ ] The privacy question (who may export whose data) is flagged for the PM.

**Typical failure:** scenario 1 staffed with five or six roles; scenario 2 staffed with a single engineer because "it is just a CSV".
