---
name: office
description: Open the live office viewer - an isometric office where the agents of a run move and react as feed.md grows. Local only, no install.
argument-hint: [run-id]
disable-model-invocation: true
---

Start the viewer server in the background (no dependencies, Node 18 or newer):

```
node "${CLAUDE_PLUGIN_ROOT}/office/server.mjs" $ARGUMENTS
```

Run it with `run_in_background`. Without an argument it follows `~/.agents-know/runs/latest` and moves to the next run when that changes; with a run id it follows that run only.

Then:
1. Read the first lines of its output and take the URL it prints (`http://127.0.0.1:<port>/`, the first free port from 4747).
2. Open it: `open <url>` on macOS, `xdg-open <url>` on Linux. On any other system just print the URL.
3. Reply with the URL, the run being followed, and how to stop: ask me to stop it, or press Ctrl+C if it runs in a terminal. Stopping it never touches the run.

The server listens on 127.0.0.1 only and reads only `feed.md` (and the mode line of `brief.md`). If there is no run yet, the page says so and starts on its own once `/agents-know:fix`, `feature` or `task` creates one. Opening `office/prototype.html` directly as a file plays the demo instead.
