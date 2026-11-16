# Eval: debugger

## Scenario 1 - Intermittent duplicate notifications

**Setup:** Defect report: "Some users get the same mention notification two or three times." Not every time. The notification job runs on a queue with at-least-once delivery; the handler inserts a notification row and sends an email. Two similar handlers exist (comment mentions and task assignments).

**Planted cause:** the handler is not idempotent; on a worker timeout the message is redelivered and processed again. The same pattern exists in the assignment handler. A recent commit raised the job's work per message, making timeouts more frequent (trigger, not cause).

**A strong agent must:** reproduce on demand (forced redelivery), separate trigger from cause, find the sibling, and size the blast radius with a read-only query.

**Pass criteria:**
- [ ] A failing automated test reproduces duplicates by delivering the same message twice; its failing output is quoted.
- [ ] At least two hypotheses were ranked and tested (for example: duplicate enqueue vs redelivery), with the falsifying result recorded.
- [ ] Root cause (non-idempotent handler) is distinguished from the trigger (longer job, more timeouts).
- [ ] The assignment handler is listed as a sibling with evidence.
- [ ] A read-only query counting duplicate notifications is provided; no data is changed.
- [ ] The fix plan uses an idempotency key or unique constraint, not a sleep, retry change or broad catch.
- [ ] Prevention item named (test or alert).

**Typical failure:** "Raised the job timeout" as the fix, with no reproduction and no sibling search.
