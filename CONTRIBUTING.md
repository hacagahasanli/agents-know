# Contributing to agents-know

Thanks for helping. The most valuable contributions are new agents, sharper quality gates, platform adapters and bug reports with a reproduction.

## Ground rules

- **Evidence over claims.** A PR that changes behaviour shows how it was tested.
- **Small and focused.** One agent, one gate or one fix per PR.
- **Never weaken safety.** Changes to `hooks/guard.sh` need a test in `tests/guard.test.sh`, and a PR that removes a block must explain why it is safe.
- **No copied identity.** Don't add names, logos, copy or code from other products.

## Local setup

```bash
git clone https://github.com/hacagahasanli/agents-know
claude --plugin-dir ./agents-know
```

Checks before a PR:

```bash
claude plugin validate .
bash tests/guard.test.sh
```

## Adding an agent

1. Copy an existing file in `agents/` that is closest to your role.
2. Keep the frontmatter: `name`, `description` (when to use it, in one or two sentences), and tools.
3. Give it a single responsibility, clear inputs and outputs, and a handback format the PM can check.
4. Read-only reviewers must be added to the read-only list in `hooks/guard.sh`, with a test.
5. Mention it in the README team table.

## Adding a gate

Gates live in `references/quality-gates.md`. A gate needs a measurable pass condition and the agent that checks it.

## Reporting bugs

Use the bug template. Include the command you ran, what you expected, what happened, and the relevant lines from `~/.agents-know/runs/<run>/feed.md`. Remove anything private first.

## Security issues

Please don't open a public issue. See [SECURITY.md](SECURITY.md).
