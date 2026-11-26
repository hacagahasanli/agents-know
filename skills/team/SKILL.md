---
name: team
description: Performance review of the agents themselves - who keeps their seat, who needs a prompt rewrite, who should be merged or retired, and which role is missing. With "hire <role>", the talent scout drafts and trial-tests a new agent.
argument-hint: [hire <role> | retrain <agent>]
disable-model-invocation: true
---

The agents are graded on their record, never on their prompts. Nothing here changes an agent file on its own.

- **No argument:** run `agents-know:team-reviewer` over every run in `~/.agents-know/runs/`. Show the user the recommendation table from `~/.agents-know/team/reviews/<date>-review.md`, the agents marked `NOT ENOUGH DATA`, and the path of `SCORECARD.md`. Ask which recommendations to apply.
- **`hire <role>` or `retrain <agent>`:** run `agents-know:talent-scout` with the matching brief from the latest review, or with `$ARGUMENTS` and the failure the user names. If the user names no failure, ask for one before starting.
- **Trial:** when the scout's trial plan is ready, run it yourself (subagents cannot start subagents): give a general agent the candidate file as its full instructions and the eval's setup as its brief, then have `skeptic` and `bar-raiser` judge the output against the eval's pass criteria. Write the result into `~/.agents-know/team/candidates/<name>-trial.md` and pass it back to the scout for the recommendation.
- **Applying** a `RETRAIN`, `MERGE`, `RETIRE` or `HIRE` is a change to the plugin's `agents/` (or a local override in the project's `.claude/agents/`), made only after the user says yes. Never delete an agent file: move a retired one to `~/.agents-know/team/retired/`.
