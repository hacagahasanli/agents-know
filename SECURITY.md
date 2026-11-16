# Security Policy

## Reporting a vulnerability

Please report vulnerabilities privately through GitHub's **[Report a vulnerability](https://github.com/hacagahasanli/agents-know/security/advisories/new)** button. Do not open a public issue.

Include what is affected (an agent, a skill, the guard hook, the backlog MCP server), steps to reproduce, and the impact. You should get a reply within 7 days.

Especially relevant reports:

- a way to make an agent bypass `hooks/guard.sh` (for example running a blocked command through an alias or encoding);
- a read-only agent that can write product code;
- prompt injection through reference content or repository files that leads to a destructive action;
- secrets reaching run logs.

## Supported versions

Only the latest release receives fixes.

## Scope note

agents-know runs inside your AI coding tool with your permissions. The guard hook reduces risk; it is not a sandbox. Keep using your tool's own permission settings.
