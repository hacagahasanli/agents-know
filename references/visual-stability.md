# Visual stability

Nothing on screen may jump, resize, flicker or reflow when data arrives, when a state changes, or when the user acts. Users read jumps as bugs. The designer specifies stability, the frontend engineer builds it, QA and performance prove it.

## Rules

1. **Skeletons are the final layout.** A skeleton has the same container, grid, padding, gaps, line heights, avatar and image sizes, row heights and number of rows as the loaded content at every breakpoint. When data arrives, only the content swaps in; no element moves by a single pixel. Build skeletons from the same layout components as the content, not as separate drawings.
2. **Containers do not grow when data arrives.** Modals, drawers, bottom sheets, popovers, cards and panels open at their final size (a fixed or min size from the spec, or the size of their skeleton) and keep it while loading. Long content scrolls inside a container with a fixed max size; it never pushes the container wider or taller after opening.
3. **Reserve space for everything that loads.** Images, avatars, video, embeds, charts and maps have explicit width and height or `aspect-ratio`. Badges, counters, buttons that change label ("Save" to "Saving..."), and validation messages have reserved space or fixed widths (tabular numbers for counters).
4. **No layout shift from fonts or icons.** Fonts use the host's loading strategy with matched fallback metrics; icons have fixed boxes.
5. **No flash of states.** Do not show a spinner or skeleton for responses faster than about 150-300 ms (delay the indicator), and once shown keep it long enough not to blink. Keep previous data visible while refetching (stale-while-revalidate), never empty the list then refill it.
6. **Lists stay put.** New items, real-time updates and pagination never move what the user is reading: keep scroll anchored (chat history loading upwards keeps the visible message in place), insert above the viewport without shifting, show "new messages" instead of jumping.
7. **Same element through states.** Empty, loading, error and loaded states share one container with the same size; switching between them does not resize the page.
8. **Motion explains, never reflows.** Animate with transform and opacity, not width, height, top or left; expand and collapse animations do not move unrelated content abruptly; respect reduced motion.
9. **Mobile keyboard and viewport.** Opening the on-screen keyboard or the browser toolbar does not make layouts jump; use the visual viewport and dynamic viewport units deliberately.
10. **Theme and language switches** do not change element sizes unexpectedly; long translations are designed for, not discovered.

## Who does what

| Role | Responsibility |
| --- | --- |
| Product designer | For each screen and component: skeleton layout, the fixed or min size of every modal, sheet and panel, reserved space for loading content, state transitions and delays. Written in `design/ux-spec.md`. |
| Frontend engineer | Builds skeletons from the same layout as the content; fixed container sizes; aspect ratios; delayed indicators; kept previous data; anchored scroll. |
| QA engineer | Loading-versus-loaded comparison: screenshot of the skeleton and of the loaded state at 320, 390 and 1280 px; element boxes of the main containers must match. Slow network (throttled) and very fast network runs. |
| Performance engineer | Cumulative Layout Shift ≤ 0.1 at p75 is the floor; for the product's own screens the target is 0 shift after first render, measured with a layout-shift observer during load, refetch, real-time update, modal open and pagination. |
| Product designer (design review) | Watches the flow on throttled network and flags any jump, resize or blink as a finding. |

## Proof

| Check | Evidence |
| --- | --- |
| Skeleton matches loaded layout | Paired screenshots and a test comparing bounding boxes of key containers before and after data |
| Modals and sheets keep their size | Box size at open and after data in a test |
| No unexpected layout shift | Layout-shift entries recorded in Playwright during the main flows, with the total per flow |
| No blinking indicators | Fast and slow network runs; indicator shown only on the slow run |
