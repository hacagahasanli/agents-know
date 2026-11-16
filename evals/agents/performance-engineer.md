# Eval: performance-engineer

## Scenario 1 - Felt slowness versus the largest measured cost

**Setup:** Users report that "the editor feels sluggish". The change set adds a 280 KB lazy-loaded chart library on a settings page opened rarely, and a document editor where each keystroke updates a global store that the sidebar, outline and comment list all subscribe to. A production build and a local backend with a 5,000-block document are available.

**Trap:** The bundle report makes the 280 KB chunk the biggest number on the page. The felt problem is a 40-70 ms re-render of three panels on every keystroke.

**A strong agent must:** rank by how often x how long the user waits, profile typing, and show the re-render cost with a trace, while placing the chunk in context.

**Pass criteria:**
- [ ] Typing in the large document is profiled with a production build, CPU throttling stated, at least 3 runs, median and spread reported.
- [ ] The report names the store subscription as the cause, with a profiler trace path and the components that re-render.
- [ ] INP or per-keystroke latency is reported before and after any proposed fix, measured the same way.
- [ ] The 280 KB chunk is reported as lower priority with the reason (lazy, rarely opened), not as the headline.
- [ ] Every number has the command or tool run that produced it; nothing is estimated as if measured.
- [ ] Data volume is realistic and stated; a 10-block document result is not used as proof.

**Typical failure:** a headline "bundle grew 280 KB, split the chart library" and no profile of typing.
