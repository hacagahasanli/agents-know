# Reference blend

A product is rarely rebuilt from one reference. The user names several products and says what to take from each. The blend turns that into rules every agent can apply.

## Format (inside `brief.md`)

```markdown
## Reference blend

- Primary - feel, simplicity, interaction model: Linear
- Borrow - specific mechanics:
  - Jira: backlog, board columns, sprints and sprint scope changes
- Avoid - what we explicitly do not want:
  - Jira: per-project configuration sprawl, workflow editor in MVP
- Identity: the host app's design language wins over every reference
```

## Rules

1. **Primary decides by default.** When a behaviour is not covered by a borrow rule, follow the primary reference.
2. **Borrow is scoped.** A borrowed mechanic comes with its data model and edge cases, not with the borrowed product's visual style.
3. **Avoid is binding.** Agents may not reintroduce an avoided item, even if a secondary reference does it.
4. **Identity wins.** Names, icons, colours, copy and layout follow the host app. Nothing that identifies a reference product is reproduced (`ip-guard` checks this).
5. **Better than both.** For every main flow the designer states one place where the result improves on all references, and why.

## Examples

| Building | Primary | Borrow | Avoid |
| --- | --- | --- | --- |
| Team chat | Slack | - | Enterprise grid, huddles in MVP |
| Wiki | Notion | Confluence: space hierarchy, page tree, page permissions, page history | Confluence: macro sprawl, legacy editor |
| Issue tracker | Linear | Jira: backlog, board, sprint, epics | Jira: custom workflow editor, screen schemes |

## What the researcher produces per feature

| Feature | How A does it | How B does it | Blend decision | MVP / Later / Never | Edge cases |
| --- | --- | --- | --- | --- | --- |
