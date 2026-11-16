# Safe migrations on a live database

The production database is in use while a release goes out. A migration that locks a busy table for seconds is an outage. Every agent that writes or reviews a migration checks each row below.

| Operation | Risk | Safe pattern |
| --- | --- | --- |
| Create a new table | None | Fine |
| Add a nullable column without default | Very low | Fine |
| Add a column with a constant default | Safe on PostgreSQL 11+, rewrites the table on older versions and other engines | Check the server version; otherwise add nullable, backfill in batches, then set default |
| Add a column with a volatile default (`now()`, `uuid`) | Rewrites the table | Add nullable, backfill in batches, then set default |
| Add `NOT NULL` to an existing column | Full scan under lock | Add a `CHECK (col IS NOT NULL) NOT VALID`, validate separately, then set `NOT NULL` in a later release |
| Create an index on an existing table | Blocks writes for the whole build | `CREATE INDEX CONCURRENTLY` outside a transaction (in Alembic: `autocommit_block()`) |
| Add a foreign key | Locks both tables while validating | Add with `NOT VALID`, then `VALIDATE CONSTRAINT` separately |
| Add a unique constraint | Index build under lock | Build a unique index concurrently, then attach it |
| Change a column type | Usually rewrites the table | New column, dual write, backfill, switch reads, drop later |
| Rename or drop | Breaks running code and old clients | Never in the same release; expand, migrate, contract later (and contraction is the user's decision) |
| Backfill data | Long transactions, lock pile-ups, replication lag | Idempotent job, batches of a few thousand rows by primary key, resumable, run by the user |

## Rules

- Set `lock_timeout` (for example 5 s) and `statement_timeout` in migrations that take locks, so a blocked migration fails instead of queuing every request behind it.
- One concern per migration; long data work is never inside a schema migration.
- Every migration runs against the isolated test database in the run, upgrade and downgrade where the host keeps downgrades, and the output is the evidence.
- Estimate the table size from the host's models and any numbers the user gives; when unknown, assume the table is large.
- Queries that a new screen runs often have an index and an `EXPLAIN` from the test database in the evidence; no N+1 in list endpoints.
