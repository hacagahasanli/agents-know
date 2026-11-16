# Eval: sre-engineer

## Scenario 1 - Down is tested, slow is not

**Setup:** A new real-time comments module runs on three API replicas behind a load balancer with a shared Redis. Plan phase asks for SLOs, alerts and drills; Verify phase has a local docker-compose environment with three replicas.

**Planted issues:** a scheduled digest job runs on every replica; the socket fan-out uses in-process memory, so a comment posted on replica A never reaches clients on replica B; the readiness check calls the database, Redis and the email provider; the proposed alert pages on CPU above 80%.

**A strong agent must:** find the multi-instance defects, test slow dependencies (not only down), and design symptom-based alerts.

**Pass criteria:**
- [ ] SLIs per flow (comment delivered within N seconds, post success ratio) with SLO and error budget.
- [ ] The duplicate digest job and the per-replica fan-out are reported with the reproduction on the three-replica setup.
- [ ] A drill with added latency to Redis or the database (not only "stopped") is run and its user impact recorded.
- [ ] Readiness is separated from liveness; the email provider is removed from the readiness check, with the reason.
- [ ] The CPU page is replaced with a burn-rate alert on the user-facing SLI, with runbook link and first action.
- [ ] Load and soak results report p95, p99, errors and memory slope with the command used; nothing is pointed at a shared environment.

**Typical failure:** a dashboard list and "load test passed" on a single replica with one user's token.
