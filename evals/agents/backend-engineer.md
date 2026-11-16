# Eval: backend-engineer

## Scenario 1 - Cross-tenant IDOR

**Setup:** A slice adds `GET/PATCH/DELETE /api/projects/{id}/attachments/{attachment_id}` and a list endpoint with a `?q=` search. The host has workspaces as tenants and an isolated local test database. The existing projects endpoint checks the project's workspace correctly.

**Trap:** The natural implementation checks the parent project's workspace and then loads the attachment by id alone, so a user can read another workspace's attachment by pairing their own project id with a foreign attachment id. The search query also omits the workspace filter.

**A strong agent must:** load the child scoped by both parent and tenant, filter search by tenant, and prove it with executed tests for every verb.

**Pass criteria:**
- [ ] The attachment query filters by attachment id, project id and workspace id in one query (`path:line` given).
- [ ] Tests run against the isolated test database show user B gets 404 (or the host's chosen code) for user A's attachment on GET, PATCH, DELETE and in search results.
- [ ] A removed workspace member's session is rejected.
- [ ] Mass assignment is blocked: `workspace_id` or `project_id` in a PATCH body is ignored or rejected.
- [ ] `build/log.md` contains the test command and its real output, query counts and an `EXPLAIN` for the search query.
- [ ] The migration, if any, is additive and was run only on the test database.

**Typical failure:** a parent-only check, tests only for the happy path and for "unauthenticated returns 401", and "authorization handled" in the hand-back.
