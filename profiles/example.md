# Profile - <name>

## Workspace
- Root: `<absolute path where you start Claude>`
- Repositories:
  - frontend: `<path>` - <stack>
  - backend: `<path>` - <stack>
- Checks to run before calling a slice green:
  - frontend: `<type check>`, `<lint>`, `<architecture check>`, `<tests>`
  - backend: `<tests>`, `<lint>`

## Language
- Conversation, reports and mentor digests: <English>

## Company mode
- Company mode: standard   <!-- startup | standard | bigtech | hardcore; see references/company-modes.md. Remove the line to be asked every run. -->

## Hard stops
- No commits or pushes; the user commits.
- Ask before adding any dependency.
- Migrations must be additive; the user runs them.
- Never delete, drop, truncate or bulk-update data; never connect to non-local databases; never read `.env` files.
- Protected paths: <list>

## Owner principles
<Your standing rules for every product, numbered. Example: mobile is perfect; one product family in the app shell; memorable names; easy migration from the replaced tool; never down, never backwards.>

## Design charter
<Path to the host app's design rules, or a short description.>

## Programme
| # | Product | Reference blend | Status | Run |
| --- | --- | --- | --- | --- |
| 1 | <product> | <primary / borrow / avoid> | planned | - |
