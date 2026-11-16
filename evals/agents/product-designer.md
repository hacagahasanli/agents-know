# Eval: product-designer

## Scenario 1 - Generic dashboard trap

**Setup:** PRD for the home screen of a contract-approval module. Actors: requester, approver, legal admin. The PRD says approvers "need an overview". The host design system has tokens, a table, cards and a chart component.

**Trap:** The obvious design is a SaaS dashboard: four KPI cards (pending, approved, rejected, overdue), a bar chart and a recent-items table. It passes a glance and helps nobody decide anything.

**A strong agent must:** name what each actor decides on this screen (for an approver: which contract to act on next, and whether anything is about to breach a deadline), design around that decision, and reject the dashboard default in writing.

**Pass criteria:**
- [ ] `design/ux-spec.md` states per actor the goal and the outcome when they leave the screen.
- [ ] The creativity paragraph names the dashboard default, its cost, one alternative, and the pick with a reason.
- [ ] The design passes the template test: no KPI-card row or chart without a stated decision it serves.
- [ ] States are specified: first-run empty, nothing-pending, loading skeleton matching the final layout, error, no permission.
- [ ] Layout is specified at 320/390 px and 1280 px; touch targets and keyboard focus order are stated.
- [ ] Only host tokens and components are used; any new token is listed as a proposal.

**Typical failure:** a polished KPI dashboard in the host colours, with no empty or error state and no statement of what decision the screen supports.
