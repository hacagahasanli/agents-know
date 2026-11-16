# Global standards

Whenever the user asks for something, every agent measures its work against the standard that applies, not against a minimum that happens to work. Where a host repository already defines a stricter rule, the host rule wins.

## Checklist

| Area | Standard | Bar |
| --- | --- | --- |
| Security | OWASP ASVS 4.0.3 | Level 2 for anything with personal or company data |
| Web risks | OWASP Top 10 (2021) and OWASP API Security Top 10 (2023) | Every item considered in the threat model |
| Accessibility | WCAG 2.2 | AA on every new screen |
| Web performance | Core Web Vitals | LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 at p75; 0 unexpected shift after first render on our own screens (`visual-stability.md`) |
| Quality model | ISO/IEC 25010 | Functional suitability, reliability, usability, security, maintainability reviewed |
| HTTP | RFC 9110 semantics | Correct methods, status codes, idempotency |
| Real-time | RFC 6455 | Origin checks, auth before subscribe, backpressure |
| Privacy | Privacy by design (GDPR principles), `privacy-by-default.md` | Classification, encryption at rest for private content and secrets, minimisation, retention, deletion |
| Cryptography | OWASP Cryptographic Storage Cheat Sheet, NIST SP 800-57 key management | Authenticated encryption, managed keys, rotation |
| Configuration | Twelve-Factor App, config section | No secrets in code or bundles |
| Versioning | Semantic Versioning 2.0 | For any published API or package |
| Reliability | Google SRE practices (SLOs, error budgets) | Every main flow has an SLO and an alert |
| Supply chain | OWASP Top 10 A06, OpenSSF Scorecard signals | No known high vulnerabilities; licence compatible; maintained |
| AI features | OWASP Top 10 for LLM Applications, NIST AI RMF | Evals with thresholds, injection and leakage tests, cost budget |
| i18n | Unicode CLDR plural rules | No concatenated sentences, every string translatable |

## Edge-case lens

Before calling a feature done, walk it through every row:

- **States:** empty, loading, partial, error, offline, reconnecting, permission denied, not found, deleted.
- **People:** first user, a user with no permissions, an admin, a removed member, a deactivated account, two users editing the same thing.
- **Data:** zero, one, many, very many (pagination), very long text, emoji and RTL text, duplicates, unicode names.
- **Time:** time zones, daylight saving, server vs client clock, ordering of concurrent events.
- **Network:** slow, dropped, retried, duplicated delivery, out-of-order delivery.
- **Abuse:** guessed identifiers, replayed requests, oversized payloads, rate of requests, injected markup.
- **Devices:** 320 px phone, tablet, desktop, keyboard only, screen reader, reduced motion.
