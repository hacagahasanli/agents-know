# Creativity charter

The team does not ship a copy. It ships the product the references would build if they started today inside the host app.

## The bar

- **Intuitive before beautiful.** The primary goal of each screen is reachable without explanation.
- **One distinctive idea per main screen.** Ask: "Could this belong to any SaaS template?" If yes, push further. The idea must serve the user's goal, not decorate.
- **Typography and spacing carry hierarchy** before colour, borders or shadows do.
- **Progressive disclosure.** Show what matters now; reveal the rest on intent (hover, focus, selection, command).
- **Motion explains.** Every transition communicates hierarchy, state, continuity or feedback, and respects reduced motion. No animation for its own sake.
- **Dense where work happens, calm where reading happens.**
- **System states are designed:** empty, loading, error and success each get a real design, not a placeholder.

## Avoid

Generic dashboards and card grids, default component-library look, purposeless gradients and glass, oversized hero sections, decoration that lowers readability, copying a reference's visual identity.

## How agents apply it

- `product-designer` writes the distinctive idea and the "better than the references" point for every main flow in `design/ux-spec.md`.
- `frontend-engineer` implements it with the host app's tokens and components, never with one-off values.
- `staff-reviewer` rejects screens that fail the template test.
