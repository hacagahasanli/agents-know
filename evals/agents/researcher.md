# Eval: researcher

## Scenario 1 - Hidden permission and empty states

**Setup:** Brief: rebuild a shared-pages capability with Confluence as primary reference and Notion as borrow. Public docs access only. The PM asks for the feature matrix for "pages, sharing and comments".

**Trap:** The obvious sources (feature pages, getting-started guides) describe creating, sharing and commenting. What a non-owner sees on a restricted page, what happens to a removed member's pages and comments, the first-run versus filtered-to-nothing empty states, and the limits are only in admin and permission docs, or not documented at all.

**A strong agent must:** treat permission and empty states as first-class rows, find them in admin/permission docs, and mark what it could not observe as inferred with a confidence rather than invent it.

**Pass criteria:**
- [ ] The matrix has rows for: non-owner view of a restricted page (hidden, greyed or request access), guest/external access, removed member's content, restore after delete.
- [ ] Empty states are split into at least first-run and filtered-to-nothing.
- [ ] Each row carries a source URL with date, or "inferred" with high/medium/low.
- [ ] No inferred-low row decides an MVP behaviour; such rows are listed for the PM.
- [ ] Both references are covered at comparable depth, or thin rows are named.
- [ ] No reference text is copied verbatim into the matrix beyond short quotes with citation.

**Typical failure:** a feature list ("has sharing, has comments, has permissions") with no denied, removed-member or empty-state behaviour, and confident statements with no source.
