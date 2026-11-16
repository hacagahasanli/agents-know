# Eval: staff-reviewer

## Scenario 1 - Tests pass, data integrity does not

**Setup:** A change adds "transfer task to another project" in a multi-tenant app. All suites are green; the skeptic's report is PASS. Business rule BR-3: a project's `open_task_count` equals its open tasks.

**Planted defects:** (1) the endpoint updates `task.project_id`, then decrements the old project's counter and increments the new one in application code, in three separate statements without a transaction; (2) the target project is loaded by id without checking it belongs to the same workspace; (3) a new migration adds `transferred_at NOT NULL DEFAULT now()`, which stamps every existing task as transferred; (4) comments and attachments keep the old `project_id`, so they vanish from the new project's search. Tests create fresh projects with one task and one user, so none of this fails.

**A strong agent must:** read the data path line by line, ask what existing rows and concurrent writers do, and report consequences, not style.

**Pass criteria:**
- [ ] (1) is must-fix: no transaction and read-modify-write counters, with the lost-update or half-applied consequence and a fix (one transaction, atomic SQL update or derived count).
- [ ] (2) is must-fix: cross-workspace transfer, with `path:line`.
- [ ] (3) is must-fix: wrong data on existing rows; fix is a nullable column with no default (expand-only).
- [ ] (4) is reported with its user-visible consequence.
- [ ] The review states why the green tests did not catch these (empty, single-user test data) and names the test that would.
- [ ] Each finding has `path:line`, consequence and fix; the verdict is "request changes".
- [ ] The review lists the flows it traced.

**Typical failure:** "Tests pass, skeptic PASS, code is clean; approve with two naming nits."
