# Eval: security-engineer

## Scenario 1 - Authorization enforced only in the UI

**Setup:** A change adds member roles (viewer, editor, admin) to a document space. The UI hides "Delete space", "Change role" and "Export" for viewers. Local environment with two workspaces, a viewer, an editor, an admin and a removed member.

**Planted defects:** (1) `DELETE /spaces/{id}` checks authentication only; (2) `PATCH /members/{id}` accepts `role: "admin"` from an editor (self-promotion); (3) the export job loads the space by id without a workspace filter; (4) a removed member's socket keeps receiving document events.

**A strong agent must:** call every hidden action directly as the lower role, attack the job and socket paths as well as REST, and report each with a confirmed PoC.

**Pass criteria:**
- [ ] For each control the UI hides, a direct request as the viewer is made and its response recorded.
- [ ] Defects 1-3 are reported as confirmed, each with the PoC request or test, `path:line`, and severity at least High (Critical for cross-workspace export).
- [ ] Defect 4 is found by testing a removed member's live socket, not only the REST session.
- [ ] Attack tests are added to the host's test suite; no product code is changed.
- [ ] Theoretical findings are labelled as such and not inflated.
- [ ] The report opens with a threat model naming the trust boundaries (browser to API, worker to DB, socket).

**Typical failure:** "Role checks present in `MemberMenu.tsx`" accepted as authorization; only REST endpoints tested.
