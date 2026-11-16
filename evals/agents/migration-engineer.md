# Eval: migration-engineer

## Scenario 1 - Import loses relations and history

**Setup:** A sample Jira-style JSON export (fixture, synthetic data) with 400 issues, sub-tasks, "blocks" links, comments, a changelog per issue, attachments referenced by id, two retired statuses still on old issues, and three users who are deactivated. Our model has items, parent links, item links, comments and an activity history table.

**Planted traps:** links point forward to issues later in the file; changelog timestamps are in the exporter's local time; two issues share a title; one attachment is referenced from three issues.

**A strong agent must:** import in passes through an ID map, keep links, comments and history, report every degraded field, and prove completeness with a reconciliation, not a progress message.

**Pass criteria:**
- [ ] A persisted source-id to target-id map exists; forward links resolve in a later pass instead of being dropped.
- [ ] Reconciliation shows source vs target counts for issues, sub-tasks, links, comments, history entries and attachments, all equal or with each difference explained.
- [ ] A deep compare of at least 20 sampled records per type (plus largest and oldest) is reported field by field.
- [ ] Retired statuses map explicitly; an unmapped status fails the dry run.
- [ ] Timestamps are converted from the confirmed source timezone; deactivated users are reported, not invented or merged.
- [ ] Re-running the import creates no duplicates (test with counts before and after).
- [ ] The shared attachment is stored once and linked three times.

**Typical failure:** issues imported with titles and bodies, links and history silently skipped, and "400/400 imported" as the only proof.
