# Privacy and protection by default

The owner should never have to say "encrypt the messages" or "don't log that". Every agent assumes the data it touches belongs to real people, and protects it the way a careful bank or a top messaging company would, unless the brief says otherwise in writing.

## 1. Classify every piece of data first

In Define, the analyst adds a **data classification table** to the PRD: every stored field, file and log line the product creates, with its class.

| Class | Examples | Default protection |
| --- | --- | --- |
| Secret | Passwords, API tokens, bot tokens, OAuth refresh tokens, signing keys, webhook URLs | Never stored in plain text: hash (tokens you only compare) or encrypt with a managed key (secrets you must reuse). Never logged, never returned after creation. |
| Private content | Direct and group messages, private channel messages, attachments, drafts, comments on HR requests, personal notes, documents in restricted spaces | Encrypted at rest at the application level, decrypted only for authorised readers. Excluded from logs, analytics, error reports and search snippets for people without access. |
| Personal data | Names, emails, phone numbers, birthdays, leave types and reasons, salary or HR documents | Least-privilege access, audit of reads by admins, no copies in logs, export and deletion path defined. |
| Internal | Public channel messages, wiki pages visible to all staff, issue titles | Protected by authentication and authorization; encryption decided per product in an ADR. |
| Public | Marketing copy, public help pages | No special protection. |

If unsure, choose the stricter class.

## 2. What "encrypted at rest" means here

- **Application-level encryption** for private content and reusable secrets: the database stores ciphertext; a database dump, a backup, a replica or a person with SQL access cannot read the content.
- **Envelope encryption:** each record (or each conversation) uses a data key; data keys are encrypted with a master key held outside the database (Vault, KMS or an environment secret), never in the repository.
- **Key identifiers and rotation:** every ciphertext stores a key id so keys can rotate without downtime; old keys stay readable until re-encryption finishes.
- **Authenticated encryption** (for example AES-256-GCM or a vetted library such as Fernet or libsodium); never home-made crypto, never ECB, never a fixed IV.
- **Disk or volume encryption** of the database server is good but not enough on its own: it does not protect against database access, dumps or backups.

## 3. The trade-offs must be decided, not discovered

Encryption changes other features. The architect writes an ADR for each:

- **Search:** encrypted text cannot be searched with plain SQL. Options: a separate search index protected like the content, blind indexes for exact matches, or search inside the application after decryption for small scopes. Choose and document.
- **Performance:** measure encrypt and decrypt cost on the hot paths (sending, loading history).
- **Migration of existing data:** existing plain-text rows are encrypted by an idempotent, resumable background job run by the user, with a dual-read period (read both shapes) so there is no downtime. Never a bulk SQL update from an agent.
- **Admin access:** admins do not get plain-text access to private content by default. Any exception (legal hold, export) is explicit, permissioned and audited.
- **Bots and integrations:** they receive only what their scope allows.

## 4. Never leak through the side doors

- Logs, traces and error messages contain identifiers, never message bodies, file contents, tokens or personal details.
- Notifications (push, email, Slack-style previews) respect privacy settings and never reveal private content to people or devices without access.
- Analytics events carry no content.
- URLs carry no personal data or tokens.
- Caches, search indexes, thumbnails and exports are protected at the same class as the source.
- Deleted content is really gone from the product views, and its retention and backup lifetime is defined.

## 5. Proof

| Check | Evidence |
| --- | --- |
| Raw storage test | A test reads the private-content columns and files directly from the test database and storage and asserts they are not plain text |
| Log and error scan | A test triggers errors and checks logs and responses contain no content or secrets |
| Key handling | Master key loaded from configuration; rotation test reads data written with an old key |
| Access paths | Non-member, removed member, admin and bot each get exactly what the policy says |
