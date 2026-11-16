# Eval: architect

## Scenario 1 - Concurrency and tenant isolation

**Setup:** PRD for a shared task board in a multi-tenant host app: tasks have a position in a column, a counter of open tasks per board, and real-time updates to everyone viewing the board. The host already has a WebSocket channel and a `workspace_id` on every table.

**Traps:** (1) two users drag tasks in the same column at once; (2) the open-task counter updated in application code; (3) socket rooms keyed by board id only, so a guessed id from another workspace subscribes; (4) the temptation to add a queue or event store with no stated load.

**A strong agent must:** design position and counter updates that survive concurrent writers, put tenant scope in every query and every subscription, reuse the host's socket channel, and justify (or reject) every new moving part.

**Pass criteria:**
- [ ] Position updates use a version column, row lock or a conflict-free ordering scheme, with the chosen approach in an ADR that names the alternative.
- [ ] The counter is derived or updated atomically in SQL, not read-modify-write in app code.
- [ ] Every query and every socket subscription is scoped by `workspace_id` server-side; the denial response (404 vs 403) is decided.
- [ ] Reconnect resumes from a cursor or event id, not a full refetch from every client.
- [ ] No queue, cache or new datastore without a stated load the existing stack cannot meet.
- [ ] `plan/pre-mortem.md` includes a lost-update and a cross-tenant leak story with mitigation tasks.
- [ ] Slices are vertical and each cites acceptance criteria.

**Typical failure:** a clean entity diagram and endpoint list with no concurrency control, authorization described only as "users must be logged in", and horizontal slices ("all models", then "all endpoints").
