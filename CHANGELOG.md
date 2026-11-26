# Changelog

This project follows [Semantic Versioning](https://semver.org/). Until 1.0, minor versions may change behaviour.

## 0.6.0

- New agents: `team-reviewer` grades every agent on its record across runs (keep, retrain with the exact prompt diff, merge, retire) and writes hire briefs tied to real failures; `talent-scout` turns a hire or retrain brief into a candidate agent plus the eval it must pass. Both are read-only and write to `~/.agents-know/team/`.
- New command: `/agents-know:team [hire <role> | retrain <agent>]`.
- Guard: read-only agents may also write reports under `~/.agents-know/team/`; 5 new tests.
- Office: the team reviewer sits in the Review room, the talent scout in the Plan room.

## 0.5.0 — first public release

- Company modes: `startup`, `standard`, `bigtech`, `hardcore`.
- New agents: bar-raiser, skeptic, cartographer, dispatcher, incident-commander, upgrader.
- Guard hook: documentation files may mention destructive SQL; `.sql` and code files are still blocked.
- Public docs: README, contributing guide, security policy, CI.
